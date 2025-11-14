import { useEffect } from 'react';
import { useMapStore } from '../store/mapStore';
import { defaultFactory } from '../adapters/AdapterFactory';
import type { ProductMapData } from '../types';

/**
 * Hook to load and process product map data
 *
 * This hook uses the adapter factory pattern to load data.
 * The data source (local files, API, etc.) is configured in the factory.
 *
 * To switch to API mode:
 * ```typescript
 * import { AdapterFactory, AdapterType } from '../adapters/AdapterFactory';
 * const factory = new AdapterFactory(AdapterType.API, {
 *   baseUrl: 'https://api.example.com',
 *   authToken: 'your-token'
 * });
 * ```
 */
export function useProductData() {
  const { setData, setIsLoading } = useMapStore();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // Create services using the adapter factory
        const services = await defaultFactory.createServices();

        // Load all data through services
        const pages = await services.pageService.getTopPages(20); // Top 20 pages
        const journeys = await services.journeyService.getJourneys(pages);
        const edges = await services.edgeService.getEdgesByMinSessions(2, pages); // Min 2 sessions

        // Load overlay data
        const taxonomyMarkers = await services.taxonomyService.getTaxonomyMarkers();
        const frictionSignals = await services.frictionService.getFrictionSignals();
        const engagementPatterns = await services.engagementService.getEngagementPatterns();
        const actionItems = await services.actionService.getActionItems();
        const aiFeedback = await services.aiFeedbackService.getAIFeedback();

        // Load Analytics layer data
        const rawCharts = await services.chartService.getCharts();
        const rawDashboards = await services.dashboardService.getDashboards();
        const rawCohorts = await services.cohortService.getCohorts();
        const rawMetrics = await services.metricService.getMetrics();

        // Load Actions layer data
        const rawExperiments = await services.experimentService.getExperiments();
        const rawGuides = await services.guidesSurveysService.getGuides();
        const rawSurveys = await services.guidesSurveysService.getSurveys();
        const rawPullRequests = await services.pullRequestService.getPullRequests();

        // Load Product Insights layer data
        const rawFrictionPoints = await services.frictionPointService.getFrictionPoints();
        const rawBehavioralInsights = await services.behavioralInsightService.getBehavioralInsights();
        const rawPerformanceMetrics = await services.performanceMetricService.getPerformanceMetrics();
        const rawNavigationFlows = await services.navigationFlowService.getNavigationFlows();
        const rawTasks = await services.taskService.getTasks();

        // Map overlay data to actual page IDs
        const pageIds = pages.map(p => p.id);
        const mapToPages = <T extends { pageId: string }>(items: T[]): T[] => {
          return items.map((item, index) => ({
            ...item,
            pageId: pageIds[index % pageIds.length] || pageIds[0],
          }));
        };

        const charts = mapToPages(rawCharts);
        const dashboards = mapToPages(rawDashboards);
        const cohorts = mapToPages(rawCohorts);
        const metrics = mapToPages(rawMetrics);
        const experiments = mapToPages(rawExperiments);
        const guides = mapToPages(rawGuides);
        const surveys = mapToPages(rawSurveys);
        const pullRequests = mapToPages(rawPullRequests);
        const frictionPoints = mapToPages(rawFrictionPoints);
        const behavioralInsights = mapToPages(rawBehavioralInsights);
        const performanceMetrics = mapToPages(rawPerformanceMetrics);
        const tasks = mapToPages(rawTasks);

        // NavigationFlows use startPageId instead of pageId
        const navigationFlows = rawNavigationFlows.map((flow, index) => ({
          ...flow,
          startPageId: pageIds[index % pageIds.length] || pageIds[0],
        }));

        console.log('📊 Loaded overlay data:', {
          pages: pages.length,
          charts: charts.length,
          dashboards: dashboards.length,
          cohorts: cohorts.length,
          metrics: metrics.length,
          experiments: experiments.length,
          frictionPoints: frictionPoints.length,
          behavioralInsights: behavioralInsights.length,
          performanceMetrics: performanceMetrics.length,
        });

        const productMapData: ProductMapData = {
          pages,
          journeys,
          edges,
          taxonomyMarkers,
          frictionSignals,
          engagementPatterns,
          actionItems,
          aiFeedback,
          // Analytics
          charts,
          dashboards,
          cohorts,
          metrics,
          // Actions
          experiments,
          guides,
          surveys,
          pullRequests,
          // Product Insights
          frictionPoints,
          behavioralInsights,
          performanceMetrics,
          navigationFlows,
          tasks,
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
