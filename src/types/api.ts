export type BaseEntity = {
    id: string;
    createdAt: string; // ISO-8601 timestamp from the backend
  };
  
  export type Entity<T> = {
    [K in keyof T]: T[K];
  } & BaseEntity;
  
  export type Meta = {
    page: number;
    total: number;
    totalPages: number;
  };
  
  // Current step of the guided onboarding wizard. Mirrors the backend
  // ``OnboardingStep`` StrEnum. A non-'COMPLETED' value redirects the user into
  // the /onboarding flow (see RequireOnboarded in src/lib/auth.tsx).
  export type OnboardingStep =
    | 'WELCOME'
    | 'SCHOOL_INFO'
    | 'PROVIDER_KEY'
    | 'COMPLETED';

  export type User = Entity<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
    bio: string;
    // DepEd school header fields — used to populate the DOCX export header block.
    schoolName: string;
    region: string;
    division: string;
    district: string;
    schoolAddress: string;
    // Resumable onboarding progress, tracked on the backend ``user`` row.
    onboardingStep: OnboardingStep;
  }>;
  