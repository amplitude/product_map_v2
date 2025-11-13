import { create } from 'zustand';
import type { ProductMapData, LayerState, LayerType } from '../types';

interface MapStore {
  // Data
  data: ProductMapData | null;
  setData: (data: ProductMapData) => void;

  // Layer visibility (now single-layer at a time)
  layers: LayerState;
  setActiveLayer: (layer: LayerType | null) => void;

  // Selected items
  selectedPageId: string | null;
  selectedJourneyId: string | null;
  setSelectedPage: (pageId: string | null) => void;
  setSelectedJourney: (journeyId: string | null) => void;

  // Filters
  pageTypeFilter: string | null;
  setPageTypeFilter: (type: string | null) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  // Initial state
  data: null,
  setData: (data) => set({ data }),

  layers: {
    activeLayer: null, // null means only base layer
  },
  setActiveLayer: (layer) =>
    set({
      layers: { activeLayer: layer },
    }),

  selectedPageId: null,
  selectedJourneyId: null,
  setSelectedPage: (pageId) => set({ selectedPageId: pageId }),
  setSelectedJourney: (journeyId) => set({ selectedJourneyId: journeyId }),

  pageTypeFilter: null,
  setPageTypeFilter: (type) => set({ pageTypeFilter: type }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
