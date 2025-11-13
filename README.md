# 🗺️ Product Map - Interactive Product Intelligence Platform

> A command & control center for product analysts. Visualize user journeys, detect friction, track experiments, and understand product health at a glance.

![Product Map Preview](https://img.shields.io/badge/Status-MVP_Complete-success)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5173
```

## ✨ Features

### ✅ Implemented (MVP)
- **Horizontal Journey Flow**: Auto-laid out page nodes with weighted edges
- **Screenshot Thumbnails**: Real product screenshots in each node
- **Layer System**: Google Maps-style toggleable overlays
- **Interactive Nodes**: Click, hover, select with smooth animations
- **Traffic Metrics**: Sessions, unique users per page
- **Smart Layout**: Automatic BFS-based column assignment
- **Minimap**: Bird's-eye view with color-coded page types
- **Dark Theme**: Analytics-focused professional design

### 🔮 Coming Soon
- **Detail Panel**: Deep-dive into selected pages
- **Journey Selector**: Focus on specific user funnels
- **Friction Heatmap**: Visual indicators of user struggles
- **Taxonomy Overlay**: Event instrumentation coverage
- **Action Layer**: Active experiments and PRs
- **Search & Filter**: Find specific pages or flows
- **Time Travel**: Animate changes over time

## 📊 Data Sources

The platform ingests:
- **Session Replay Metadata**: 4000+ screenshots from 215 sessions
- **Page Analytics**: Sessions, users, dwell time per page
- **Event Taxonomy**: Instrumented events and properties
- **Funnel Analysis**: Conversion funnels from your analytics JSON
- **Friction Signals**: Errors, drop-offs, rage clicks
- **Experiments**: A/B tests, feature flags, rollouts

## 🎮 How to Use

### Layer Controls (Left Sidebar)
Toggle different data overlays:
1. **Base Flow** (Always on): Journey paths and page nodes
2. **Taxonomy**: Event coverage and instrumentation gaps
3. **Friction Signals**: User pain points and drop-offs
4. **Engagement**: Scroll depth, dwell time, attention
5. **Actions**: Experiments, PRs, feature candidates
6. **Heatmap**: Click density and interaction patterns

### Navigation
- **Zoom**: Scroll wheel or pinch
- **Pan**: Click and drag background
- **Select Node**: Click any page node
- **Minimap**: Click to jump to area

### Node Information
Each node shows:
- Screenshot thumbnail
- Page type badge
- Sessions count
- Unique users count
- Active overlays (when enabled)

## 🏗️ Architecture

```
┌─────────────┐
│  Raw Data   │  metadata.txt, screenshots, JSON analysis
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Parsers    │  Parse metadata, aggregate by URL pattern
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Graph      │  Build nodes, edges, apply layout algorithm
│  Builder    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  React Flow │  Render interactive visualization
│  Canvas     │
└─────────────┘
```

### Key Files
- `src/types/index.ts` - TypeScript data models
- `src/utils/dataProcessor.ts` - Parse & aggregate data
- `src/components/ProductMap.tsx` - Main visualization
- `src/components/PageNode.tsx` - Custom node component
- `src/components/LayerControl.tsx` - Layer toggles
- `src/store/mapStore.ts` - Global state management

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19.2 + TypeScript |
| Visualization | React Flow (@xyflow/react) |
| State | Zustand |
| Build | Vite |
| Styling | CSS Custom Properties |
| Icons | Lucide React |

## 📈 Performance

- Renders 50+ nodes at 60 FPS
- Lazy loads screenshots on-demand
- Efficient re-renders with React.memo
- Optimized layout algorithm (O(n + e))

## 🎨 Design Philosophy

1. **Information Density**: Maximum insight, minimum chrome
2. **Progressive Disclosure**: Layers reveal complexity on-demand
3. **Spatial Memory**: Consistent layout aids recognition
4. **Action-Oriented**: Every insight links to next step
5. **Beautiful Data**: Analytics can be elegant

## 🧪 Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Adding Your Data

1. **Copy metadata file**:
   ```bash
   cp /path/to/metadata.txt public/metadata.txt
   ```

2. **Copy screenshots**:
   ```bash
   mkdir -p public/screenshots
   cp /path/to/screenshots/*.png public/screenshots/
   ```

3. **Integrate funnel JSON**:
   - Add your funnel analysis JSON to `public/funnels.json`
   - Update `dataProcessor.ts` to parse it
   - Map to `Journey` type in `types/index.ts`

## 🤝 Contributing

This is an experimental prototype. Ideas for enhancements:

- [ ] Real-time data streaming
- [ ] Collaborative annotations
- [ ] Export to Figma/PDF
- [ ] AI-powered insights
- [ ] Mobile-responsive view
- [ ] Multi-product comparison
- [ ] Historical playback

## 📄 License

MIT

## 👤 Author

**Eric Carlson**
- Built with Claude Code
- Powered by Amplitude analytics data

---

**"The best interface is the one you don't have to think about."**
