import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { inputManager } from '@/engine/input/InputManager';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { combatSystem } from '@/game/systems/CombatSystem';
import { showDamageNumber } from '@/components/effects/DamageNumberManager';
import { useLevelStore } from '@/stores/levelStore';

export function Player() {
  const playerRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const lastAttackTimeRef = useRef(0);
  const { setPosition, setRotation, setIsMoving, setAnimationState, speed } = usePlayerStore();
  const equippedWeapon = useInventoryStore((state) => state.equippedWeapon);
  const equippedArmor = useInventoryStore((state) => state.equippedArmor);
  const currentLevel = useLevelStore((state) => state.currentLevel);

  useEffect(() => {
    if (!playerRef.current || !meshRef.current) return;
    const spawn = currentLevel.spawnPoint;
    const spawnVector = new THREE.Vector3(spawn[0], spawn[1], spawn[2]);
    playerRef.current.setTranslation(
      { x: spawnVector.x, y: spawnVector.y, z: spawnVector.z },
      true
    );
    meshRef.current.position.copy(spawnVector);
  }, [currentLevel.id]);

  useFrame(() => {
    if (!playerRef.current || !meshRef.current || !bodyRef.current) return;

    const playerHealth = usePlayerStore.getState().health;

    // Vérifier si le joueur est mort
    if (playerHealth <= 0) {
      setAnimationState('idle');
      return;
    }

    const movement = inputManager.getMovementVector();
    const isMoving = movement.length() > 0;

    setIsMoving(isMoving);

    // Déterminer l'état d'animation
    if (inputManager.isMouseButtonPressed(0)) {
      setAnimationState('attack');
    } else if (isMoving) {
      setAnimationState('walk');
    } else {
      setAnimationState('idle');
    }

    // Animation de marche (bob)
    if (isMoving && bodyRef.current) {
      const bobSpeed = 8;
      const bobAmount = 0.1;
      const bobY = Math.sin(Date.now() * 0.01 * bobSpeed) * bobAmount;
      bodyRef.current.position.y = bobY;
    } else if (bodyRef.current) {
      bodyRef.current.position.y = 0;
    }

    // Appliquer mouvement via physique
    if (isMoving) {
      const currentVel = playerRef.current.linvel();
      const newVel = new THREE.Vector3(
        movement.x * speed,
        currentVel.y,
        movement.z * speed
      );
      playerRef.current.setLinvel(newVel, true);

      // Rotation vers la direction de mouvement
      const angle = Math.atan2(movement.x, movement.z);
      setRotation(angle);

      // Rotation visuelle du mesh
      if (meshRef.current) {
        meshRef.current.rotation.y = angle;
      }
    } else {
      // Arrêter le mouvement horizontal
      const currentVel = playerRef.current.linvel();
      const stopVel = new THREE.Vector3(0, currentVel.y, 0);
      playerRef.current.setLinvel(stopVel, true);
    }

    // Attaque au clic (avec cooldown)
    const attackCooldown = 500;
    if (inputManager.isMouseButtonPressed(0)) {
      const currentTime = Date.now();
      if (currentTime - lastAttackTimeRef.current >= attackCooldown) {
        const playerPos = new THREE.Vector3(
          playerRef.current.translation().x,
          playerRef.current.translation().y,
          playerRef.current.translation().z
        );
        const attackRange = 2.5;

        // Animation d'attaque améliorée style Diablo IV
        if (weaponRef.current) {
          // Animation de frappe plus dramatique avec effet de particules
          weaponRef.current.rotation.x = Math.PI / 3;
          weaponRef.current.position.y += 0.2;

          window.setTimeout(() => {
            if (weaponRef.current) {
              weaponRef.current.rotation.x = 0;
              weaponRef.current.position.y -= 0.2;
            }
          }, 250);
        }

        // Vérifier les ennemis à portée
        const enemies = Array.from(useGameStore.getState().enemies.values());
        enemies.forEach((enemy) => {
          if (enemy.hp > 0 && playerPos.distanceTo(enemy.position) <= attackRange) {
            const baseAttack = 15;
            const weaponBonus = equippedWeapon?.stats?.attack || 0;
            const totalAttack = baseAttack + weaponBonus;

            const result = combatSystem.calculateDamage(
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
            const newHp = Math.max(0, enemy.hp - result.damage);
            useGameStore.getState().updateEnemy(enemy.id, { hp: newHp });

            // Afficher le nombre de dégâts
            showDamageNumber(result.damage, enemy.position, result.isCritical);

            if (newHp <= 0) {
              console.log(`Enemy ${enemy.id} vaincu!`);
              // TODO: Mettre à jour la progression des quêtes
              // questSystem.onEnemyKilled();
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

  // Couleurs plus visibles tout en conservant le style Diablo
  const armorColor = equippedArmor?.color || '#6b5a4a';
  const weaponColor = equippedWeapon?.color || '#9b6a4a';
  const bodyColor = '#5a4a3a';

  return (
    <RigidBody
      ref={playerRef}
      colliders={false}
      lockRotations
      type="dynamic"
      position={[0, 1, 0]}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <group ref={meshRef}>
        {/* Corps du joueur - style guerrier sombre */}
        <mesh ref={bodyRef} castShadow position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
          <meshStandardMaterial
            color={bodyColor}
            metalness={0.3}
            roughness={0.7}
            emissive={bodyColor}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Éclairage local autour du joueur */}
        <pointLight position={[0, 1, 0]} intensity={1.5} color="#ffffff" distance={8} decay={2} />

        {/* Tête */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#aa9272"
            roughness={0.7}
            emissive="#8b7355"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Casque/Armure de tête */}
        <mesh castShadow position={[0, 1.4, 0]}>
          <torusGeometry args={[0.35, 0.05, 8, 16]} />
          <meshStandardMaterial
            color="#4a4a4a"
            metalness={0.5}
            roughness={0.6}
            emissive="#3a3a3a"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Bras gauche */}
        <mesh castShadow position={[-0.5, 0.8, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
          <meshStandardMaterial
            color={armorColor}
            metalness={0.3}
            roughness={0.7}
            emissive={armorColor}
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Bras droit avec arme */}
        <group ref={weaponRef} position={[0.5, 0.8, 0]} rotation={[0, 0, -0.3]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
            <meshStandardMaterial
              color={armorColor}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          {/* Arme - épée sombre */}
          {equippedWeapon && (
            <>
              <mesh castShadow position={[0, 0.5, 0]}>
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshStandardMaterial
                  color={weaponColor}
                  metalness={0.6}
                  roughness={0.4}
                  emissive="#1a1a1a"
                  emissiveIntensity={0.1}
                />
              </mesh>
              {/* Lame */}
              <mesh castShadow position={[0, 0.9, 0]}>
                <boxGeometry args={[0.05, 0.3, 0.02]} />
                <meshStandardMaterial
                  color="#c0c0c0"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </>
          )}
        </group>

        {/* Jambes */}
        <mesh castShadow position={[-0.2, -0.2, 0]}>
          <capsuleGeometry args={[0.15, 0.5, 8, 8]} />
          <meshStandardMaterial
            color={armorColor}
            metalness={0.3}
            roughness={0.7}
            emissive={armorColor}
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh castShadow position={[0.2, -0.2, 0]}>
          <capsuleGeometry args={[0.15, 0.5, 8, 8]} />
          <meshStandardMaterial
            color={armorColor}
            metalness={0.3}
            roughness={0.7}
            emissive={armorColor}
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Aura sombre du joueur */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial
            color="#4a3728"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}
