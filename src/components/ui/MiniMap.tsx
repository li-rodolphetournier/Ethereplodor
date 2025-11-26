import { useRef, useEffect } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import * as THREE from 'three';

interface MiniMapProps {
  size?: number;
  zoom?: number;
}

export function MiniMap({ size = 200, zoom = 0.1 }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPosition = usePlayerStore((state) => state.position);
  const enemies = useGameStore((state) => state.enemies);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, size, size);

      // Draw grid
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let i = 0; i <= gridSize; i++) {
        const pos = (size / gridSize) * i;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
        ctx.stroke();
      }

      // Center point (player position)
      const centerX = size / 2;
      const centerY = size / 2;

      // Draw world bounds (50x50)
      const worldSize = 50;
      const mapScale = (size * 0.8) / worldSize;
      
      ctx.strokeStyle = '#8b7355';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        centerX - (worldSize * mapScale) / 2,
        centerY - (worldSize * mapScale) / 2,
        worldSize * mapScale,
        worldSize * mapScale
      );

      // Draw enemies (red dots)
      enemies.forEach((enemy) => {
        const relativeX = enemy.position.x - playerPosition.x;
        const relativeZ = enemy.position.z - playerPosition.z;
        const mapX = centerX + relativeX * mapScale * zoom;
        const mapY = centerY + relativeZ * mapScale * zoom;

        // Only draw if within map bounds
        if (mapX >= 0 && mapX <= size && mapY >= 0 && mapY <= size) {
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(mapX, mapY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw player (green dot with direction indicator)
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Player direction indicator
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - 8);
      ctx.stroke();

      // Draw compass (N indicator)
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('N', centerX - 5, 15);
    };

    const interval = setInterval(draw, 100); // Update 10 times per second
    draw();

    return () => clearInterval(interval);
  }, [size, zoom, playerPosition, enemies]);

  return (
    <div className="fixed top-4 right-4 bg-black/90 border-2 border-amber-800/50 rounded-lg p-2 shadow-lg z-10">
      <div className="text-amber-500 text-xs font-bold mb-1 text-center">Mini-Map</div>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-amber-800/50 rounded"
      />
      <div className="text-amber-700 text-xs mt-1 text-center">
        Ennemis: {enemies.size}
      </div>
    </div>
  );
}

