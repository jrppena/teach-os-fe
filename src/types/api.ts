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
  
  export type User = Entity<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
    bio: string;
  }>;
  