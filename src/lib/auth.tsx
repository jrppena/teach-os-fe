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
  User as FirebaseUser,
} from 'firebase/auth';
import { paths } from '@/config/paths';
import { User } from '../types/api';
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

export const registerInputSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    password: z.string().min(5, 'Required'),
  })
  .and(
    z
      .object({
        teamId: z.string().min(1, 'Required'),
        teamName: z.null().default(null),
      })
      .or(
        z.object({
          teamName: z.string().min(1, 'Required'),
          teamId: z.null().default(null),
        }),
      ),
  );
export type RegisterInput = z.infer<typeof registerInputSchema>;

// ============================================================================
// HELPERS
// ============================================================================

const getUserFromAPI = async (firebaseUID: string): Promise<User> => {
  const response = await api.get(`/auth/user/${firebaseUID}`);
  return response.data;
};

const mapFirebaseUserToAuthHeader = (fbUser: FirebaseUser): void => {
  // Get Firebase ID token and attach to API headers for subsequent requests
  fbUser.getIdToken().then((token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  });
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
        mapFirebaseUserToAuthHeader(fbUser);
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
    mapFirebaseUserToAuthHeader(credential.user);
    return await getUserFromAPI(credential.user.uid);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
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

    // Attach token to API for the next request
    mapFirebaseUserToAuthHeader(credential.user);

    // Create user record in PostgreSQL via API
    const response = await api.post('/auth/register', {
      firebaseUID: credential.user.uid,
      email: credential.user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      teamId: data.teamId || null,
      teamName: data.teamName || null,
      role: 'USER',
      bio: '',
    });

    return response.data; // Returns the User object from DB
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
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