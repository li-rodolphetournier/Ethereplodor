import { useRef } from 'react';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { Creature as CreatureData } from '@/game/entities/Creature';
import { HealthBar } from '@/components/ui/HealthBar';

interface CreatureProps {
  creature: CreatureData;
  position: [number, number, number];
  isWild?: boolean;
}

export function Creature({ creature, position, isWild = true }: CreatureProps) {
  const creatureRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      <RigidBody
        ref={creatureRef}
        colliders={false}
        lockRotations
        type="dynamic"
        position={position}
      >
        <CapsuleCollider args={[0.3, 0.3]} />
        <mesh ref={meshRef} castShadow>
          <capsuleGeometry args={[0.3, 0.6]} />
          <meshStandardMaterial color={creature.color} />
        </mesh>
      </RigidBody>
      {creature.currentHp > 0 && (
        <HealthBar
          current={creature.currentHp}
          max={creature.stats.maxHp}
          position={[position[0], position[1] + 1, position[2]]}
        />
      )}
      {isWild && (
        <mesh position={[position[0], position[1] + 1.5, position[2]]}>
          <ringGeometry args={[0.5, 0.6, 16]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

