import { QueryClient, useQueryClient } from '@tanstack/react-query';
import React, { lazy, useMemo } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import type { ActionFunction, LoaderFunction } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '@/config/paths';
import { ProtectedRoute, PublicRoute } from '@/lib/auth';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';

const AuthPage = lazy(() => import('@/app/routes/auth/auth'));

type RouteModule = {
  clientLoader?: (qc: QueryClient) => LoaderFunction;
  clientAction?: (qc: QueryClient) => ActionFunction;
  default: React.ComponentType;
  [key: string]: unknown;
};

const convert = (queryClient: QueryClient) => (m: RouteModule) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: (
        <PublicRoute>
          <Outlet />
        </PublicRoute>
      ),
      children: [
        {
          index: true,
          lazy: () => import('@/app/routes/landing').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.auth.register.path,
      element: (
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      ),
    },
    {
      path: paths.auth.login.path,
      element: (
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      ),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          lazy: () =>
            import('./routes/app/dashboard').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.app.generate.path,
      element: (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          lazy: () =>
            import('./routes/app/generate').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.app.settings.path,
      element: (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          lazy: () =>
            import('./routes/app/settings').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.app.planDetail.path,
      element: (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          index: true,
          lazy: () =>
            import('./routes/app/plan-detail').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};