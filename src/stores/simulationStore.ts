
import { create } from 'zustand';

interface SimulationState {
  interactionCount: number;
  incrementInteractionCount: () => void;
  resetInteractionCount: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  interactionCount: 0,
  incrementInteractionCount: () => set((state) => ({ interactionCount: state.interactionCount + 1 })),
  resetInteractionCount: () => set({ interactionCount: 0 }),
}));
