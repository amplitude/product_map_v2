import { useState, useMemo } from 'react';
import { useMapStore } from '../store/mapStore';
import { Search, Filter, X } from 'lucide-react';

export function SearchFilter() {
  const { data, pageTypeFilter, selectedPageId, setPageTypeFilter } = useMapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const pageTypes = useMemo(() => {
    if (!data) return [];
    const types = new Set(data.pages.map((p) => p.pageType));
    return Array.from(types).sort();
  }, [data]);

  const matchedPages = useMemo(() => {
    if (!data || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return data.pages
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.url.toLowerCase().includes(query) ||
          p.pageType.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [data, searchQuery]);

  const handlePageClick = (pageId: string) => {
    const { setSelectedPage } = useMapStore.getState();
    setSelectedPage(pageId);
    setSearchQuery('');
  };

  return (
    <div className="search-filter">
      {/* Search Bar */}
      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && matchedPages.length > 0 && (
        <div className="search-results">
          {matchedPages.map((page) => (
            <button
              key={page.id}
              className={`search-result-item ${selectedPageId === page.id ? 'selected' : ''}`}
              onClick={() => handlePageClick(page.id)}
            >
              <div className="search-result-type">{page.pageType}</div>
              <div className="search-result-title">{page.title}</div>
              <div className="search-result-stats">
                {page.sessions} sessions • {page.uniqueUsers} users
              </div>
            </button>
          ))}
          {data && data.pages.length > 5 && (
            <div className="search-result-more">
              {data.pages.length - 5} more pages match your search
            </div>
          )}
        </div>
      )}

      {/* Filter Button */}
      <button
        className={`filter-button ${pageTypeFilter ? 'active' : ''}`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <Filter size={16} />
        <span>{pageTypeFilter || 'Filter'}</span>
        {pageTypeFilter && (
          <button
            className="filter-clear"
            onClick={(e) => {
              e.stopPropagation();
              setPageTypeFilter(null);
            }}
          >
            <X size={12} />
          </button>
        )}
      </button>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <>
          <div className="filter-overlay" onClick={() => setIsFilterOpen(false)} />
          <div className="filter-dropdown">
            <div className="filter-header">
              <h4>Filter by Page Type</h4>
              {pageTypeFilter && (
                <button
                  className="filter-reset"
                  onClick={() => {
                    setPageTypeFilter(null);
                    setIsFilterOpen(false);
                  }}
                >
                  Reset
                </button>
              )}
            </div>
            <div className="filter-options">
              {pageTypes.map((type) => {
                const count = data?.pages.filter((p) => p.pageType === type).length || 0;
                return (
                  <button
                    key={type}
                    className={`filter-option ${pageTypeFilter === type ? 'active' : ''}`}
                    onClick={() => {
                      setPageTypeFilter(type === pageTypeFilter ? null : type);
                      setIsFilterOpen(false);
                    }}
                  >
                    <span className="filter-option-name">{type}</span>
                    <span className="filter-option-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
