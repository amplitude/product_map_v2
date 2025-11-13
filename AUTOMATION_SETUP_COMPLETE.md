# Automation Setup Complete!

## What's Been Installed

You now have a complete closed-loop automation system for interacting with web pages, capturing data, and generating analytics event definitions.

### Components Installed

1. **Playwright** - Browser automation
2. **Page Capture Scripts** - Navigate, screenshot, extract HTML/selectors
3. **Event Definition Generator** - Auto-generate analytics events
4. **Orchestrator** - Run complete workflows
5. **MCP Server** - Claude Code integration
6. **Documentation** - Comprehensive guides

## Directory Structure

```
product_map_demo/
├── automation/
│   ├── scripts/
│   │   ├── page-capture.ts              # Core automation
│   │   ├── event-definition-generator.ts # Event generation
│   │   └── orchestrator.ts              # Full workflow
│   ├── config/
│   │   └── example-config.json          # Sample config
│   ├── output/
│   │   ├── screenshots/                 # Captured images
│   │   ├── html/                        # HTML snapshots
│   │   ├── selectors/                   # Element data
│   │   ├── instrumentation.ts           # Generated code
│   │   └── orchestration_report_*.json  # Reports
│   ├── mcp-server.ts                    # MCP integration
│   ├── test-setup.ts                    # Verification
│   ├── README.md                        # Full docs
│   ├── QUICKSTART.md                    # Quick start
│   └── SUMMARY.md                       # Overview
└── .claude/
    └── mcp-config.json                  # Claude Code config
```

## Available Commands

```bash
# Test the setup
npm run test-automation

# Capture a single page
npm run capture <url> [--headless] [--full-page]

# Run full orchestration
npm run automate <config-file.json>

# Start MCP server (for Claude Code)
npm run mcp-server
```

## Quick Start

### 1. Verify Everything Works

```bash
npm run test-automation
```

✅ This test just passed! All systems are ready.

### 2. Capture a Page

```bash
# Your app at http://localhost:5173
npm run capture http://localhost:5173
```

### 3. Run Full Workflow

```bash
npm run automate automation/config/example-config.json
```

✅ This just ran successfully! Check the output below.

## What Was Just Generated

### Orchestration Report
📄 `automation/output/orchestration_report_1763027578269.json`

Contains:
- Summary of pages captured
- All event definitions
- Metadata (timestamps, URLs, etc.)
- Screenshot and HTML paths

### Event Definitions

```json
{
  "eventName": "page_viewed_product_map_demo",
  "description": "User viewed the product_map_demo page",
  "pageUrl": "http://localhost:5173/",
  "pageUrlPattern": "http://localhost:5173/",
  "selector": "body",
  "properties": [
    "page_title",
    "page_url",
    "referrer",
    "viewport_width",
    "viewport_height"
  ],
  "priority": "critical",
  "category": "page_view"
}
```

### Instrumentation Code
📄 `automation/output/instrumentation.ts`

```typescript
export function instrumentAnalytics() {
  analytics.track('page_viewed_product_map_demo', {
    page_title: document.title,
    page_url: window.location.href,
    timestamp: Date.now()
  });
}
```

### Screenshots & HTML
- Screenshot: `automation/output/screenshots/http___localhost_5173_1763027582708.png`
- HTML: `automation/output/html/http___localhost_5173_1763027582708.html`

## Next Steps

### 1. Customize the Configuration

Edit `automation/config/example-config.json`:

```json
{
  "pages": [
    {
      "name": "Your Page Name",
      "url": "http://localhost:5173/your-route",
      "interactions": [
        { "type": "wait", "timeout": 2000 },
        { "type": "click", "selector": "#some-button" }
      ]
    }
  ],
  "headless": false,
  "generateInstrumentation": true
}
```

### 2. Add Data Attributes to Your Components

For stable selectors, add `data-analytics-id` or `data-testid`:

```tsx
// Before
<button onClick={handleClick}>Sign In</button>

// After
<button
  data-analytics-id="sign-in-button"
  onClick={handleClick}
>
  Sign In
</button>
```

The automation will prioritize these attributes when generating selectors.

### 3. Integrate with Your Product Map

Convert event definitions to TaxonomyMarkers:

```typescript
import { EventDefinitionGenerator } from './automation/scripts/event-definition-generator';
import type { TaxonomyMarker } from './src/types';

// After running orchestration
const generator = new EventDefinitionGenerator();
const taxonomyMarkers: TaxonomyMarker[] =
  generator.convertToTaxonomyMarkers(eventDefinitions, pageId);

// Add to your Product Map data
productMapData.taxonomyMarkers.push(...taxonomyMarkers);
```

### 4. Use with Claude Code

Start the MCP server:

```bash
npm run mcp-server
```

Then use prompts like:

> "Capture the dashboard page and generate event definitions"

> "Navigate to /users/123/profile, click the edit button, and capture the page"

> "Run orchestration for all pages and show me the generated events"

## Workflow Example

### Phase 1: Capture Your Product

```bash
# Create a config for your key pages
cat > automation/config/my-app-config.json << 'EOF'
{
  "pages": [
    { "name": "Login", "url": "http://localhost:5173/login" },
    { "name": "Dashboard", "url": "http://localhost:5173/dashboard" },
    { "name": "Profile", "url": "http://localhost:5173/profile" }
  ],
  "headless": true,
  "generateInstrumentation": true
}
EOF

# Run it
npm run automate automation/config/my-app-config.json
```

