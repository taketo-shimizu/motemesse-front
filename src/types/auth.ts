import { User as PrismaUser } from '@prisma/client';

export interface Auth0SessionUser {
  nickname?: string;
  name?: string;
  picture?: string;
  updated_at?: string;
  email?: string;
  email_verified?: boolean;
  sub?: string;
  sid?: string;
}

// Database User type (from Prisma)
export type DatabaseUser = PrismaUser;

export interface CreateUserData {
  email: string;
  name?: string | null;
  auth0Id?: string | null;
  picture?: string | null;
  emailVerified?: boolean;
}