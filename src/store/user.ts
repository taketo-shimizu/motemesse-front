import { create } from 'zustand';

interface User {
  id: number;
  auth0Id: string;
  email: string;
  name: string | null;
  picture: string | null;
  age?: number | null;
  job?: string | null;
  hobby?: string | null;
  residence?: string | null;
  workplace?: string | null;
  bloodType?: string | null;
  education?: string | null;
  workType?: string | null;
  holiday?: string | null;
  marriageHistory?: string | null;
  hasChildren?: string | null;
  smoking?: string | null;
  drinking?: string | null;
  livingWith?: string | null;
  marriageIntention?: string | null;
  personality?: string | null;
  selfIntroduction?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  syncUser: () => Promise<void>;
  updateUser: (data: {
    age?: string;
    job?: string;
    hobby?: string;
    residence?: string;
    workplace?: string;
    bloodType?: string;
    education?: string;
    workType?: string;
    holiday?: string;
    marriageHistory?: string;
    hasChildren?: string;
    smoking?: string;
    drinking?: string;
    livingWith?: string;
    marriageIntention?: string;
    personality?: string;
    selfIntroduction?: string;
  }) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  syncUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to sync user');
      }

      const data = await response.json();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user });
  },
}));