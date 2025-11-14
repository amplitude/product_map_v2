# Product Map Data Architecture

This document describes the data adapter pattern used in the Product Map application. This architecture provides a clean separation between data sources and business logic, making it easy to swap between local files, APIs, or other data sources.

## Architecture Overview

The data layer is organized into three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                        React App Layer                       │
│                    (useProductData hook)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Adapter Factory                           │
│            (Configures which adapters to use)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Services Layer                             │
│        (Business logic, filtering, aggregation)             │
│  • PageService    • JourneyService    • EdgeService         │
│  • TaxonomyService • FrictionService • etc.                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Adapters Layer                             │
│            (Abstract data source access)                     │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ Local Adapters   │      │  API Adapters    │            │
│  │ (from /public)   │      │  (from backend)  │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Data Sources                               │
│         Local Files (/public)  |  Backend API                │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Data Adapters (`src/adapters/`)

Adapters handle the low-level details of fetching data from different sources.

**Interface Definition:**
```typescript
export interface IDataAdapter<T> {
  fetchAll(): Promise<T>;
  fetchById?(id: string): Promise<T | null>;
}
```

**Implementation Types:**
- **Local Adapters** (`src/adapters/local/`) - Load from `/public` folder
- **API Adapters** (`src/adapters/api/`) - Fetch from backend API (currently stubbed)

**Available Adapters:**
1. `ScreenshotAdapter` - Page/screenshot data
2. `JourneyAdapter` - Journey/funnel definitions
3. `EdgeAdapter` - Navigation flow data
4. `TaxonomyAdapter` - Event tracking metadata
5. `FrictionAdapter` - User friction signals
6. `EngagementAdapter` - Engagement metrics
7. `ActionAdapter` - Action items/experiments
8. `AIFeedbackAdapter` - AI-generated insights

### 2. Services Layer (`src/services/`)

Services provide business logic on top of adapters. They handle:
- Data transformation
- Filtering and aggregation
- Domain-specific operations

**Example Service:**
```typescript
export class PageService {
  constructor(private adapter: IDataAdapter<RawScreenshotData>) {}

  async getPages(): Promise<PageNode[]> {
    const rawData = await this.adapter.fetchAll();
    return aggregatePages(rawData.screenshots);
  }

  async getTopPages(limit: number): Promise<PageNode[]> {
    const pages = await this.getPages();
    return pages.slice(0, limit);
  }
}
```

### 3. Adapter Factory (`src/adapters/AdapterFactory.ts`)

The factory is the central configuration point. It creates all adapters and services with the specified adapter type.

```typescript
const factory = new AdapterFactory(AdapterType.LOCAL);
const services = await factory.createServices();
const pages = await services.pageService.getPages();
```

### 4. Data Types (`src/types/index.ts`)

All data models are strongly typed with TypeScript interfaces. Every piece of data that flows through the system has a well-defined type.

## Usage Examples

### Loading Data with Local Adapters (Current Setup)

```typescript
import { defaultFactory } from '../adapters/AdapterFactory';

// Use the default factory (configured for local files)
const services = await defaultFactory.createServices();

// Load pages
const pages = await services.pageService.getPages();
const topPages = await services.pageService.getTopPages(20);

// Load journeys
const journeys = await services.journeyService.getJourneys(pages);

// Load overlay data
const taxonomy = await services.taxonomyService.getTaxonomyMarkers();
const friction = await services.frictionService.getFrictionSignals();
```

### Switching to API Adapters

To use API adapters instead of local files:

```typescript
import { AdapterFactory, AdapterType } from '../adapters/AdapterFactory';

// Create factory configured for API
const factory = new AdapterFactory(AdapterType.API, {
  baseUrl: 'https://api.example.com',
  authToken: process.env.API_TOKEN,
  timeout: 30000,
});

const services = await factory.createServices();
const pages = await services.pageService.getPages();
```

### Using Services for Filtering

Services provide convenient methods for common operations:

