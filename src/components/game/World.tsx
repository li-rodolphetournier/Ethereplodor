import { Canvas, useThree } from '@react-three/fiber';
import { Sky, Environment as DreiEnvironment, Html } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { IsometricCamera } from './IsometricCamera';
import { Player } from './Player';
import { EnemyManager } from './EnemyManager';
import { WildCreatureManager } from './WildCreatureManager';
import { LootManager } from './LootManager';
import { DamageNumberManager } from '../effects/DamageNumberManager';
import { usePlayerStore } from '@/stores/playerStore';
import { LevelManager } from './LevelManager';
import { useLevelStore } from '@/stores/levelStore';
import { useEffect } from 'react';
import * as THREE from 'three';

// Composant pour configurer le brouillard style Diablo IV
function FogComponent() {
  const { scene } = useThree();
  
  useEffect(() => {
    // Brouillard sombre mais visible style Diablo IV
    const fog = new THREE.Fog('#3a3a2a', 30, 80);
    scene.fog = fog;
    
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}

export function World() {
  const playerPosition = usePlayerStore((state) => state.position);
  const currentLevel = useLevelStore((state) => state.currentLevel);
  const isLoading = useLevelStore((state) => state.isLoading);

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5, // Plus lumineux pour voir la scène
      }}
      camera={{
        position: [10, 10, 10],
        fov: 50,
      }}
      tabIndex={0}
      style={{ outline: 'none', background: '#1a1a1a' }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#1a1a1a');
      }}
    >
      {/* Éclairage principal */}
      <ambientLight intensity={0.8} color="#5a5a4a" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
        shadow-radius={4}
        color="#f4e5c9"
      />

      {/* Lumières secondaires */}
      <directionalLight position={[-15, 12, -8]} intensity={1} color="#a0b0d3" />
      <directionalLight position={[0, 15, 0]} intensity={0.8} color="#ffffff" />

      {/* Lumières d'ambiance chaude */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#8b0000" distance={25} decay={2} castShadow />
      <pointLight position={[-10, 2, -10]} intensity={0.3} color="#ff4500" distance={20} decay={2} />
      <pointLight position={[10, 2, 10]} intensity={0.3} color="#ff4500" distance={20} decay={2} />

      <FogComponent />

      <Physics gravity={[0, -9.81, 0]}>
        <LevelManager />
        <Player />
        {currentLevel?.type === 'outdoor' && <EnemyManager />}
        {currentLevel?.type === 'outdoor' && <WildCreatureManager />}
        <LootManager />
      </Physics>

      {isLoading && (
        <Html center>
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="text-amber-500 text-2xl font-bold">Chargement...</div>
          </div>
        </Html>
      )}

      <IsometricCamera target={playerPosition} distance={15} />

      {/* On désactive le ciel afin de garder un fond sombre */}
      {/* <Sky ... /> */}
      <DreiEnvironment preset="night" />
      <DamageNumberManager />
    </Canvas>
  );
}
