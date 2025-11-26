import { useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

const LABUBU_PATH = '/assets/models/labubu_classic_-_collectible_3d_figure/scene.gltf';

type LabubuProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

// Fallback simple si le modèle ne charge pas
function LabubuFallback({ position, rotation, scale }: LabubuProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 0.8]} />
        <meshToonMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshToonMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}

function LabubuModel({ position = [0, 0, 0], rotation = [0, Math.PI, 0], scale = 0.01 }: LabubuProps) {
  const { scene } = useGLTF(LABUBU_PATH);

  const labubuScene = useMemo(() => {
    if (!scene) return null;
    
    // Ne PAS cloner la scène entière pour éviter l'explosion mémoire
    // Utiliser directement la scène originale mais créer de nouveaux matériaux
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Récupérer le matériau original et sa couleur
        const originalMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        let baseColor = new THREE.Color('#8b7355'); // Couleur par défaut beige/marron
        let texture: THREE.Texture | undefined = undefined;

        if (originalMaterial) {
          // Essayer de récupérer la couleur du matériau original
          if ((originalMaterial as any).color instanceof THREE.Color) {
            baseColor = (originalMaterial as any).color.clone();
          }
          
          // Vérifier s'il y a une texture valide (avec vérification d'image)
          const originalMap = (originalMaterial as any).map;
          if (originalMap instanceof THREE.Texture && originalMap.image && originalMap.image.width > 0) {
            texture = originalMap;
            baseColor = new THREE.Color('#a0a0a0');
          }
        }

        // Créer le matériau toon avec la couleur originale ou la texture
        // Le gradientMap sera appliqué globalement par ToonGradientSetup
        const toonMaterial = new THREE.MeshToonMaterial({
          color: baseColor,
          ...(texture ? { map: texture } : {}),
        });

        mesh.material = toonMaterial;
      }
    });
    
    return scene;
  }, [scene]);

  // Si pas de scène, utiliser le fallback
  if (!labubuScene) {
    return <LabubuFallback position={position} rotation={rotation} scale={scale} />;
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={labubuScene} />
    </group>
  );
}

export function Labubu(props: LabubuProps) {
  return (
    <Suspense fallback={<LabubuFallback {...props} />}>
      <LabubuModel {...props} />
    </Suspense>
  );
}

// Préchargement du modèle
useGLTF.preload(LABUBU_PATH);

