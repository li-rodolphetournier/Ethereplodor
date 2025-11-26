import { Canvas, useThree } from '@react-three/fiber';
import { Environment as DreiEnvironment, Html } from '@react-three/drei';
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

// Créer un gradient map global pour le cell shading
function createGradientMap(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 256, 0);
  // Créer un gradient avec des bandes nettes pour le cell shading
  gradient.addColorStop(0, '#000000'); // Ombre foncée
  gradient.addColorStop(0.4, '#000000'); // Ombre foncée
  gradient.addColorStop(0.41, '#404040'); // Transition nette
  gradient.addColorStop(0.6, '#808080'); // Ombre moyenne
  gradient.addColorStop(0.61, '#c0c0c0'); // Transition nette
  gradient.addColorStop(0.8, '#e0e0e0'); // Lumière moyenne
  gradient.addColorStop(0.81, '#ffffff'); // Transition nette
  gradient.addColorStop(1, '#ffffff'); // Lumière
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 1);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Composant pour configurer le gradient map global pour tous les MeshToonMaterial
function ToonGradientSetup() {
  const { scene } = useThree();
  
  useEffect(() => {
    const gradientMap = createGradientMap();
    
    // Appliquer le gradient map à tous les MeshToonMaterial de la scène
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!Array.isArray(mesh.material) && (mesh.material as THREE.MeshToonMaterial).isMeshToonMaterial) {
          (mesh.material as THREE.MeshToonMaterial).gradientMap = gradientMap;
        } else if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if ((mat as THREE.MeshToonMaterial).isMeshToonMaterial) {
              (mat as THREE.MeshToonMaterial).gradientMap = gradientMap;
            }
          });
        }
      }
    });
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
        toneMappingExposure: 1.6,
      }}
      camera={{
        position: [10, 10, 10],
        fov: 50,
      }}
      tabIndex={0}
      style={{ outline: 'none', background: '#111118' }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#111118');
      }}
    >
      {/* Éclairage principal */}
      <ambientLight intensity={0.7} color="#4a4033" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={2.0}
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
      <directionalLight position={[-15, 12, -8]} intensity={0.8} color="#7075a0" />
      <directionalLight position={[0, 15, 0]} intensity={0.6} color="#e0e0ff" />

      {/* Lumières d'ambiance chaude */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#8b0000" distance={25} decay={2} castShadow />
      <pointLight position={[-10, 2, -10]} intensity={0.3} color="#ff4500" distance={20} decay={2} />
      <pointLight position={[10, 2, 10]} intensity={0.3} color="#ff4500" distance={20} decay={2} />

      <FogComponent />
      <ToonGradientSetup />

      {/* Ciel désactivé pour garder un fond sombre contrôlé par le clearColor */}

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

      {/* Environnement désactivé pour éviter le chargement HDR trop lourd */}
      {/* <DreiEnvironment preset="night" /> */}
      <DamageNumberManager />
    </Canvas>
  );
}
