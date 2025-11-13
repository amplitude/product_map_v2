# Product Map - Architecture & Implementation Guide

## 🎯 Vision

A **multi-dimensional, interactive product intelligence platform** that serves as a command & control center for product analysts. Think Google Maps meets Amplitude - a living, breathing view of your product with toggleable layers revealing different insights.

## 🏗️ Architecture

### Core Concepts

**1. Horizontal Flow Graph (Not Network)**
- Pages represented as nodes with screenshot thumbnails
- User journeys shown as weighted flow paths (Sankey-style)
- Focus on 3-5 key journeys, not comprehensive graph
- Automatic layout algorithm using BFS/topological sort

**2. Google Maps-Style Layer System**
- **Base Layer**: Journey flows + page nodes (always on)
- **Taxonomy Layer**: Event instrumentation markers, property coverage
- **Friction Layer**: Drop-offs, errors, rage clicks, dead zones
- **Engagement Layer**: Scroll depth, dwell time, attention heatmaps
- **Action Layer**: Active experiments, PRs, feature candidates, shipped features
- **Heatmap Layer**: Click density, interaction patterns

**3. Data Flow**
```
Raw Session Data → Metadata Parser → Page Aggregation →
Journey Detection → Overlay Generation → React Flow Visualization
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Visualization** | React Flow (@xyflow/react) | Node-based interactive graph |
| **State** | Zustand | Global state for layers, selection, filters |
| **Styling** | CSS Custom Properties | Dark analytics-focused theme |
| **Icons** | Lucide React | Consistent iconography |
| **Build** | Vite | Fast dev server, HMR |

## 📁 Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces for all data models
├── utils/
│   └── dataProcessor.ts      # Parse metadata, aggregate pages, build graphs
├── store/
│   └── mapStore.ts           # Zustand store for app state
├── hooks/
│   └── useProductData.ts     # Load and process product map data
├── components/
│   ├── ProductMap.tsx        # Main React Flow canvas
│   ├── PageNode.tsx          # Custom node with screenshot + metrics
│   ├── LayerControl.tsx      # Google Maps-style layer toggles
│   ├── [Future] DetailPanel.tsx
│   ├── [Future] JourneySelector.tsx
│   └── [Future] Overlays/
│       ├── TaxonomyOverlay.tsx
│       ├── FrictionOverlay.tsx
│       ├── EngagementOverlay.tsx
│       └── ActionOverlay.tsx
└── App.tsx                   # Root component with sidebar + map
```

## 🎨 Design System

### Color Palette
- **Background**: `#0f172a` (Deep space black)
- **Secondary**: `#1e293b` (Card backgrounds)
- **Border**: `#334155` (Subtle separators)
- **Accent**: `#3b82f6` (Primary blue, selections)
- **Success**: `#10b981` (Positive signals)
- **Warning**: `#f59e0b` (Attention needed)
- **Danger**: `#ef4444` (Critical issues)

### Typography
- **Font**: Inter, system-ui fallback
- **Weights**: 400 (body), 600 (emphasis), 700 (headings)

## 🗺️ Layer Implementations

### Base Layer ✅ COMPLETE
- Horizontal node layout with auto-spacing
- Weighted edges (thickness = session volume)
- Animated flows for high-traffic paths
- Mini-map with color-coded page types
- Zoom/pan controls

### Taxonomy Layer 🚧 IN PROGRESS
**Data Model**:
```typescript
interface TaxonomyMarker {
  eventName: string;
  properties: string[];
  volume: number;
  instrumented: boolean;
  selector?: string;  // DOM selector for placement
}
```

**Visualization**:
- Green dots: Fully instrumented events
- Yellow dots: Incomplete property coverage
- Red dots: Missing critical events
- Hover: Show event details + property list
- Click: Drill into event stream

### Friction Layer 🔮 PLANNED
**Signal Types**:
- **Drop-off**: Red halo around high exit nodes
- **Error**: Red lightning bolt icon overlay
- **Rage Click**: Animated red ripple effect
- **Slow Load**: Orange loading indicator
- **Dead Click**: Gray ghost click markers

**Visualization**:
- Heat intensity based on affected session count
- Pulsing animation for critical issues
- Severity badges (P0, P1, P2)

### Engagement Layer 🔮 PLANNED
**Metrics**:
- **Scroll Depth**: Vertical gradient bar (0-100%)
- **Dwell Time**: Circular progress indicator
- **Click Density**: Blue heat spots
- **Attention Map**: Eye-tracking style overlay

**Visualization**:
- Purple color scheme for engagement
- Sparklines for time-series trends
- Comparative benchmarks (vs avg)

### Action Layer 🔮 PLANNED
**Action Types**:
```typescript
type ActionStatus = 'proposed' | 'in_dev' | 'active' | 'shipped';
type ActionType = 'experiment' | 'pr' | 'candidate' | 'shipped_feature';
```

