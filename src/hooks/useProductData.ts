import { useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import {
  parseMetadata,
  aggregatePages,
  buildEdges,
  generateMockOverlayData,
  mapFunnelsToJourneys,
} from '../utils/dataProcessor';
import type { ProductMapData, Journey } from '../types';

/**
 * Hook to load and process product map data
 */
export function useProductData() {
  const { setData, setIsLoading } = useMapStore();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // Load metadata file from public folder
        const metadataRes = await fetch('/metadata.txt');
        const metadataText = await metadataRes.text();

        // Parse and process
        const screenshots = parseMetadata(metadataText);
        const pages = aggregatePages(screenshots);
        const edges = buildEdges(screenshots, pages);

        // Load funnel data
        let journeys: Journey[] = [];
        try {
          const funnelsRes = await fetch('/funnels.json');
          const funnelsData = await funnelsRes.json();
          journeys = mapFunnelsToJourneys(funnelsData.funnels || [], pages);
        } catch (error) {
          console.warn('Failed to load funnel data:', error);
        }

        // Generate mock overlay data
        const overlayData = generateMockOverlayData(pages);

        const productMapData: ProductMapData = {
          pages: pages.slice(0, 20), // Limit to top 20 pages for initial view
          journeys,
          edges: edges.filter((e) => e.sessions > 1), // Only show edges with multiple sessions
          ...overlayData,
        };

        setData(productMapData);
      } catch (error) {
        console.error('Failed to load product map data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [setData, setIsLoading]);
}
