// Authentication utilities: Firebase Auth integration, react-query-auth config,
// validation schemas, route guards (ProtectedRoute / PublicRoute), and Google
// OAuth primitives (googleLogin, googleSignupStart, googleSignupComplete, cancelGoogleSignup).
import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  getAdditionalUserInfo,
  deleteUser,
  linkWithCredential,
  EmailAuthProvider,
  type User as FirebaseUser,
} from 'firebase/auth';
import { paths } from '@/config/paths';
import type { User } from '../types/api';
import { auth, googleProvider } from '@/lib/firebase-client';
import { api } from '@/lib/api-client';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

// ============================================================================
// HELPERS
// ============================================================================

// Note: the api-client response interceptor already unwraps `response.data`, so
// these calls resolve to the parsed body directly — do NOT read `.data` again.
// Axios's static types still describe an AxiosResponse, hence the casts.
const getUserFromAPI = async (firebaseUID: string): Promise<User> => {
  return (await api.get(`/auth/user/${firebaseUID}`)) as unknown as User;
};

// Attach the Firebase ID token as a Bearer header. Awaited (not fire-and-forget)
// so the token is present before any backend call that depends on it.
const attachAuthHeader = async (fbUser: FirebaseUser): Promise<void> => {
  const token = await fbUser.getIdToken();
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

const getUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      unsubscribe();

      if (!fbUser) {
        resolve(null);
        return;
      }

      try {
        await attachAuthHeader(fbUser);
        const user = await getUserFromAPI(fbUser.uid);
        resolve(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        resolve(null);
      }
    });
  });
};

const loginWithEmailAndPassword = async (data: LoginInput): Promise<User> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
    await attachAuthHeader(credential.user);
    return await getUserFromAPI(credential.user.uid);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error), { cause: error });
  }
};

const registerWithEmailAndPassword = async (data: RegisterInput): Promise<User> => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    // Set display name in Firebase Auth
    await updateProfile(credential.user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // Attach token before the backend call (must be awaited)
    await attachAuthHeader(credential.user);

    // Create user record in PostgreSQL via API. The interceptor unwraps the body,
    // so this resolves to the created User directly.
    const user = (await api.post('/auth/register', {
      firebaseUID: credential.user.uid,
      email: credential.user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'USER',
      bio: '',
    })) as unknown as User;

    return user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error), { cause: error });
  }
};

const logout = async (): Promise<void> => {
  await signOut(auth);
  // Clear auth header
  delete api.defaults.headers.common['Authorization'];
};

// ============================================================================
// AUTH CONFIG
// ============================================================================

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => loginWithEmailAndPassword(data),
  registerFn: async (data: RegisterInput) => registerWithEmailAndPassword(data),
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

// Cache key used internally by react-query-auth — exported so custom mutations
// can call setQueryData(USER_QUERY_KEY, user) to update the shared auth cache.
export const USER_QUERY_KEY = ['authenticated-user'];

// ============================================================================
// ROUTE GUARDS
// ============================================================================

/**
 * Renders children only when the user is authenticated.
 * Redirects unauthenticated users to login, preserving the intended path.
 * Returns null while the auth check is in-flight so AuthLoader's spinner
 * stays visible instead of flashing a premature redirect.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (user.isLoading) return null;

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};

/**
 * Renders children only when the user is NOT authenticated (public pages).
 * Redirects already-logged-in users to the app dashboard, honoring any
 * `redirectTo` query param that may have been set by ProtectedRoute.
 * Returns null while the auth check is in-flight.
 */
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (user.isLoading) return null;

  if (user.data) {
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') ?? paths.app.root.getHref();
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// ============================================================================
// FIREBASE ERROR MAPPING
// ============================================================================

function getFirebaseErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'An unexpected error occurred';
  }

  const code = (error as any)?.code;

  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'Email not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already in use',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email format',
    // Google / popup-specific codes
    'auth/popup-closed-by-user': 'The sign-in window was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',
    'auth/account-exists-with-different-credential':
      'An account already exists with this email using a different sign-in method.',
    'auth/invalid-credential':
      'Invalid email or password. If you signed in with Google, use "Sign in with Google" instead.',
  };

  return errorMap[code] ?? error.message ?? 'An error occurred';
}