### Phase 2: Review & Refine

```bash
# Check the report
cat automation/output/orchestration_report_*.json | jq '.eventDefinitions'

# View screenshots
open automation/output/screenshots/
```

### Phase 3: Instrument Your App

```typescript
// src/analytics/instrumentation.ts
import { instrumentAnalytics } from '../automation/output/instrumentation';

// Call on app initialization
instrumentAnalytics();
```

### Phase 4: Monitor & Iterate

```bash
# After changes, run again
npm run automate automation/config/my-app-config.json

# The orchestrator will show you:
# - New events added
# - Events removed
# - Unchanged events
```

## Integration with Product Map Types

Your existing types in [src/types/index.ts](src/types/index.ts) are already compatible:

```typescript
// Generated event definitions map to:
TaxonomyMarker {
  id: string;
  pageId: string;
  eventName: string;           // ← from event definition
  selector: string;            // ← from stable selector
  properties: string[];        // ← from inferred properties
  volume: number;              // ← fill with real data
  instrumented: boolean;       // ← track status
}

// Screenshots map to:
Screenshot {
  filename: string;            // ← from capture
  url: string;                 // ← from page URL
  sessionId: string;           // ← generate or capture
  deviceId: string;            // ← from metadata
  deviceType: string | null;   // ← from viewport
  timestamp: number;           // ← from capture time
  textContent?: string;        // ← from HTML
  htmlFile?: string;           // ← from HTML path
}
```

## Troubleshooting

### Selectors Not Found

If the automation isn't finding interactive elements:

1. **Check timing**: Increase wait timeout
2. **Add data attributes**: Use `data-testid` or `data-analytics-id`
3. **Check rendering**: Use `headless: false` to see what's happening
4. **Wait for specific elements**: Add `waitForSelector` in config

### Page Not Loading

```bash
# Make sure your app is running
npm run dev

# Test manually
curl http://localhost:5173
```

### MCP Server Issues

```bash
# Restart Claude Code after configuration changes
# Check the MCP config
cat .claude/mcp-config.json
```

## Advanced Usage

### Custom Interaction Flows

```json
{
  "name": "Checkout Flow",
  "url": "http://localhost:5173/cart",
  "interactions": [
    { "type": "click", "selector": "[data-testid='proceed-to-checkout']" },
    { "type": "wait", "timeout": 1000 },
    { "type": "type", "selector": "input[name='email']", "value": "test@example.com" },
    { "type": "type", "selector": "input[name='card']", "value": "4242424242424242" },
    { "type": "click", "selector": "button[type='submit']" },
    { "type": "wait", "timeout": 3000 }
  ]
}
```

### Programmatic Usage

```typescript
import { ClosedLoopOrchestrator } from './automation/scripts/orchestrator';

const orchestrator = new ClosedLoopOrchestrator();

const result = await orchestrator.run({
  pages: [
    { name: 'Home', url: 'http://localhost:5173' }
  ],
  headless: true,
  generateInstrumentation: true
});

console.log(`Generated ${result.eventDefinitions.length} events`);
```

### Comparing Runs

```typescript
// Load previous run
const oldReport = await orchestrator.analyzeRun(
  'automation/output/orchestration_report_old.json'
);

// Run new capture
const newReport = await orchestrator.run(config);

// Compare
const diff = orchestrator.compareRuns(oldReport, newReport);

console.log('Added:', diff.added);
console.log('Removed:', diff.removed);
```

## Resources

📖 **Documentation**
- [Full README](automation/README.md) - Comprehensive guide
- [Quick Start](automation/QUICKSTART.md) - Get started in 5 min
- [Summary](automation/SUMMARY.md) - Overview & examples

🔗 **External Resources**
- [Playwright Docs](https://playwright.dev/)
- [MCP Protocol](https://github.com/anthropics/mcp)
- [Claude Code Docs](https://docs.claude.com/claude-code)

## What Makes This Special

### 🚀 Speed
- Automate what would take hours manually
- Bulk process multiple pages at once
- Instant event definition generation

### 🎯 Accuracy
- Stable selector generation
- Smart event naming
- Context-aware properties

### 🔄 Closed Loop
```
Capture → Generate → Instrument → Monitor → Compare → Iterate
```

### 🤖 AI-Powered
- Natural language prompts via Claude Code
- Intelligent event inference
- Context-aware descriptions

### 📊 Integration Ready
- Maps directly to your ProductMapData types
- TaxonomyMarker conversion built-in
- Screenshot metadata for Journey tracking

## Summary

You now have:
- ✅ Complete automation system installed
- ✅ MCP server configured for Claude Code
- ✅ Example configurations ready
- ✅ First successful orchestration run
- ✅ Generated events and instrumentation
- ✅ Comprehensive documentation

**Start automating:**
```bash
npm run test-automation     # Verify setup
npm run capture <url>       # Quick capture
npm run automate <config>   # Full workflow
npm run mcp-server          # Claude integration
```

**Questions?** Check the docs in [automation/](automation/) or run `npm run test-automation`.

---

🎉 **Happy automating!**
