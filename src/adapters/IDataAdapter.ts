/**
 * Base interface for all data adapters
 *
 * This interface defines the contract that all data adapters must implement.
 * It provides a consistent way to fetch data regardless of the underlying source
 * (local files, API, mock data, etc.)
 *
 * @template T The type of data this adapter returns
 */
export interface IDataAdapter<T> {
  /**
   * Fetch all data of this type
   * @returns Promise resolving to the data
   */
  fetchAll(): Promise<T>;

  /**
   * Fetch a single item by ID (optional, not all adapters need this)
   * @param id The unique identifier
   * @returns Promise resolving to the item or null if not found
   */
  fetchById?(id: string): Promise<T | null>;
}

/**
 * Configuration for data adapters
 * Can be extended to include API endpoints, auth tokens, etc.
 */
export interface AdapterConfig {
  /**
   * Base URL for API calls (used by API adapters)
   */
  baseUrl?: string;

  /**
   * Base path for local files (used by local adapters)
   */
  basePath?: string;

  /**
   * Auth token for API calls
   */
  authToken?: string;

  /**
   * Timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Adapter type values
 */
export const AdapterType = {
  LOCAL: 'local',
  API: 'api',
  MOCK: 'mock',
} as const;

export type AdapterType = (typeof AdapterType)[keyof typeof AdapterType];
