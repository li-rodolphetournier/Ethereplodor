import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

const LABUBU_PATH = '/assets/models/labubu_classic_-_collectible_3d_figure/scene.gltf';

type LabubuProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export function Labubu({ position = [0, 0, 0], rotation = [0, Math.PI, 0], scale = 0.01 }: LabubuProps) {
  const { scene } = useGLTF(LABUBU_PATH);
  const labubuScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={labubuScene} />
    </group>
  );
}

useGLTF.preload(LABUBU_PATH);

