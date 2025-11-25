import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface IsoCameraProps {
  target: THREE.Vector3;
  distance?: number;
}

export function IsometricCamera({ target, distance = 15 }: IsoCameraProps) {
  const { camera, size } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const cameraPositionRef = useRef(new THREE.Vector3());

  // Mettre à jour la référence de la cible
  useEffect(() => {
    targetRef.current.copy(target);
  }, [target]);

  // Configuration caméra
  useEffect(() => {
    const aspect = size.width / size.height;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 50;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  // Suit le joueur avec angle isométrique (lissage pour mouvement fluide)
  useFrame((_state, delta) => {
    // Angle isométrique classique: 30° sur XZ, 45° sur Y
    const isoAngle = Math.PI / 6; // 30 degrés
    const height = distance * Math.sin(isoAngle);
    const radius = distance * Math.cos(isoAngle);
    
    const desiredOffset = new THREE.Vector3(
      radius * Math.cos(Math.PI / 4), // 45 degrés sur XZ
      height,
      radius * Math.sin(Math.PI / 4)
    );
    
    const desiredPosition = targetRef.current.clone().add(desiredOffset);
    
    // Lissage du mouvement de la caméra
    cameraPositionRef.current.lerp(desiredPosition, 1 - Math.exp(-5 * delta));
    
    camera.position.copy(cameraPositionRef.current);
    camera.lookAt(targetRef.current);
  });

  return null;
}

