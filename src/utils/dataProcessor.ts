import type { PageNode, Screenshot, Journey, Edge, AIFeedback } from '../types';

/**
 * Parse the metadata.txt file and convert to structured data
 */
export function parseMetadata(metadataText: string): Screenshot[] {
  const lines = metadataText.split('\n');
  const screenshots: Screenshot[] = [];

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.trim() === '') continue;

    const parts = line.split(' | ');
    if (parts.length < 7) continue;

    const [filename, url, sessionId, deviceId, deviceType, _appId, timestamp] = parts;

    // Only process .png files
    if (!filename.endsWith('.png')) continue;

    screenshots.push({
      filename: filename.trim(),
      url: url.trim(),
      sessionId: sessionId.trim(),
      deviceId: deviceId.trim(),
      deviceType: deviceType.trim() === 'None' ? null : deviceType.trim(),
      timestamp: parseInt(timestamp.trim(), 10),
      textContent: filename.replace('.png', '_text.txt'),
      htmlFile: filename.replace('.png', '.html'),
    });
  }

  return screenshots;
}

/**
 * Extract URL pattern by removing dynamic segments
 */
export function extractUrlPattern(url: string): string {
  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname;

    // Replace common dynamic segments with wildcards
    path = path.replace(/\/[a-f0-9]{8,}/g, '/:id'); // Hash-like IDs
    path = path.replace(/\/\d{5,}/g, '/:id'); // Numeric IDs
    path = path.replace(/\/[^/]+\/chart\/[^/]+/g, '/:org/chart/:chartId'); // Chart patterns
    path = path.replace(/\/[^/]+\/dashboard\/[^/]+/g, '/:org/dashboard/:dashId'); // Dashboard patterns

    return urlObj.origin + path;
  } catch (e) {
    return url;
  }
}

/**
 * Classify page type based on URL pattern
 */
export function classifyPageType(url: string): string {
  if (url.includes('/login')) return 'Login';
  if (url.includes('/signup')) return 'Signup';
  if (url.includes('/home')) return 'Home';
  if (url.includes('/dashboard')) return 'Dashboard';
  if (url.includes('/chart')) return 'Analysis';
  if (url.includes('/users')) return 'User List';
  if (url.includes('/settings')) return 'Settings';
  if (url.includes('/live-events')) return 'Live Events';
  if (url.includes('/space')) return 'Content';
  if (url.includes('/session-replay')) return 'Session Replay';
  return 'Other';
}

/**
 * Aggregate screenshots into page nodes
 */
export function aggregatePages(screenshots: Screenshot[]): PageNode[] {
  const pageMap = new Map<string, PageNode>();

  screenshots.forEach((screenshot) => {
    const pattern = extractUrlPattern(screenshot.url);

    if (!pageMap.has(pattern)) {
      pageMap.set(pattern, {
        id: pattern,
        url: screenshot.url,
        urlPattern: pattern,
        pageType: classifyPageType(screenshot.url),
        title: extractPageTitle(screenshot.url),
        screenshots: [],
        sessions: 0,
        uniqueUsers: 0,
      });
    }

    const page = pageMap.get(pattern)!;
    page.screenshots.push(screenshot);
  });

  // Calculate unique sessions and users
  pageMap.forEach((page) => {
    const uniqueSessions = new Set(page.screenshots.map((s) => s.sessionId));
    const uniqueUsers = new Set(page.screenshots.map((s) => s.deviceId));
    page.sessions = uniqueSessions.size;
    page.uniqueUsers = uniqueUsers.size;
  });

  return Array.from(pageMap.values()).sort((a, b) => b.sessions - a.sessions);
}

/**
 * Extract readable page title from URL
 */
function extractPageTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split('/').filter(Boolean);

    if (path.includes('/login')) return 'Login';
    if (path.includes('/home')) return 'Home';
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/chart')) return 'Chart Builder';
    if (parts.length > 0) return parts[parts.length - 1].replace(/-/g, ' ');

    return 'Unknown Page';
  } catch {
    return 'Unknown Page';
  }
}

/**
 * Build edges between pages based on session flows
 */
export function buildEdges(screenshots: Screenshot[], _pages: PageNode[]): Edge[] {
  const edgeMap = new Map<string, { source: string; target: string; sessions: Set<string> }>();

  // Group screenshots by session
  const sessionMap = new Map<string, Screenshot[]>();
  screenshots.forEach((s) => {
    if (!sessionMap.has(s.sessionId)) {
      sessionMap.set(s.sessionId, []);
    }
    sessionMap.get(s.sessionId)!.push(s);
  });

  // Build edges from sequential page views within sessions
  sessionMap.forEach((sessionScreenshots) => {
    // Sort by timestamp
    const sorted = sessionScreenshots.sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 0; i < sorted.length - 1; i++) {
      const sourcePattern = extractUrlPattern(sorted[i].url);
      const targetPattern = extractUrlPattern(sorted[i + 1].url);

      // Skip self-loops
      if (sourcePattern === targetPattern) continue;

      const edgeKey = `${sourcePattern}→${targetPattern}`;

      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          source: sourcePattern,
          target: targetPattern,
          sessions: new Set(),
        });
      }

      edgeMap.get(edgeKey)!.sessions.add(sorted[i].sessionId);
    }
  });

  // Convert to Edge objects
  const edges: Edge[] = [];
  edgeMap.forEach((edgeData, key) => {
    edges.push({
      id: key,
      source: edgeData.source,
      target: edgeData.target,
      sessions: edgeData.sessions.size,
      journeyIds: [],
    });
  });

  return edges.sort((a, b) => b.sessions - a.sessions);
}

