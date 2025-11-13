import './App.css';
import { ProductMap } from './components/ProductMap';
import { ResizableSidebar } from './components/ResizableSidebar';
import { ScreenshotViewer } from './components/ScreenshotViewer';
import { BottomInsightsPanel } from './components/BottomInsightsPanel';
import { RightHierarchyPanel } from './components/RightHierarchyPanel';
import { useProductData } from './hooks/useProductData';
import { useMapStore } from './store/mapStore';

function App() {
  // Load product map data on mount
  useProductData();
  const { selectedPageId } = useMapStore();

  return (
    <div className="app-container">
      <ResizableSidebar />
      <main className="main-content">
        {selectedPageId ? <ScreenshotViewer /> : <ProductMap />}
        <BottomInsightsPanel />
      </main>
      <RightHierarchyPanel />
    </div>
  );
}

export default App;
