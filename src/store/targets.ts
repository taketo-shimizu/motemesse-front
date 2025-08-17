import { create } from 'zustand';

interface Target {
  id: number;
  name: string;
  userId: number;
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

interface TargetsState {
  targets: Target[];
  selectedTargetId: number | null;
  isLoading: boolean;
  error: string | null;
  fetchTargets: () => Promise<void>;
  selectTarget: (targetId: number | null) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const useTargetsStore = create<TargetsState>((set) => ({
  targets: [],
  selectedTargetId: null,
  isLoading: false,
  error: null,

  fetchTargets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/targets');
      if (!response.ok) {
        throw new Error('Failed to fetch targets');
      }
      const targets = await response.json();
      set({ targets, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectTarget: (targetId) => {
    set({ selectedTargetId: targetId });
  },

  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
    set({ isLoading: true });
    const targetIdString = e.target.value;
    const targetId = targetIdString ? parseInt(targetIdString, 10) : null;
    set({ selectedTargetId: targetId });
    set({ isLoading: false });
  },
}));