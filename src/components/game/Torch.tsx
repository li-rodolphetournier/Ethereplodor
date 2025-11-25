import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TorchProps {
  position: [number, number, number];
  intensity?: number;
  color?: string;
  distance?: number;
}

export function Torch({ 
  position, 
  intensity = 1.5, 
  color = '#ff8c42',
  distance = 12 
}: TorchProps) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Animation de la flamme
  useFrame((_state, delta) => {
    if (flameRef.current) {
      // Oscillation de la flamme
      const time = Date.now() * 0.003;
      flameRef.current.scale.y = 1 + Math.sin(time) * 0.2;
      flameRef.current.scale.x = 1 + Math.cos(time * 1.3) * 0.15;
      flameRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    }

    // Variation de l'intensité de la lumière
    if (lightRef.current) {
      const flicker = 1 + (Math.random() - 0.5) * 0.15;
      lightRef.current.intensity = intensity * flicker;
    }
  });

  return (
    <group position={position}>
      {/* Support de la torche - poteau */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial
          color="#2d2d2d"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Tête de la torche - support métallique */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Flamme - partie principale */}
      <mesh
        ref={flameRef}
        position={[0, 1.3, 0]}
        castShadow={false}
      >
        <coneGeometry args={[0.12, 0.4, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Flamme - partie centrale plus brillante */}
      <mesh
        position={[0, 1.35, 0]}
        castShadow={false}
      >
        <coneGeometry args={[0.06, 0.25, 6]} />
        <meshBasicMaterial
          color="#ffff99"
          transparent
          opacity={0.9}
          emissive="#ffff99"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Point de lumière */}
      <pointLight
        ref={lightRef}
        position={[0, 1.3, 0]}
        intensity={intensity}
        color={color}
        distance={distance}
        decay={2}
        castShadow
      />
    </group>
  );
}

