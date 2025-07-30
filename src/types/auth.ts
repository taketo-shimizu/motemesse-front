import { User } from '@auth0/nextjs-auth0/client';
import { User as PrismaUser } from '@prisma/client';

export interface Auth0User extends User {
  name?: string;
  email?: string;
  picture?: string;
  updated_at?: string;
  email_verified?: boolean;
  sub?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface AuthState {
  user: Auth0User | null;
  isLoading: boolean;
  error: Error | null;
}

// Database User type (from Prisma)
export type DatabaseUser = PrismaUser;

export interface CreateUserData {
  email: string;
  name?: string;
  auth0Id?: string;
  picture?: string;
  emailVerified?: boolean;
}