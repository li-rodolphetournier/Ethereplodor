import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { LootDrop as LootDropData } from '@/game/systems/LootSystem';
import { Html } from '@react-three/drei';

interface LootDropProps {
  drop: LootDropData;
  onPickup: (dropId: string) => void;
}

export function LootDrop({ drop, onPickup }: LootDropProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta;
      // Animation de flottement
      meshRef.current.position.y = drop.position.y + Math.sin(timeRef.current * 2) * 0.2;
      // Rotation
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <group position={[drop.position.x, drop.position.y, drop.position.z]}>
      <RigidBody type="fixed" colliders={false}>
        <CapsuleCollider args={[0.2, 0.2]} />
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color={drop.item.color}
            emissive={drop.item.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      </RigidBody>
      <Html position={[0, 0.8, 0]} center>
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {drop.item.name}
        </div>
      </Html>
    </group>
  );
}