```typescript
// Get high-priority action items
const highPriority = await services.actionService.getHighPriorityActions();

// Get critical friction signals
const criticalIssues = await services.frictionService.getCriticalFriction();

// Get actionable AI feedback
const actionable = await services.aiFeedbackService.getActionableFeedback();

// Get journeys by type
const conversionFunnels = await services.journeyService.getJourneysByType(
  'conversion',
  pages
);
```

## Adding a New Data Domain

To add a new data type to the system, follow these steps:

### 1. Define Types

Add your data type to `src/types/index.ts`:

```typescript
export interface NewDataType {
  id: string;
  name: string;
  // ... other fields
}
```

Add raw data type to `src/adapters/types.ts`:

```typescript
export interface RawNewData {
  items: NewDataType[];
}
```

### 2. Create Local Adapter

Create `src/adapters/local/LocalNewDataAdapter.ts`:

```typescript
import { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import { RawNewData } from '../types';
import type { NewDataType } from '../../types';

export class LocalNewDataAdapter implements IDataAdapter<RawNewData> {
  constructor(private config: AdapterConfig = {}) {}

  async fetchAll(): Promise<RawNewData> {
    // Load from local file
    const response = await fetch('/new-data.json');
    const data = await response.json();
    return data;
  }

  async fetchById(id: string): Promise<RawNewData | null> {
    const allData = await this.fetchAll();
    const item = allData.items.find((i) => i.id === id);
    return item ? { items: [item] } : null;
  }
}
```

### 3. Create API Adapter (Stubbed)

Create `src/adapters/api/ApiNewDataAdapter.ts`:

```typescript
import { IDataAdapter, AdapterConfig } from '../IDataAdapter';
import { RawNewData } from '../types';

export class ApiNewDataAdapter implements IDataAdapter<RawNewData> {
  constructor(private config: AdapterConfig = {}) {}

  async fetchAll(): Promise<RawNewData> {
    // TODO: Implement API call
    // const response = await fetch(`${this.config.baseUrl}/api/new-data`);
    // return await response.json();

    console.warn('ApiNewDataAdapter: Not yet implemented');
    return { items: [] };
  }
}
```

### 4. Create Service

Create `src/services/NewDataService.ts`:

```typescript
import { IDataAdapter } from '../adapters/IDataAdapter';
import { RawNewData } from '../adapters/types';
import type { NewDataType } from '../types';

export class NewDataService {
  constructor(private adapter: IDataAdapter<RawNewData>) {}

  async getNewData(): Promise<NewDataType[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.items;
  }

  async getNewDataById(id: string): Promise<NewDataType | null> {
    const items = await this.getNewData();
    return items.find((i) => i.id === id) || null;
  }

  // Add domain-specific methods
  async getFilteredData(criteria: any): Promise<NewDataType[]> {
    const items = await this.getNewData();
    return items.filter(/* your logic */);
  }
}
```

### 5. Update Adapter Factory

Add to `src/adapters/AdapterFactory.ts`:

```typescript
import { LocalNewDataAdapter } from './local/LocalNewDataAdapter';
import { ApiNewDataAdapter } from './api/ApiNewDataAdapter';
import { NewDataService } from '../services/NewDataService';

// In createServices() method:
const newDataAdapter =
  this.adapterType === AdapterType.LOCAL
    ? new LocalNewDataAdapter(this.config)
    : new ApiNewDataAdapter(this.config);

return {
  // ... existing services
  newDataService: new NewDataService(newDataAdapter),
};
```

### 6. Update ProductMapData Type

Add to `src/types/index.ts`:

```typescript
export interface ProductMapData {
  // ... existing fields
  newData: NewDataType[];
}
```

### 7. Use in Hook

Add to `src/hooks/useProductData.ts`:

```typescript
const newData = await services.newDataService.getNewData();

const productMapData: ProductMapData = {
  // ... existing fields
  newData,
};
```

## Type Safety Guidelines

