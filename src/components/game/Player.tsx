import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { inputManager } from '@/engine/input/InputManager';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { combatSystem } from '@/game/systems/CombatSystem';

export function Player() {
  const playerRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const lastAttackTimeRef = useRef(0);
  const { setPosition, setRotation, setIsMoving, setAnimationState, speed } = usePlayerStore();
  const equippedWeapon = useInventoryStore((state) => state.equippedWeapon);
  const equippedArmor = useInventoryStore((state) => state.equippedArmor);

  // Initialiser l'InputManager
  useEffect(() => {
    // S'assurer que l'InputManager est initialisé
    if (!inputManager.initialized) {
      inputManager.init();
    }
    
    return () => {
      // Ne pas nettoyer l'InputManager ici car il peut être utilisé ailleurs
      // Il sera nettoyé au démontage de l'application si nécessaire
    };
  }, []);

  // Pour l'instant, on utilise une géométrie simple (sera remplacée par un modèle 3D plus tard)
  useFrame(() => {
    if (!playerRef.current || !meshRef.current) return;
    
    // Vérifier que le RigidBody est bien initialisé (a une méthode setLinvel)
    if (typeof playerRef.current.setLinvel !== 'function') {
      console.warn('RigidBody not initialized yet');
      return;
    }

    const movement = inputManager.getMovementVector();
    const isMoving = movement.length() > 0;
    const playerHealth = usePlayerStore.getState().health;
    
    // Debug temporaire pour vérifier le mouvement
    if (isMoving && Math.random() < 0.01) { // ~1% des frames
      console.log('Movement detected:', { movement, speed, vector: { x: movement.x * speed, z: movement.z * speed } });
    }

    // Vérifier si le joueur est mort
    if (playerHealth <= 0) {
      setAnimationState('idle');
      return;
    }

    setIsMoving(isMoving);

    // Déterminer l'état d'animation
    if (inputManager.isMouseButtonPressed(0)) {
      // Clic gauche = attaque
      setAnimationState('attack');
    } else if (isMoving) {
      setAnimationState('walk');
    } else {
      setAnimationState('idle');
    }

    // Appliquer mouvement via physique
    const currentVel = playerRef.current.linvel();
    
    if (isMoving) {
      // Calculer la vélocité cible
      const targetVelX = movement.x * speed;
      const targetVelZ = movement.z * speed;
      
      // Appliquer la vélocité avec setLinvel - utiliser un objet {x, y, z}
      playerRef.current.setLinvel(
        {
          x: targetVelX,
          y: currentVel.y, // Préserver la vélocité Y pour la gravité
          z: targetVelZ,
        },
        true
      );

      // Rotation vers la direction de mouvement
      const angle = Math.atan2(movement.x, movement.z);
      setRotation(angle);

      // Rotation visuelle du mesh
      if (meshRef.current) {
        meshRef.current.rotation.y = angle;
      }
    } else {
      // Arrêter le mouvement horizontal en préservant la vélocité Y
      // Utiliser une approche avec damping pour un arrêt plus naturel
      playerRef.current.setLinvel(
        {
          x: currentVel.x * 0.9, // Réduire progressivement
          y: currentVel.y,
          z: currentVel.z * 0.9,
        },
        true
      );
    }

    // Attaque au clic (avec cooldown)
    const attackCooldown = 500; // 0.5 secondes

    if (inputManager.isMouseButtonPressed(0)) {
      const currentTime = Date.now();
      if (currentTime - lastAttackTimeRef.current >= attackCooldown) {
        const playerPos = new THREE.Vector3(
          playerRef.current.translation().x,
          playerRef.current.translation().y,
          playerRef.current.translation().z
        );
        const attackRange = 2.5;

        // Vérifier les ennemis à portée
        const enemies = Array.from(useGameStore.getState().enemies.values());
        enemies.forEach((enemy) => {
          if (enemy.hp > 0 && playerPos.distanceTo(enemy.position) <= attackRange) {
            // Calculer l'attaque avec l'arme équipée
            const baseAttack = 15;
            const weaponBonus = equippedWeapon?.stats?.attack || 0;
            const totalAttack = baseAttack + weaponBonus;

            const damage = combatSystem.calculateDamage(
              {
                id: 'player',
                hp: playerHealth,
                maxHp: 100,
                attack: totalAttack,
                defense: 5 + (equippedArmor?.stats?.defense || 0),
                position: playerPos,
              },
              enemy
            );
            const newHp = Math.max(0, enemy.hp - damage);
            useGameStore.getState().updateEnemy(enemy.id, { hp: newHp });

            if (newHp <= 0) {
              console.log(`Enemy ${enemy.id} vaincu!`);
            }
          }
        });
        lastAttackTimeRef.current = currentTime;
      }
    }

    // Mettre à jour la position dans le store
    const position = playerRef.current.translation();
    setPosition(new THREE.Vector3(position.x, position.y, position.z));
  });

  return (
    <RigidBody
      ref={playerRef}
      colliders={false}
      lockRotations
      type="dynamic"
      position={[0, 2, 0]}
      canSleep={false}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh ref={meshRef} castShadow>
        {/* Géométrie temporaire - sera remplacée par un modèle 3D */}
        <capsuleGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </RigidBody>
  );
}

