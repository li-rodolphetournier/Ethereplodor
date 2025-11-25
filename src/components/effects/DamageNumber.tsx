import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DamageNumberProps {
  damage: number;
  position: [number, number, number];
  isCritical?: boolean;
  onComplete: () => void;
}

export function DamageNumber({ damage, position, isCritical = false, onComplete }: DamageNumberProps) {
  const timeRef = useRef(0);
  const startY = position[1];

  useFrame((_state, delta) => {
    timeRef.current += delta;
    
    if (timeRef.current > 1) {
      onComplete();
    }
  });

  const currentY = startY + timeRef.current * 2;
  const opacity = Math.max(0, 1 - timeRef.current);

  return (
    <Html position={[position[0], currentY, position[2]]} center>
      <div
        className={`font-bold text-2xl ${
          isCritical ? 'text-yellow-500' : 'text-red-600'
        }`}
        style={{
          opacity,
          transform: `translateY(${-timeRef.current * 20}px)`,
          textShadow: isCritical
            ? '0 0 10px rgba(234, 179, 8, 0.8), 2px 2px 4px rgba(0,0,0,0.9)'
            : '0 0 8px rgba(220, 38, 38, 0.6), 2px 2px 4px rgba(0,0,0,0.9)',
          fontWeight: '900',
        }}
      >
        {isCritical && '💥 '}
        -{damage}
      </div>
    </Html>
  );
}

