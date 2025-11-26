import { useEffect, useState } from 'react';
import { useDraggable } from '@/hooks/useDraggable';

interface MemoryStats {
  usedMB: number;
  limitMB: number;
}

export function PerfPanel() {
  const [fps, setFps] = useState<number>(0);
  const [ms, setMs] = useState<number>(0);
  const [memory, setMemory] = useState<MemoryStats | null>(null);

  const { ref, position, handleMouseDown } = useDraggable({
    initialPosition: { x: 16, y: 120 },
    bounds: 'window',
  });

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let accTime = 0;

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      frameCount += 1;
      accTime += delta;

      if (accTime >= 500) {
        const avgMs = accTime / frameCount;
        setMs(avgMs);
        setFps(1000 / avgMs);

        if ('memory' in performance) {
          const perfMemory = (performance as Performance & {
            memory?: {
              usedJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }).memory;

          if (perfMemory) {
            setMemory({
              usedMB: perfMemory.usedJSHeapSize / (1024 * 1024),
              limitMB: perfMemory.jsHeapSizeLimit / (1024 * 1024),
            });
          }
        }

        frameCount = 0;
        accTime = 0;
      }

      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-30 cursor-move select-none text-xs"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-black/80 border border-amber-700 rounded-md px-3 py-2 shadow-lg text-amber-100 min-w-[140px]">
        <div className="font-semibold text-amber-400 mb-1 text-[11px]">Performance</div>
        <div className="flex justify-between">
          <span>FPS</span>
          <span className="font-mono">{fps.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frame</span>
          <span className="font-mono">{ms.toFixed(1)} ms</span>
        </div>
        {memory && (
          <div className="flex justify-between mt-1">
            <span>JS heap</span>
            <span className="font-mono">
              {memory.usedMB.toFixed(1)} / {memory.limitMB.toFixed(0)} MB
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


