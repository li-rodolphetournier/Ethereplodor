import { Canvas } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { IsometricCamera } from './IsometricCamera';
import { Player } from './Player';
import { EnemyManager } from './EnemyManager';
import { WildCreatureManager } from './WildCreatureManager';
import { LootManager } from './LootManager';
import { usePlayerStore } from '@/stores/playerStore';

export function World() {
  const playerPosition = usePlayerStore((state) => state.position);

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      camera={{
        position: [10, 10, 10],
        fov: 50,
      }}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Sol avec collision */}
        <RigidBody type="fixed" position={[0, -1, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[50, 0.1, 50]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>
        </RigidBody>

        {/* Obstacles de test avec collisions */}
        <RigidBody type="fixed" position={[5, 1, 5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[-5, 1, -5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </RigidBody>

        {/* Joueur */}
        <Player />

        {/* Ennemis */}
        <EnemyManager />

        {/* Créatures sauvages */}
        <WildCreatureManager />

        {/* Loot */}
        <LootManager />
      </Physics>

      <IsometricCamera target={playerPosition} distance={15} />
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
    </Canvas>
  );
}

