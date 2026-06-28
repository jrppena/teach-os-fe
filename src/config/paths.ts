export const paths = {
    home: {
      path: '/',
      getHref: () => '/',
    },
  
    auth: {
      register: {
        path: '/auth/register',
        getHref: (redirectTo?: string | null) =>
          `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      },
      login: {
        path: '/auth/login',
        getHref: (redirectTo?: string | null) =>
          `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      },
    },
  
    // Authenticated app area. Minimal for now — root layout + dashboard index.
    // Add discussions/users/profile here as those features are built.
    app: {
      root: {
        path: '/app',
        getHref: () => '/app',
      },
      dashboard: {
        path: '', // index route under /app
        getHref: () => '/app',
      },
      // Lesson-plan generator wizard — primary post-auth landing page.
      generate: {
        path: '/generate',
        getHref: () => '/generate',
      },
      // Saved lesson-plan detail view (read/edit a generated plan).
      planDetail: {
        path: '/plans/:id',
        getHref: (id: string) => `/plans/${id}`,
      },
      // User configuration (AI-provider API keys, etc.).
      settings: {
        path: '/settings',
        getHref: () => '/settings',
      },
      // Send-feedback page (category + optional rating + message).
      feedback: {
        path: '/feedback',
        getHref: () => '/feedback',
      },
      // Guided first-time setup wizard (welcome → school info → AI key).
      onboarding: {
        path: '/onboarding',
        getHref: () => '/onboarding',
      },
    },
  } as const;