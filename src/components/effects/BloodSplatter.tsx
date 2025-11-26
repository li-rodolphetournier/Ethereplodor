import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BloodSplatterProps {
  position: [number, number, number];
  direction: THREE.Vector3;
  intensity?: number;
}

/**
 * Effet de projection de sang style Diablo IV
 * Apparaît lors des attaques et dégâts
 */
export function BloodSplatter({ position, direction, intensity = 1 }: BloodSplatterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const lifetime = useRef(1.5);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.3, 0.3);
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8b0000',
      transparent: true,
      opacity: 0.9,
      emissive: '#4a0000',
      emissiveIntensity: 0.3,
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  // Orienter le mesh vers la direction spécifiée
  useEffect(() => {
    if (meshRef.current) {
      const targetPos = new THREE.Vector3().copy(direction);
      meshRef.current.lookAt(targetPos);
    }
  }, [direction]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    timeRef.current += delta;
    const progress = timeRef.current / lifetime.current;

    if (progress >= 1) {
      // Fade out complet
      if (meshRef.current.parent) {
        meshRef.current.parent.remove(meshRef.current);
      }
      return;
    }

    // Animation de chute et fade out
    meshRef.current.position.y -= delta * 2;
    material.opacity = 0.9 * (1 - progress);
    material.emissiveIntensity = 0.3 * (1 - progress);

    // Rotation aléatoire
    meshRef.current.rotation.z += delta * 2;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
    />
  );
}

