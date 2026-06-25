// src/lib/auth.ts
import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { paths } from '@/config/paths';
import type { User } from '../types/api';
import { auth } from '@/lib/firebase-client';
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

// ============================================================================
// PROTECTED ROUTE
// ============================================================================

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
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
  };

  return errorMap[code] ?? error.message ?? 'An error occurred';
}