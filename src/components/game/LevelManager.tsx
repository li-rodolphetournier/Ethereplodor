import { useMemo, useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useLevelStore, DoorDefinition } from '@/stores/levelStore';
import { usePlayerStore } from '@/stores/playerStore';

function DoorTrigger({ door }: { door: DoorDefinition }) {
  const playerPosition = usePlayerStore((state) => state.position);
  const transitionToLevel = useLevelStore((state) => state.transitionToLevel);
  const [isNear, setIsNear] = useState(false);
  const doorPosition = useMemo(
    () => new THREE.Vector3(door.position[0], door.position[1], door.position[2]),
    [door.position]
  );
  const triggerDistance = door.triggerDistance ?? 2;
  const nearRef = useRef(false);

  useFrame(() => {
    const distance = playerPosition.distanceTo(doorPosition);
    const currentNear = distance <= triggerDistance;
    if (currentNear !== nearRef.current) {
      nearRef.current = currentNear;
      setIsNear(currentNear);
    }
  });

  useEffect(() => {
    if (!isNear) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyE') {
        transitionToLevel(door.targetLevelId, door.targetSpawn);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNear, door.targetLevelId, door.targetSpawn, transitionToLevel]);

  return (
    <>
      {door.showDoorMesh && (
        <RigidBody type="fixed" position={door.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 2.4, 0.2]} />
            <meshStandardMaterial
              color="#4a2a1a"
              metalness={0.3}
              roughness={0.7}
              emissive="#2a120a"
              emissiveIntensity={0.2}
            />
          </mesh>
        </RigidBody>
      )}

      {isNear && (
        <Html position={[door.position[0], door.position[1] + 2.2, door.position[2]]} center>
          <div className="bg-black/80 border border-amber-500 text-amber-300 px-3 py-1 rounded text-sm shadow-lg">
            {door.prompt ?? 'Appuyer sur E'}
          </div>
        </Html>
      )}
    </>
  );
}

function OutdoorLevel() {
  return (
    <>
      {/* Sol principal */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[80, 1, 80]} />
          <meshStandardMaterial color="#2a2a1a" roughness={0.95} metalness={0.05} />
        </mesh>
      </RigidBody>

      {/* Chemins vers la maison */}
      <RigidBody type="fixed" position={[0, 0.01, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[6, 0.05, 2]} />
          <meshStandardMaterial color="#3a3a2a" roughness={0.9} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[3.5, 0.01, 1.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[5, 0.05, 2.5]} />
          <meshStandardMaterial color="#3a3a2a" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Maison */}
      <RigidBody type="fixed" position={[5, 1, -2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#4a2a1a" roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* Toit */}
      <RigidBody type="fixed" position={[5, 4.5, -2]}>
        <mesh castShadow>
          <coneGeometry args={[4.5, 2.5, 4]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Porte visible côté caméra */}
      <RigidBody type="fixed" position={[5.5, 1, 1.6]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 2, 0.1]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.8} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Lampe près de la porte */}
      <pointLight position={[4.5, 3, -2]} intensity={0.9} color="#ffb347" distance={6} decay={2} />
    </>
  );
}

function IndoorLevel() {
  return (
    <>
      {/* Sol intérieur */}
      <RigidBody type="fixed" position={[0, -0.1, -3]}>
        <mesh receiveShadow>
          <boxGeometry args={[12, 0.2, 12]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Murs */}
      <RigidBody type="fixed" position={[0, 1.5, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[12, 3, 0.5]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 1.5, 3]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[12, 3, 0.5]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-6, 1.5, -3]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.5, 3, 12]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[6, 1.5, -3]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.5, 3, 12]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Décoration intérieure */}
      <RigidBody type="fixed" position={[-2, 0.5, -3]}>
        <mesh castShadow>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Porte intérieure visible */}
      <RigidBody type="fixed" position={[0, 1, 2.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 2, 0.1]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Lumière chaude à l'intérieur */}
      <pointLight position={[0, 3, -3]} intensity={1.5} color="#ffb347" distance={10} decay={2} />
    </>
  );
}

export function LevelManager() {
  const currentLevel = useLevelStore((state) => state.currentLevel);

  return (
    <>
      {currentLevel.type === 'outdoor' ? <OutdoorLevel /> : <IndoorLevel />}
      {currentLevel.doors?.map((door) => (
        <DoorTrigger key={door.id} door={door} />
      ))}
    </>
  );
}


