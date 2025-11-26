import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  position: [number, number, number];
  color?: string;
  count?: number;
  size?: number;
  speed?: number;
  lifetime?: number;
}

/**
 * Système de particules pour effets visuels style Diablo IV
 * Utilisé pour les flammes, fumées, particules de sang, etc.
 */
export function ParticleSystem({
  position,
  color = '#ff6b35',
  count = 100,
  size = 0.1,
  speed = 0.5,
  lifetime = 2,
}: ParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Position initiale autour du point
      positions[i3] = position[0] + (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = position[1] + Math.random() * 0.5;
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5;

      // Vélocité aléatoire
      velocities[i3] = (Math.random() - 0.5) * speed;
      velocities[i3 + 1] = Math.random() * speed * 2;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;

      // Lifetime
      lifetimes[i] = Math.random() * lifetime;
    }

    return { positions, velocities, lifetimes };
  }, [count, position, speed, lifetime]);

  useFrame((_state, delta) => {
    if (!particlesRef.current) return;

    timeRef.current += delta;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const life = lifetimes[i];

      if (timeRef.current > life) {
        // Réinitialiser la particule
        positions[i3] = position[0] + (Math.random() - 0.5) * 0.5;
        positions[i3 + 1] = position[1];
        positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5;
        lifetimes[i] = timeRef.current + Math.random() * lifetime;
      } else {
        // Mettre à jour la position
        positions[i3] += velocities[i3] * delta;
        positions[i3 + 1] += velocities[i3 + 1] * delta;
        positions[i3 + 2] += velocities[i3 + 2] * delta;

        // Gravité
        velocities[i3 + 1] -= 9.81 * delta * 0.1;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleColor = new THREE.Color(color);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={particleColor}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

