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

interface NewTargetInfo {
  isNewMode: boolean;
  name: string;
}

interface TargetsState {
  targets: Target[];
  selectedTargetId: number | null;
  isLoading: boolean;
  error: string | null;
  newTargetInfo: NewTargetInfo | null;
  essentialTargetUpdate: boolean;
  fetchTargets: () => Promise<void>;
  selectTarget: (targetId: number | null) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setSelectedTargetFromRecentTarget: (recentTargetId: number | null) => void;
  setNewTargetInfo: (info: NewTargetInfo) => void;
  clearNewTargetInfo: () => void;
  setEssentialTargetUpdate: (essentialTargetUpdate: boolean) => void;
  removeTargetFromList: (targetId: number) => void;
  addTargetToList: (target: Target) => void;
  updateTargetInList: (target: Target) => void;
}

export const useTargetsStore = create<TargetsState>((set) => ({
  targets: [],
  selectedTargetId: null,
  isLoading: false,
  error: null,
  newTargetInfo: null,
  essentialTargetUpdate: true,
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

  setSelectedTargetFromRecentTarget: (recentTargetId: number | null) => {
    set({ selectedTargetId: recentTargetId });
  },

  setNewTargetInfo: (info: NewTargetInfo) => {
    set({ newTargetInfo: info });
  },

  clearNewTargetInfo: () => {
    set({ newTargetInfo: null });
  },

  setEssentialTargetUpdate: (essentialTargetUpdate) => {
    set({ essentialTargetUpdate: essentialTargetUpdate });
  },

  removeTargetFromList: (targetId: number) => {
    set((state) => ({
      targets: state.targets.filter(target => target.id !== targetId)
    }));
  },

  addTargetToList: (target: Target) => {
    set((state) => ({
      targets: [...state.targets, target]
    }));
  },

  updateTargetInList: (updatedTarget: Target) => {
    set((state) => ({
      targets: state.targets.map(target =>
        target.id === updatedTarget.id ? updatedTarget : target
      )
    }));
  },
}));