import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Composant pour appliquer des effets post-processing style Diablo IV
 * Améliore le contraste, la saturation et l'ambiance sombre
 */
export function PostProcessing() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    // Configuration du renderer pour un style plus sombre et contrasté
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.7; // Plus sombre pour l'ambiance Diablo

    // Ajuster le gamma pour plus de contraste
    gl.gammaFactor = 2.2;
  }, [gl]);

  return null;
}

