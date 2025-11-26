import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { EnemyData, EnemyAI, EnemyState } from '@/game/entities/Enemy';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import { HealthBar } from '@/components/ui/HealthBar';
import { showDamageNumber } from '@/components/effects/DamageNumberManager';
import { ParticleSystem } from '@/components/effects/ParticleSystem';

interface EnemyProps {
  enemy: EnemyData;
}

const enemyTempDir = new THREE.Vector3();
const enemyTempPos = new THREE.Vector3();

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
      // Animation de mort dramatique style Diablo IV
      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 3;
        meshRef.current.rotation.z += delta * 1.5;
        meshRef.current.position.y -= delta * 3;
        meshRef.current.scale.multiplyScalar(1 - delta * 0.5);
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
        enemyTempDir.copy(playerPosition).sub(enemy.position).normalize();
        const currentVel = enemyRef.current.linvel();
        enemyRef.current.setLinvel(
          {
            x: enemyTempDir.x * enemy.speed,
            y: currentVel.y,
            z: enemyTempDir.z * enemy.speed,
          }
        );

        // Rotation vers le joueur
        const angle = Math.atan2(enemyTempDir.x, enemyTempDir.z);
        if (meshRef.current) {
          meshRef.current.rotation.y = angle;
        }
      }
    } else if (enemy.state === EnemyState.PATROL && enemy.patrolTarget) {
      enemyTempDir.copy(enemy.patrolTarget).sub(enemy.position).normalize();
      const currentVel = enemyRef.current.linvel();
      enemyRef.current.setLinvel({
        x: enemyTempDir.x * enemy.speed * 0.5,
        y: currentVel.y,
        z: enemyTempDir.z * enemy.speed * 0.5,
      });

      const angle = Math.atan2(enemyTempDir.x, enemyTempDir.z);
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
          {/* Corps principal - plus visible */}
          <mesh ref={bodyRef} castShadow>
            <octahedronGeometry args={[0.5, 0]} />
            <meshToonMaterial
              color={enemyColor}
              emissive={enemyColor}
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Éclairage local sur l'ennemi */}
          <pointLight position={[0, 0.5, 0]} intensity={1.2} color={enemyColor} distance={7} decay={2} />

          {/* Yeux rouges menaçants */}
          <mesh castShadow position={[0.2, 0.1, 0.4]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshToonMaterial
              color="#ff0000"
              emissive="#ff4444"
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh castShadow position={[-0.2, 0.1, 0.4]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshToonMaterial
              color="#ff0000"
              emissive="#ff4444"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Cornes/épines sombres */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <coneGeometry args={[0.1, 0.3, 8]} />
            <meshToonMaterial
              color="#1a1a1a"
            />
          </mesh>
          <mesh castShadow position={[0.15, 0.5, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshToonMaterial
              color="#1a1a1a"
            />
          </mesh>
          <mesh castShadow position={[-0.15, 0.5, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshToonMaterial
              color="#1a1a1a"
            />
          </mesh>

          {/* Aura sombre menaçante avec pulsation */}
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial
              color="#1a0000"
              transparent
              opacity={0.3 + Math.sin(timeRef.current * 3) * 0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Particules d'énergie sombre */}
          {enemy.state === EnemyState.ATTACK && (
            <ParticleSystem
              position={[enemy.position.x, enemy.position.y + 0.5, enemy.position.z]}
              color="#8b0000"
              count={30}
              size={0.05}
              speed={0.3}
            />
          )}
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
