import { useEffect } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
};
