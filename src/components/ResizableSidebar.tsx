import { useState, useEffect } from 'react';
import { JourneySelector } from './JourneySelector';
import { SearchFilter } from './SearchFilter';
import { FuturisticNav } from './FuturisticNav';

export function ResizableSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      setSidebarWidth(Math.max(280, Math.min(500, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
      {/* Resize Handle */}
      <div
        className={`resize-handle resize-handle-vertical ${isResizing ? 'resizing' : ''}`}
        style={{ right: 0 }}
        onMouseDown={() => setIsResizing(true)}
      />

      <div className="sidebar-header">
        <h1>Product Map</h1>
        <p>Command & Control for Product Analytics</p>
      </div>
      <div className="sidebar-content">
        <JourneySelector />
        <SearchFilter />
        <FuturisticNav />
      </div>
    </aside>
  );
}
