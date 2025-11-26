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
import { Labubu } from './Labubu';
import { questSystem } from '@/game/systems/QuestSystem';
import { useQuestStore } from '@/stores/questStore';

const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();

export function Player() {
  const playerRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
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
    const isMoving = movement.lengthSq() > 0;

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
      tempVecA.set(movement.x * speed, currentVel.y, movement.z * speed);
      playerRef.current.setLinvel(tempVecA, true);

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
      tempVecA.set(0, currentVel.y, 0);
      playerRef.current.setLinvel(tempVecA, true);
    }

    // Attaque au clic (avec cooldown)
    const attackCooldown = 500;
    if (inputManager.isMouseButtonPressed(0)) {
      const currentTime = Date.now();
      if (currentTime - lastAttackTimeRef.current >= attackCooldown) {
        const translation = playerRef.current.translation();
        tempVecB.set(translation.x, translation.y, translation.z);
        const playerPos = tempVecB;
        const attackRange = 2.5;

        // Animation d'attaque améliorée style Diablo IV
        if (bodyRef.current) {
          bodyRef.current.rotation.z = 0.25;
          window.setTimeout(() => {
            if (bodyRef.current) {
              bodyRef.current.rotation.z = 0;
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
              questSystem.onEnemyKilled();
              // Rafraîchir l'UI des quêtes
              useQuestStore.getState().refreshQuests();
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
      position={[0, 1, 0]}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <group ref={meshRef}>
        <group ref={bodyRef}>
          <Labubu position={[0, -0.5, 0]} rotation={[0, 0, 0]} scale={2.4} />
        </group>
        <pointLight position={[0, 1, 0]} intensity={1.5} color="#ffffff" distance={6} decay={2} />
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="#4a3728" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </RigidBody>
  );
}