**Visualization**:
- **Active Experiments**: Green checkered flag icon
- **In Development**: Yellow hammer icon
- **Proposed**: Blue lightbulb icon
- **Shipped**: Gray check icon with fade
- Click to view experiment details, PR link, etc.

## 🔄 Data Processing Pipeline

### 1. Metadata Parsing
```typescript
parseMetadata(text: string) → Screenshot[]
```
- Parses pipe-delimited metadata.txt
- Extracts filename, URL, session, device, timestamp
- ~4000 screenshots from 215 sessions

### 2. URL Pattern Extraction
```typescript
extractUrlPattern(url: string) → string
```
- Converts dynamic URLs to patterns
- `/analytics/acme/chart/abc123` → `/analytics/:org/chart/:chartId`
- Enables aggregation by page type

### 3. Page Aggregation
```typescript
aggregatePages(screenshots: Screenshot[]) → PageNode[]
```
- Groups screenshots by URL pattern
- Calculates unique sessions, users per page
- Sorts by traffic volume

### 4. Edge Building
```typescript
buildEdges(screenshots: Screenshot[], pages: PageNode[]) → Edge[]
```
- Reconstructs user journeys from session data
- Calculates transition frequencies
- Filters out low-volume edges (<2 sessions)

### 5. Layout Algorithm
```typescript
calculateHorizontalLayout(pages: PageNode[], edges: Edge[]) → Node[]
```
- BFS traversal to assign column indices
- Entry points (no incoming edges) in column 0
- Each transition moves right one column
- Vertical spacing within columns

## 🎮 User Interactions

### Current
- ✅ Click node → Select & highlight
- ✅ Hover node → Elevation + glow effect
- ✅ Toggle layers → Show/hide overlays
- ✅ Zoom/pan → Explore large maps
- ✅ Mini-map → Quick navigation

### Planned
- 🔮 Click node → Open detail panel
- 🔮 Click edge → Show journey analytics
- 🔮 Right-click → Context menu (add to cohort, view replays)
- 🔮 Search → Jump to specific page
- 🔮 Filter by page type, journey, etc.
- 🔮 Time range selector → Animate changes over time

## 📊 Sample Data Generated

Currently using **mock overlay data** for demonstration:
- ~20 top pages by traffic
- Taxonomy markers (2 per page)
- Friction signals (~40% of pages)
- Engagement patterns (all pages)
- Action items (~30% of pages)

**Next Step**: Integrate real funnel analysis JSON provided by user.

## 🚀 Next Implementation Steps

### Phase 1: Core Overlay Visualizations (Next 2 hours)
1. **Taxonomy Overlay Component**
   - Render event markers on nodes
   - Color code by instrumentation status
   - Tooltip with event details

2. **Friction Overlay Component**
   - Animated warning indicators
   - Severity-based styling
   - Link to session replays showing issue

3. **Detail Panel**
   - Slide-in panel on node selection
   - Screenshot carousel
   - Metrics table
   - Session replay list

### Phase 2: Advanced Features (Next 4 hours)
4. **Journey Selector**
   - Dropdown to choose specific funnel
   - Highlight relevant nodes
   - Dim irrelevant paths

5. **Engagement & Action Overlays**
   - Scroll depth visualizations
   - Experiment status badges
   - PR integration hooks

6. **Filters & Search**
   - Page type filter
   - Full-text search
   - Date range selector

### Phase 3: Polish & Production (Next 2 hours)
7. **Performance Optimization**
   - Virtual scrolling for large datasets
   - Lazy load screenshots
   - Debounce expensive computations

8. **Animations & Transitions**
   - Smooth layer toggle animations
   - Node entrance effects
   - Loading skeletons

9. **Documentation & Export**
   - User guide
   - API documentation
   - Export map as PNG/SVG

## 🧪 Testing Strategy

### Unit Tests
- Data processors (parsing, aggregation)
- URL pattern extraction
- Layout algorithm

### Integration Tests
- Data loading flow
- State management
- Layer interactions

### E2E Tests
- Full user journey scenarios
- Performance benchmarks
- Cross-browser compatibility

## 🎯 Success Metrics

1. **Usability**: Analyst can understand product health in < 5 minutes
2. **Performance**: Render 50+ nodes with 5 layers at 60 FPS
3. **Actionability**: Every insight links to actionable next step
4. **Delight**: Users describe it as "magical" or "game-changing"

## 📝 Notes

- Screenshots are 280px wide thumbnails (16:9 aspect)
- Real metadata has 4000+ screenshots across 215 sessions
- Session durations vary from seconds to minutes
- Multiple device types (Android, iOS, Web, unknown)
- Amplitude product spans login, dashboards, charts, settings, etc.

---

**Built with ❤️ for Product Analysts**
