import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TorchProps {
  position: [number, number, number];
  intensity?: number;
  color?: string;
  distance?: number;
}

export function Torch({ position, intensity = 1.5, color = '#ff8c42', distance = 12 }: TorchProps) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    timeRef.current += delta;

    // Animation de la flamme
    if (flameRef.current) {
      const flicker = Math.sin(timeRef.current * 10) * 0.1 + Math.cos(timeRef.current * 7) * 0.05;
      flameRef.current.scale.y = 1 + flicker;
      flameRef.current.position.y = position[1] + 0.8 + Math.sin(timeRef.current * 8) * 0.05;
    }

    // Variation d'intensité de la lumière
    if (lightRef.current) {
      const intensityVariation = 0.2 + Math.sin(timeRef.current * 6) * 0.1;
      lightRef.current.intensity = intensity * (0.8 + intensityVariation);
    }
  });

  return (
    <group position={position}>
      {/* Bâton de torche */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial
          color="#4a3728"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Flamme */}
      <mesh ref={flameRef} position={[0, 0.8, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Lumière point */}
      <pointLight
        ref={lightRef}
        position={[0, 0.8, 0]}
        intensity={intensity}
        color={color}
        distance={distance}
        decay={2}
        castShadow
      />
    </group>
  );
}