/**
 * Generate component-level actions for a journey step
 */
function generateComponentActionsForStep(stepName: string, _stepIndex: number) {
  const stepLower = stepName.toLowerCase();

  // Login/Signup flows
  if (stepLower.includes('login') || stepLower.includes('sign in')) {
    return [
      { selector: 'input[type="email"]', label: 'Email Input', actionType: 'input' as const, position: { x: 50, y: 45 }, sequenceOrder: 1, importance: 'primary' as const },
      { selector: 'input[type="password"]', label: 'Password Input', actionType: 'input' as const, position: { x: 50, y: 55 }, sequenceOrder: 2, importance: 'primary' as const },
      { selector: 'button[type="submit"]', label: 'Log In Button', actionType: 'click' as const, position: { x: 50, y: 68 }, sequenceOrder: 3, importance: 'primary' as const },
    ];
  }

  if (stepLower.includes('signup') || stepLower.includes('register')) {
    return [
      { selector: '.google-auth-btn', label: 'Sign in with Google', actionType: 'click' as const, position: { x: 50, y: 38 }, sequenceOrder: 1, importance: 'secondary' as const },
      { selector: 'input[name="email"]', label: 'Email Field', actionType: 'input' as const, position: { x: 50, y: 50 }, sequenceOrder: 2, importance: 'primary' as const },
      { selector: 'button.create-account', label: 'Create Account', actionType: 'click' as const, position: { x: 50, y: 70 }, sequenceOrder: 3, importance: 'primary' as const },
    ];
  }

  // Dashboard/Home flows
  if (stepLower.includes('dashboard') || stepLower.includes('home')) {
    return [
      { selector: '.main-nav', label: 'Navigation Menu', actionType: 'hover' as const, position: { x: 15, y: 12 }, sequenceOrder: 1, importance: 'secondary' as const },
      { selector: '.create-chart-btn', label: 'Create Chart Button', actionType: 'click' as const, position: { x: 85, y: 15 }, sequenceOrder: 2, importance: 'primary' as const },
      { selector: '.quick-stats', label: 'View Statistics', actionType: 'click' as const, position: { x: 30, y: 40 }, sequenceOrder: 3, importance: 'tertiary' as const },
    ];
  }

  // Chart/Analysis flows
  if (stepLower.includes('chart') || stepLower.includes('analysis')) {
    return [
      { selector: '.chart-type-selector', label: 'Chart Type', actionType: 'click' as const, position: { x: 20, y: 25 }, sequenceOrder: 1, importance: 'primary' as const },
      { selector: '.data-source-picker', label: 'Select Data Source', actionType: 'click' as const, position: { x: 20, y: 45 }, sequenceOrder: 2, importance: 'primary' as const },
      { selector: '.run-query-btn', label: 'Run Query', actionType: 'click' as const, position: { x: 85, y: 20 }, sequenceOrder: 3, importance: 'primary' as const },
      { selector: '.chart-canvas', label: 'View Results', actionType: 'scroll' as const, position: { x: 60, y: 60 }, sequenceOrder: 4, importance: 'secondary' as const },
    ];
  }

  // Settings flows
  if (stepLower.includes('settings')) {
    return [
      { selector: '.settings-nav', label: 'Settings Menu', actionType: 'click' as const, position: { x: 25, y: 30 }, sequenceOrder: 1, importance: 'secondary' as const },
      { selector: '.profile-section', label: 'Profile Settings', actionType: 'click' as const, position: { x: 50, y: 40 }, sequenceOrder: 2, importance: 'primary' as const },
      { selector: '.save-btn', label: 'Save Changes', actionType: 'click' as const, position: { x: 70, y: 75 }, sequenceOrder: 3, importance: 'primary' as const },
    ];
  }

  // Default generic flow
  return [
    { selector: '.page-header', label: 'Page Header', actionType: 'hover' as const, position: { x: 50, y: 15 }, sequenceOrder: 1, importance: 'tertiary' as const },
    { selector: '.main-content', label: 'Main Content', actionType: 'scroll' as const, position: { x: 50, y: 50 }, sequenceOrder: 2, importance: 'secondary' as const },
    { selector: '.cta-button', label: 'Primary Action', actionType: 'click' as const, position: { x: 50, y: 70 }, sequenceOrder: 3, importance: 'primary' as const },
  ];
}

/**
 * Map funnel data to journey objects
 */