// ============================================================================
// GOOGLE AUTH PRIMITIVES
// ============================================================================

/**
 * Sign in with Google for an *existing* Teacher OS account.
 * Throws a friendly error if the Google account has never been registered.
 * @returns The canonical User from the backend DB.
 */
export const googleLogin = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const info = getAdditionalUserInfo(result);

    if (info?.isNewUser) {
      // Orphan Firebase account created — delete it so the teacher can sign up cleanly.
      await deleteUser(result.user);
      throw new Error('No account found. Please sign up with Google.');
    }

    await attachAuthHeader(result.user);
    return await getUserFromAPI(result.user.uid);
  } catch (error) {
    // Re-throw our own Error instances unchanged; map Firebase codes for others.
    if (error instanceof Error && !(error as any).code) throw error;
    throw new Error(getFirebaseErrorMessage(error), { cause: error });
  }
};

/** Shape returned by googleSignupStart for a brand-new Google account. */
export type GoogleSignupStartResult =
  | { isNewUser: true; prefill: { firstName: string; lastName: string }; user: null }
  | { isNewUser: false; prefill: null; user: User };

/**
 * First step of the Google sign-up flow.
 * - If the Google account is already registered, returns the existing User (log them in).
 * - If it's a new account, returns prefill data for the name-prompt step and keeps
 *   the Firebase session alive so googleSignupComplete can call auth.currentUser.
 */
export const googleSignupStart = async (): Promise<GoogleSignupStartResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await attachAuthHeader(result.user);
    const info = getAdditionalUserInfo(result);

    if (!info?.isNewUser) {
      const user = await getUserFromAPI(result.user.uid);
      return { isNewUser: false, prefill: null, user };
    }

    // Derive name from Google profile; fall back to splitting displayName.
    const profile = info.profile as Record<string, unknown> | null;
    const firstName =
      (profile?.given_name as string | undefined) ??
      result.user.displayName?.split(' ')[0] ??
      '';
    const lastName =
      (profile?.family_name as string | undefined) ??
      result.user.displayName?.split(' ').slice(1).join(' ') ??
      '';

    return { isNewUser: true, prefill: { firstName, lastName }, user: null };
  } catch (error) {
    if (error instanceof Error && !(error as any).code) throw error;
    throw new Error(getFirebaseErrorMessage(error), { cause: error });
  }
};

/**
 * Second step of the Google sign-up flow — called after the teacher confirms their name.
 * Links an email/password credential to the Google Firebase account so the teacher
 * can sign in with either method going forward. Uses auth.currentUser left alive by
 * googleSignupStart.
 * @param firstName - Teacher's first name.
 * @param lastName  - Teacher's last name.
 * @param password  - Password to link to the Firebase account.
 * @returns The newly created User from the backend DB.
 */
export const googleSignupComplete = async (
  firstName: string,
  lastName: string,
  password: string,
): Promise<User> => {
  try {
    const fbUser = auth.currentUser;
    if (!fbUser) throw new Error('No active Google session. Please try signing up again.');

    // Link email/password before creating the backend record so a failure here
    // leaves no orphaned backend row.
    const credential = EmailAuthProvider.credential(fbUser.email!, password);
    await linkWithCredential(fbUser, credential);

    const user = (await api.post('/auth/register', {
      firebaseUID: fbUser.uid,
      email: fbUser.email,
      firstName,
      lastName,
      role: 'USER',
      bio: '',
    })) as unknown as User;

    return user;
  } catch (error) {
    if (error instanceof Error && !(error as any).code) throw error;
    throw new Error(getFirebaseErrorMessage(error), { cause: error });
  }
};

/**
 * Cancel the pending Google sign-up — signs out the Firebase session and clears
 * the auth header so the teacher is returned to the unauthenticated tabs.
 */
export const cancelGoogleSignup = async (): Promise<void> => {
  await signOut(auth);
  delete api.defaults.headers.common['Authorization'];
};