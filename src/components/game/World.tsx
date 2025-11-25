import { Canvas, useThree } from '@react-three/fiber';
import { Sky, Environment as DreiEnvironment } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { IsometricCamera } from './IsometricCamera';
import { Player } from './Player';
import { EnemyManager } from './EnemyManager';
import { WildCreatureManager } from './WildCreatureManager';
import { LootManager } from './LootManager';
import { Environment } from './Environment';
import { DamageNumberManager } from '../effects/DamageNumberManager';
import { usePlayerStore } from '@/stores/playerStore';
import { useEffect } from 'react';
import * as THREE from 'three';

// Composant pour configurer le brouillard
function FogComponent() {
  const { scene } = useThree();
  
  useEffect(() => {
    const fog = new THREE.Fog('#4a4a5a', 30, 80);
    scene.fog = fog;
    
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}

export function World() {
  const playerPosition = usePlayerStore((state) => state.position);

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
      camera={{
        position: [10, 10, 10],
        fov: 50,
      }}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {/* Éclairage amélioré - style Diablo mais plus visible */}
      <ambientLight intensity={0.8} color="#6a6a7a" />
      
      {/* Lumière principale directionnelle (soleil/lune) */}
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
        color="#e4d5b9"
      />

      {/* Lumière d'ambiance supplémentaire pour visibilité */}
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.6}
        color="#9badd3"
      />

      {/* Lumière d'ambiance rougeâtre (style infernal) - réduite */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.3}
        color="#ff6b35"
        distance={20}
        decay={2}
      />

      {/* Brouillard sombre */}
      <FogComponent />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Environnement décoratif */}
        <Environment />

        {/* Obstacles de test avec collisions */}
        <RigidBody type="fixed" position={[5, 1, 5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
              color="#2d1810"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" position={[-5, 1, -5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.1}
              roughness={0.9}
            />
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
      
      {/* Ciel sombre */}
      <Sky
        sunPosition={[100, 20, 100]}
        turbidity={8}
        rayleigh={1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49}
        azimuth={0.25}
      />
      
      {/* Environnement post-processing - désactivé pour plus de visibilité */}
      {/* <DreiEnvironment preset="night" /> */}
      <DamageNumberManager />
    </Canvas>
  );
}