export function mapFunnelsToJourneys(funnelData: any[], pages: PageNode[]): Journey[] {
  if (!funnelData || funnelData.length === 0) return [];

  return funnelData.map((funnel, index) => {
    // Try to match funnel steps to actual pages
    const steps = funnel.steps.map((stepName: string, stepIndex: number) => {
      // Try to find a page that might match this step
      // This is heuristic-based - in a real implementation, you'd have event-to-page mapping
      const matchedPage = pages.find((page) => {
        const pageTitleLower = page.title.toLowerCase();
        const stepLower = stepName.toLowerCase();

        return (
          stepLower.includes('login') && pageTitleLower.includes('login') ||
          stepLower.includes('signup') && pageTitleLower.includes('signup') ||
          stepLower.includes('home') && pageTitleLower.includes('home') ||
          stepLower.includes('dashboard') && pageTitleLower.includes('dashboard') ||
          stepLower.includes('chart') && pageTitleLower.includes('chart')
        );
      });

      // Generate component-level actions for this step
      const componentActions = generateComponentActionsForStep(stepName, stepIndex);

      return {
        pageId: matchedPage?.id || pages[stepIndex % pages.length]?.id || '',
        stepNumber: stepIndex + 1,
        dropOffRate: Math.random() * 0.3,
        avgTimeToNext: Math.random() * 120,
        componentActions,
        primaryAction: componentActions[0]?.label || stepName,
      };
    });

    return {
      id: `journey-${index}`,
      name: funnel.funnel_name,
      type: funnel.funnel_type as 'conversion' | 'engagement' | 'retention',
      description: funnel.description,
      steps,
      totalSessions: Math.floor(Math.random() * 5000) + 1000, // Mock data
      conversionRate: Math.random() * 0.5 + 0.2, // Mock data - 20-70%
      importance: funnel.estimated_importance as 'critical' | 'high' | 'medium' | 'low',
    };
  });
}

/**
 * Generate mock overlay data (placeholder for now)
 */
export function generateMockOverlayData(pages: PageNode[]) {
  const feedbackSuggestions = [
    {
      title: 'High bounce rate detected',
      description: 'Users are leaving this page without further interaction. Consider A/B testing the headline or CTA button.',
    },
    {
      title: 'Engagement opportunity',
      description: 'This page has significant traffic but low engagement. Add more interactive elements or content.',
    },
    {
      title: 'Navigation friction',
      description: 'Users spend longer navigating to this page. Simplify the navigation path.',
    },
    {
      title: 'Mobile optimization needed',
      description: 'Mobile users are experiencing slower load times. Optimize images and assets.',
    },
    {
      title: 'Conversion opportunity',
      description: 'This page shows high qualified traffic but low conversions. Test a new CTA placement.',
    },
  ];

  return {
    taxonomyMarkers: pages.flatMap((page) => [
      {
        id: `tax-${page.id}-1`,
        pageId: page.id,
        eventName: 'Page Viewed',
        properties: ['page_name', 'user_id', 'timestamp'],
        volume: Math.floor(Math.random() * 10000),
        instrumented: true,
      },
      {
        id: `tax-${page.id}-2`,
        pageId: page.id,
        eventName: 'Button Clicked',
        selector: '.cta-button',
        properties: ['button_name', 'location'],
        volume: Math.floor(Math.random() * 5000),
        instrumented: Math.random() > 0.3,
      },
    ]),
    frictionSignals: pages
      .filter(() => Math.random() > 0.6)
      .map((page) => ({
        id: `friction-${page.id}`,
        pageId: page.id,
        type: ['drop_off', 'error', 'rage_click'][Math.floor(Math.random() * 3)] as any,
        severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
        description: 'High drop-off rate detected',
        affectedSessions: Math.floor(Math.random() * 500),
      })),
    engagementPatterns: pages.map((page) => ({
      id: `engage-${page.id}`,
      pageId: page.id,
      type: 'scroll_depth' as const,
      data: { avgScrollDepth: Math.random() * 100 },
      avgValue: Math.random() * 100,
    })),
    actionItems: pages
      .filter(() => Math.random() > 0.7)
      .flatMap((page) => [
        {
          id: `action-${page.id}-1`,
          pageId: page.id,
          type: 'experiment' as const,
          status: 'active' as const,
          title: 'A/B Test: New CTA Design',
          description: 'Testing button color variants',
          priority: 'p1' as const,
        },
      ]),
    aiFeedback: pages
      .filter(() => Math.random() > 0.5)
      .map((page, idx) => {
        const suggestion = feedbackSuggestions[idx % feedbackSuggestions.length];
        return {
          id: `ai-${page.id}`,
          pageId: page.id,
          type: ['suggestion', 'warning', 'insight', 'optimization'][Math.floor(Math.random() * 4)] as any,
          confidence: 0.6 + Math.random() * 0.4,
          title: suggestion.title,
          description: suggestion.description,
          impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
          actionable: Math.random() > 0.3,
        } as AIFeedback;
      }),
  };
}
