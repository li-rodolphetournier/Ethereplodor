import { useRef, useEffect } from 'react';
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { Torch } from './Torch';

export function Environment() {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const rockRef = useRef<THREE.InstancedMesh>(null);
  const treeRef = useRef<THREE.InstancedMesh>(null);
  const treeTrunkRef = useRef<THREE.InstancedMesh>(null);
  const tombstoneRef = useRef<THREE.InstancedMesh>(null);
  
  // Stocker les positions des arbres, roches et pierres tombales pour les colliders
  const treePositionsRef = useRef<Array<[number, number]>>([]);
  const rockPositionsRef = useRef<Array<{ position: [number, number, number]; scale: number }>>([]);
  const tombstonePositionsRef = useRef<Array<[number, number]>>([]);

  // Créer des instances pour l'herbe sombre
  useEffect(() => {
    if (grassRef.current) {
      const count = 80;
      const matrix = new THREE.Matrix4();

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        const y = 0;
        const scale = Math.random() * 0.3 + 0.2;

        matrix.makeScale(scale, scale, scale);
        matrix.setPosition(x, y, z);
        grassRef.current.setMatrixAt(i, matrix);
      }
      grassRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

      // Créer des rochers sombres
  useEffect(() => {
    if (rockRef.current) {
      const count = 35;
      const matrix = new THREE.Matrix4();
      const positions: Array<{ position: [number, number, number]; scale: number }> = [];

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        const y = 0;
        const scale = Math.random() * 0.4 + 0.3;
        // Calculer la hauteur réelle du rocher (centre de la géométrie)
        const rockHeight = 0.5 * scale; // Le dodecahedron a un rayon de 0.5

        matrix.makeScale(scale, scale, scale);
        matrix.setPosition(x, y + rockHeight, z);
        rockRef.current.setMatrixAt(i, matrix);
        // Position du collider au centre du rocher avec son scale
        positions.push({ position: [x, y + rockHeight, z], scale });
      }
      rockRef.current.instanceMatrix.needsUpdate = true;
      rockPositionsRef.current = positions;
    }
  }, []);

  // Créer des arbres avec feuillage vert
  useEffect(() => {
    if (treeRef.current && treeTrunkRef.current) {
      const count = 25;
      const matrix = new THREE.Matrix4();
      const positions: Array<[number, number]> = [];
      let index = 0;

      for (let i = 0; i < count * 2; i++) {
        const x = (Math.random() - 0.5) * 45;
        const z = (Math.random() - 0.5) * 45;
        // Éviter la rivière
        if (Math.abs(x) < 5) continue;
        if (index >= count) break;
        
        const y = 0;
        const scale = Math.random() * 0.5 + 0.8;
        const trunkScale = Math.random() * 0.3 + 0.7;

        // Feuillage
        matrix.makeScale(scale, scale, scale);
        matrix.setPosition(x, y, z);
        treeRef.current.setMatrixAt(index, matrix);
        
        // Tronc
        matrix.makeScale(trunkScale, trunkScale, trunkScale);
        treeTrunkRef.current.setMatrixAt(index, matrix);
        
        positions.push([x, z]);
        index++;
      }
      
      treeRef.current.instanceMatrix.needsUpdate = true;
      treeTrunkRef.current.instanceMatrix.needsUpdate = true;
      treePositionsRef.current = positions;
    }
  }, []);

  // Créer des pierres tombales
  useEffect(() => {
    if (tombstoneRef.current) {
      const count = 8;
      const matrix = new THREE.Matrix4();
      const positions: Array<[number, number]> = [];

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 35;
        const z = (Math.random() - 0.5) * 35;
        const y = 0;
        const scale = Math.random() * 0.2 + 0.3;

        matrix.makeScale(scale, scale, scale);
        matrix.setPosition(x, y, z);
        tombstoneRef.current.setMatrixAt(i, matrix);
        positions.push([x, z]);
      }
      tombstoneRef.current.instanceMatrix.needsUpdate = true;
      tombstonePositionsRef.current = positions;
    }
  }, []);

  return (
    <>
      {/* Sol sombre style Diablo IV avec variations */}
      <RigidBody type="fixed" position={[0, 0, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50, 64, 64]} />
          <meshStandardMaterial
            color="#2a2a1a"
            roughness={0.98}
            metalness={0.02}
            emissive="#1a1a0a"
            emissiveIntensity={0.05}
          />
        </mesh>
        {/* Collider explicite pour le sol */}
        <CuboidCollider args={[25, 0.1, 25]} position={[0, -0.1, 0]} />
      </RigidBody>

      {/* Rivière */}
      <RigidBody type="fixed" position={[0, -0.05, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 50, 16, 32]} />
          <meshStandardMaterial
            color="#4a7fa8"
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.8}
            emissive="#2a4f6a"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Collider pour la rivière (eau) */}
        <CuboidCollider args={[4, 0.05, 25]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Herbe verte */}
      <instancedMesh
        ref={grassRef}
        args={[undefined, undefined, 120]}
        castShadow
      >
        <coneGeometry args={[0.08, 0.25, 6]} />
        <meshStandardMaterial
          color="#4a7c3a"
          roughness={0.9}
          metalness={0.1}
        />
      </instancedMesh>

      {/* Rochers avec couleurs variées - avec collisions */}
      <instancedMesh
        ref={rockRef}
        args={[undefined, undefined, 35]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#6b6b6b"
          roughness={0.95}
          metalness={0.1}
        />
      </instancedMesh>
      
      {/* Colliders pour les roches instanciées */}
      {rockPositionsRef.current && rockPositionsRef.current.length > 0 && rockPositionsRef.current.map((rockData, i) => {
        const [x, y, z] = rockData.position;
        const scale = rockData.scale;
        // Calculer la taille du collider en fonction de la taille réelle de la roche
        const baseRadius = 0.5; // Rayon de base du dodecahedron
        const colliderRadius = baseRadius * scale;
        return (
          <RigidBody key={`rock-collider-${i}`} type="fixed" position={[x, y, z]}>
            <BallCollider args={[colliderRadius]} />
          </RigidBody>
        );
      })}
      
      {/* Rochers supplémentaires avec couleurs différentes - avec collisions */}
      {Array.from({ length: 20 })
        .map((_, i) => {
          const x = (Math.random() - 0.5) * 45;
          const z = (Math.random() - 0.5) * 45;
          // Éviter la rivière
          if (Math.abs(x) < 5) return null;
          const scale = Math.random() * 0.5 + 0.4;
          const colors = ['#7a7a7a', '#8b6b4a', '#6b5a4a', '#5a5a5a'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <RigidBody
              key={`rock-${i}`}
              type="fixed"
              position={[x, 0.25, z]}
            >
              <mesh
                scale={[scale, scale * 0.8, scale]}
                castShadow
                receiveShadow
              >
                <dodecahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.95}
                  metalness={0.1}
                />
              </mesh>
              <BallCollider args={[0.6 * scale]} />
            </RigidBody>
          );
        })
        .filter(Boolean)}

      {/* Arbres avec feuillage vert */}
      <instancedMesh
        ref={treeRef}
        args={[undefined, undefined, 25]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[0.8, 2.2, 8]} />
        <meshStandardMaterial
          color="#3a7a2a"
          roughness={0.9}
          metalness={0.1}
        />
      </instancedMesh>

      {/* Troncs d'arbres bruns */}
      <instancedMesh
        ref={treeTrunkRef}
        args={[undefined, undefined, 25]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.18, 0.18, 1.2, 8]} />
        <meshStandardMaterial
          color="#6b4a2a"
          roughness={0.9}
          metalness={0.1}
        />
      </instancedMesh>
      
      {/* Colliders pour les arbres */}
      {treePositionsRef.current && treePositionsRef.current.length > 0 && treePositionsRef.current.map(([x, z], i) => (
        <RigidBody key={`tree-collider-${i}`} type="fixed" position={[x, 0.6, z]}>
          <CuboidCollider args={[0.2, 0.6, 0.2]} />
        </RigidBody>
      ))}

      {/* Pierres tombales */}
      <instancedMesh
        ref={tombstoneRef}
        args={[undefined, undefined, 8]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial
          color="#2d2d2d"
          roughness={0.9}
          metalness={0.1}
        />
      </instancedMesh>
      
      {/* Colliders pour les pierres tombales */}
      {tombstonePositionsRef.current && tombstonePositionsRef.current.length > 0 && tombstonePositionsRef.current.map(([x, z], i) => (
        <RigidBody key={`tombstone-collider-${i}`} type="fixed" position={[x, 0.3, z]}>
          <CuboidCollider args={[0.2, 0.3, 0.05]} />
        </RigidBody>
      ))}

      {/* Pierres décoratives avec couleurs variées - avec collisions */}
      {Array.from({ length: 50 })
        .map((_, i) => {
          const x = (Math.random() - 0.5) * 45;
          const z = (Math.random() - 0.5) * 45;
          // Éviter la rivière
          if (Math.abs(x) < 5) return null;
          const scale = Math.random() * 0.2 + 0.1;
          const colors = ['#6b6b6b', '#7a6b5a', '#5a5a4a', '#6b5a4a'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <RigidBody
              key={`stone-${i}`}
              type="fixed"
              position={[x, -0.9, z]}
            >
              <mesh
                scale={[scale, scale, scale]}
                castShadow
                receiveShadow
              >
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.95}
                />
              </mesh>
              <BallCollider args={[0.3 * scale]} />
            </RigidBody>
          );
        })
        .filter(Boolean)}

      {/* Fleurs colorées - avec collisions */}
      {Array.from({ length: 30 })
        .map((_, i) => {
          const x = (Math.random() - 0.5) * 45;
          const z = (Math.random() - 0.5) * 45;
          // Éviter la rivière
          if (Math.abs(x) < 5) return null;
          const colors = ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4ecdc4', '#95e1d3'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <RigidBody
              key={`flower-${i}`}
              type="fixed"
              position={[x, 0.05, z]}
            >
              <mesh castShadow>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.5}
                />
              </mesh>
              <BallCollider args={[0.05]} />
            </RigidBody>
          );
        })
        .filter(Boolean)}

      {/* Torches - positions stratégiques */}
      <Torch position={[-8, 0, -8]} intensity={1.8} color="#ff8c42" distance={14} />
      <Torch position={[8, 0, -8]} intensity={1.8} color="#ff8c42" distance={14} />
      <Torch position={[-8, 0, 8]} intensity={1.8} color="#ff8c42" distance={14} />
      <Torch position={[8, 0, 8]} intensity={1.8} color="#ff8c42" distance={14} />
      <Torch position={[0, 0, -12]} intensity={2.0} color="#ff8c42" distance={16} />
      <Torch position={[-12, 0, 0]} intensity={2.0} color="#ff8c42" distance={16} />
      <Torch position={[12, 0, 0]} intensity={2.0} color="#ff8c42" distance={16} />
      <Torch position={[0, 0, 12]} intensity={2.0} color="#ff8c42" distance={16} />
      
      {/* Torches près des pierres tombales */}
      <Torch position={[-5, 0, -5]} intensity={1.5} color="#ff6b35" distance={12} />
      <Torch position={[5, 0, 5]} intensity={1.5} color="#ff6b35" distance={12} />
      
      {/* Torches centrales pour éclairage principal */}
      <Torch position={[-3, 0, 0]} intensity={1.6} color="#ff8c42" distance={13} />
      <Torch position={[3, 0, 0]} intensity={1.6} color="#ff8c42" distance={13} />
      <Torch position={[0, 0, -3]} intensity={1.6} color="#ff8c42" distance={13} />
      <Torch position={[0, 0, 3]} intensity={1.6} color="#ff8c42" distance={13} />
    </>
  );
}
