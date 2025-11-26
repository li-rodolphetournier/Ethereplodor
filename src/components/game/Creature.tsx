import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { Creature as CreatureData, CreatureType } from '@/game/entities/Creature';
import { HealthBar } from '@/components/ui/HealthBar';

interface CreatureProps {
  creature: CreatureData;
  position: [number, number, number];
  isWild?: boolean;
}

export function Creature({ creature, position, isWild = true }: CreatureProps) {
  const creatureRef = useRef<any>(null);
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    timeRef.current += delta;
    
    // Animation de flottement
    if (bodyRef.current && meshRef.current) {
      const floatAmount = 0.1;
      const floatSpeed = 2;
      bodyRef.current.position.y = Math.sin(timeRef.current * floatSpeed) * floatAmount;
      
      // Rotation lente
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Couleurs sombres style Diablo selon le type
  const getTypeColor = (type: CreatureType): string => {
    const colors = {
      [CreatureType.FIRE]: '#8b0000', // Rouge sombre
      [CreatureType.WATER]: '#1a3a5a', // Bleu sombre
      [CreatureType.GRASS]: '#2d4a2d', // Vert sombre
      [CreatureType.ELECTRIC]: '#5a4a1a', // Jaune sombre
      [CreatureType.GROUND]: '#3a2a1a', // Marron sombre
      [CreatureType.FLYING]: '#4a3a5a', // Violet sombre
    };
    return colors[type] || creature.color;
  };

  const typeColor = getTypeColor(creature.type);

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
        <group ref={meshRef}>
          {/* Corps principal - sombre */}
          <mesh ref={bodyRef} castShadow>
            <icosahedronGeometry args={[0.4, 1]} />
            <meshToonMaterial
              color={typeColor}
              emissive={typeColor}
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Yeux lumineux */}
          <mesh castShadow position={[0.15, 0.1, 0.35]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshToonMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh castShadow position={[-0.15, 0.1, 0.35]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshToonMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh castShadow position={[0.15, 0.1, 0.4]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshToonMaterial color="#000000" />
          </mesh>
          <mesh castShadow position={[-0.15, 0.1, 0.4]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshToonMaterial color="#000000" />
          </mesh>

          {/* Ailes pour Flying - sombres */}
          {creature.type === CreatureType.FLYING && (
            <>
              <mesh castShadow position={[0.3, 0.2, 0]} rotation={[0, 0, 0.5]}>
                <coneGeometry args={[0.15, 0.4, 8]} />
                <meshToonMaterial
                  color={typeColor}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              <mesh castShadow position={[-0.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
                <coneGeometry args={[0.15, 0.4, 8]} />
                <meshToonMaterial
                  color={typeColor}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </>
          )}

          {/* Flammes pour Fire - sombres */}
          {creature.type === CreatureType.FIRE && (
            <mesh position={[0, -0.3, 0]}>
              <coneGeometry args={[0.2, 0.3, 8]} />
              <meshToonMaterial
                color="#5a1a00"
                emissive="#8b0000"
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          )}

          {/* Aura sombre selon le type */}
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.5, 0.6, 32]} />
            <meshBasicMaterial
              color={typeColor}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
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
          <meshBasicMaterial color="#8b7355" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}
