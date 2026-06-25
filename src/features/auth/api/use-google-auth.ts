/* -------------------------------------------------------------------------- */
/*  Google auth controller hooks                                               */
/*                                                                             */
/*  Wraps the Google sign-in/sign-up primitives from `src/lib/auth.tsx` in    */
/*  TanStack React Query mutations and updates the react-query-auth cache      */
/*  directly via `setQueryData(USER_QUERY_KEY, user)`.                        */
/*                                                                             */
/*  Exports:                                                                   */
/*   - useGoogleLogin()  — single-step "Sign in with Google" for existing     */
/*     accounts.                                                               */
/*   - useGoogleSignup() — two-step flow: start() → (name prompt) → complete  */
/*     / cancel().                                                             */
/* -------------------------------------------------------------------------- */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  googleLogin,
  googleSignupStart,
  googleSignupComplete,
  cancelGoogleSignup,
  USER_QUERY_KEY,
  type GoogleSignupStartResult,
} from '@/lib/auth';
import type { User } from '@/types/api';

// ── useGoogleLogin ────────────────────────────────────────────────────────────

/**
 * Single-step Google sign-in for teachers who already have an account.
 * On success, writes the User into the react-query-auth cache so useUser()
 * updates instantly.
 *
 * @returns TanStack mutation object with mutate / isPending / isError / error.
 */
export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation<User, Error>({
    mutationFn: googleLogin,
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user);
    },
  });
}

// ── useGoogleSignup ───────────────────────────────────────────────────────────

interface GoogleSignupState {
  /** Pre-fill data set after start() resolves with isNewUser === true. */
  pendingPrefill: { firstName: string; lastName: string } | null;
  isPending: boolean;
  error: string | null;
}

/**
 * Two-step Google sign-up controller.
 *
 * Flow:
 *   1. Call start() — opens the Google popup.
 *      - Existing account: writes user to cache; caller should navigate.
 *      - New account: sets pendingPrefill; render <GoogleNameStep />.
 *   2. Call complete(firstName, lastName) — POSTs to /auth/register,
 *      writes the new User to cache; caller should navigate.
 *   3. Call cancel() — signs out the Firebase session and resets state.
 *
 * @returns { start, complete, cancel, pendingPrefill, isPending, error }
 */
export function useGoogleSignup() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<GoogleSignupState>({
    pendingPrefill: null,
    isPending: false,
    error: null,
  });

  /**
   * Opens the Google popup. Returns the existing User if the account was
   * already registered (caller navigates), or null if the name step is shown.
   */
  const start = async (): Promise<User | null> => {
    setState({ pendingPrefill: null, isPending: true, error: null });
    try {
      const result: GoogleSignupStartResult = await googleSignupStart();

      if (!result.isNewUser) {
        queryClient.setQueryData(USER_QUERY_KEY, result.user);
        setState({ pendingPrefill: null, isPending: false, error: null });
        return result.user;
      }

      setState({ pendingPrefill: result.prefill, isPending: false, error: null });
      return null;
    } catch (err) {
      setState({ pendingPrefill: null, isPending: false, error: (err as Error).message });
      return null;
    }
  };

  /**
   * Completes sign-up after the teacher confirms their name.
   * Writes the new User to cache; caller navigates.
   */
  const complete = async (firstName: string, lastName: string, password: string): Promise<User | null> => {
    setState((s) => ({ ...s, isPending: true, error: null }));
    try {
      const user = await googleSignupComplete(firstName, lastName, password);
      queryClient.setQueryData(USER_QUERY_KEY, user);
      setState({ pendingPrefill: null, isPending: false, error: null });
      return user;
    } catch (err) {
      setState((s) => ({ ...s, isPending: false, error: (err as Error).message }));
      return null;
    }
  };

  /** Cancels the pending sign-up — signs out Firebase and resets local state. */
  const cancel = async (): Promise<void> => {
    await cancelGoogleSignup();
    setState({ pendingPrefill: null, isPending: false, error: null });
  };

  return {
    start,
    complete,
    cancel,
    pendingPrefill: state.pendingPrefill,
    isPending: state.isPending,
    error: state.error,
  };
}