1. **Always use interfaces** for data types, never `any`
2. **Define raw data types** separately from processed types
3. **Use type inference** where possible to reduce verbosity
4. **Export all types** from `src/types/index.ts` for consistency
5. **Keep adapters type-generic** using `IDataAdapter<T>`

## Best Practices

### 1. Adapter Responsibilities
- **DO**: Handle data fetching and basic error handling
- **DO**: Return raw data in a consistent format
- **DON'T**: Include business logic or transformations
- **DON'T**: Directly modify global state

### 2. Service Responsibilities
- **DO**: Transform raw data into domain models
- **DO**: Implement filtering, sorting, and aggregation
- **DO**: Provide convenient query methods
- **DON'T**: Make direct fetch calls (use adapters)
- **DON'T**: Handle UI state or rendering logic

### 3. Factory Usage
- Use `defaultFactory` for most cases
- Create custom factories only when you need different configurations
- Keep factory configuration in environment variables for API URLs/tokens

### 4. Error Handling
- Adapters should throw errors for critical failures
- Services should catch and log errors, returning empty arrays where appropriate
- The UI layer should handle loading states and display error messages

## Testing

### Testing Adapters

```typescript
// Create a mock adapter for testing
class MockPageAdapter implements IDataAdapter<RawScreenshotData> {
  async fetchAll(): Promise<RawScreenshotData> {
    return { screenshots: [/* mock data */] };
  }
}

// Use in tests
const service = new PageService(new MockPageAdapter());
const pages = await service.getPages();
expect(pages).toHaveLength(1);
```

### Testing Services

Services are easy to test because they accept adapters via dependency injection:

```typescript
it('should filter pages by type', async () => {
  const mockAdapter = new MockPageAdapter();
  const service = new PageService(mockAdapter);

  const dashboards = await service.getPagesByType('Dashboard');
  expect(dashboards.every(p => p.pageType === 'Dashboard')).toBe(true);
});
```

## Migration Path: Local → API

When ready to switch from local files to an API:

1. **Implement API adapters** - Replace the TODOs in `src/adapters/api/`
2. **Test in isolation** - Test each API adapter independently
3. **Add feature flag** - Use environment variable to switch modes:
   ```typescript
   const adapterType = import.meta.env.VITE_USE_API === 'true'
     ? AdapterType.API
     : AdapterType.LOCAL;
   ```
4. **Update factory** - Pass API config from environment:
   ```typescript
   const factory = new AdapterFactory(adapterType, {
     baseUrl: import.meta.env.VITE_API_BASE_URL,
     authToken: import.meta.env.VITE_API_TOKEN,
   });
   ```
5. **Deploy incrementally** - Roll out to users gradually

## Performance Considerations

1. **Caching**: Services can implement caching to avoid redundant adapter calls
2. **Parallel Loading**: Load independent data sources in parallel:
   ```typescript
   const [pages, journeys, taxonomy] = await Promise.all([
     services.pageService.getPages(),
     services.journeyService.getJourneys(pages),
     services.taxonomyService.getTaxonomyMarkers(),
   ]);
   ```
3. **Lazy Loading**: Load overlay data only when needed
4. **Data Pagination**: Implement pagination in services for large datasets

## Troubleshooting

### "Adapter not found" errors
- Check that the adapter is exported from its index file
- Verify the adapter is imported in AdapterFactory

### Type errors in services
- Ensure raw data types match what adapters return
- Check that adapter implements `IDataAdapter<T>` correctly

### Data not loading
- Check browser console for fetch errors
- Verify files exist in `/public` folder for local adapters
- Check API endpoint configuration for API adapters

## Summary

This architecture provides:
- ✅ **Clean separation of concerns** - Data access, business logic, and UI are separate
- ✅ **Type safety** - Strong typing throughout the stack
- ✅ **Flexibility** - Easy to swap data sources
- ✅ **Testability** - Each layer can be tested independently
- ✅ **Scalability** - New data domains follow the same pattern
- ✅ **Maintainability** - Clear patterns make code easy to understand

For questions or issues with this architecture, please consult this document or refer to the implementation in `src/adapters/` and `src/services/`.
