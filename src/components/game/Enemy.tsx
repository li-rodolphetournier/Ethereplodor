import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { EnemyData, EnemyAI, EnemyState } from '@/game/entities/Enemy';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import { HealthBar } from '@/components/ui/HealthBar';
import { showDamageNumber } from '@/components/effects/DamageNumberManager';

interface EnemyProps {
  enemy: EnemyData;
}

export function Enemy({ enemy }: EnemyProps) {
  const enemyRef = useRef<any>(null);
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const aiRef = useRef<EnemyAI | null>(null);
  const timeRef = useRef(0);
  const updateEnemy = useGameStore((state) => state.updateEnemy);
  const removeEnemy = useGameStore((state) => state.removeEnemy);
  const playerHealth = usePlayerStore((state) => state.health);
  const playerMaxHealth = usePlayerStore((state) => state.maxHealth);
  const playerPosition = usePlayerStore((state) => state.position);

  // Initialiser l'IA
  useEffect(() => {
    const playerEntity = {
      id: 'player',
      position: playerPosition,
      hp: playerHealth,
      maxHp: playerMaxHealth,
      attack: 15,
      defense: 5,
    };
    aiRef.current = new EnemyAI(enemy, playerEntity);
  }, [enemy.id, playerPosition, playerHealth, playerMaxHealth]);

  useFrame((_state, delta) => {
    if (!enemyRef.current || !meshRef.current || !bodyRef.current || !aiRef.current) return;

    timeRef.current += delta;

    if (enemy.state === EnemyState.DEAD || enemy.hp <= 0) {
      // Animation de mort
      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 2;
        meshRef.current.position.y -= delta * 2;
        if (meshRef.current.position.y < -5) {
          removeEnemy(enemy.id);
        }
      }
      return;
    }

    // Animation de respiration
    const breatheAmount = 0.05;
    const breatheSpeed = 3;
    bodyRef.current.scale.y = 1 + Math.sin(timeRef.current * breatheSpeed) * breatheAmount;

    // Mettre à jour la référence du joueur pour l'IA
    if (aiRef.current) {
      const playerEntity = {
        id: 'player',
        position: playerPosition,
        hp: playerHealth,
        maxHp: playerMaxHealth,
        attack: 15,
        defense: 5,
      };
      aiRef.current.updatePlayer(playerEntity);
      aiRef.current.update(delta);
    }

    // Synchroniser position physique avec données
    const position = enemyRef.current.translation();
    enemy.position.set(position.x, position.y, position.z);

    // Appliquer mouvement depuis l'IA
    if (enemy.state === EnemyState.CHASE || enemy.state === EnemyState.ATTACK) {
      if (playerPosition.distanceTo(enemy.position) > 0.1) {
        const direction = playerPosition.clone().sub(enemy.position).normalize();
        const velocity = {
          x: direction.x * enemy.speed,
          y: enemyRef.current.linvel().y,
          z: direction.z * enemy.speed,
        };
        enemyRef.current.setLinvel(velocity);

        // Rotation vers le joueur
        const angle = Math.atan2(direction.x, direction.z);
        if (meshRef.current) {
          meshRef.current.rotation.y = angle;
        }
      }
    } else if (enemy.state === EnemyState.PATROL && enemy.patrolTarget) {
      const direction = enemy.patrolTarget.clone().sub(enemy.position).normalize();
      const velocity = {
        x: direction.x * enemy.speed * 0.5,
        y: enemyRef.current.linvel().y,
        z: direction.z * enemy.speed * 0.5,
      };
      enemyRef.current.setLinvel(velocity);

      const angle = Math.atan2(direction.x, direction.z);
      if (meshRef.current) {
        meshRef.current.rotation.y = angle;
      }
    }

    // Mettre à jour la position dans le store
    const currentPos = enemyRef.current.translation();
    updateEnemy(enemy.id, {
      position: new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z),
    });

    // Vérifier si l'ennemi attaque le joueur
    const attackResult = aiRef.current.getAttackResult();
    if (attackResult && attackResult.damage > 0) {
      usePlayerStore.getState().takeDamage(attackResult.damage);
      // Afficher le nombre de dégâts
      showDamageNumber(attackResult.damage, playerPosition, attackResult.isCritical);
    }
  });

  // Couleurs sombres style Diablo selon le type d'ennemi
  const getEnemyColor = (): string => {
    if (enemy.hp <= 0) return '#1a1a1a';
    if (enemy.speed >= 3) return '#8b4513'; // Fast - marron sombre
    if (enemy.maxHp >= 80) return '#4a2c2a'; // Tank - marron foncé
    return '#5a1a1a'; // Basic - rouge sombre
  };

  const enemyColor = getEnemyColor();

  return (
    <group>
      <RigidBody
        ref={enemyRef}
        colliders={false}
        lockRotations
        type="dynamic"
        position={[enemy.position.x, enemy.position.y, enemy.position.z]}
      >
        <CapsuleCollider args={[0.4, 0.4]} />
        <group ref={meshRef}>
          {/* Corps principal - sombre et menaçant */}
          <mesh ref={bodyRef} castShadow>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color={enemyColor}
              metalness={0.3}
              roughness={0.8}
              emissive="#1a0000"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Yeux rouges menaçants */}
          <mesh castShadow position={[0.2, 0.1, 0.4]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color="#8b0000"
              emissive="#ff0000"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh castShadow position={[-0.2, 0.1, 0.4]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color="#8b0000"
              emissive="#ff0000"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Cornes/épines sombres */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <coneGeometry args={[0.1, 0.3, 8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.9}
            />
          </mesh>
          <mesh castShadow position={[0.15, 0.5, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.9}
            />
          </mesh>
          <mesh castShadow position={[-0.15, 0.5, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.9}
            />
          </mesh>

          {/* Aura sombre menaçante */}
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial
              color="#1a0000"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </RigidBody>
      {enemy.hp > 0 && (
        <HealthBar
          current={enemy.hp}
          max={enemy.maxHp}
          position={[enemy.position.x, enemy.position.y + 1.5, enemy.position.z]}
        />
      )}
    </group>
  );
}
