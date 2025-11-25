import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { EnemyData, EnemyAI, EnemyState } from '@/game/entities/Enemy';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import { HealthBar } from '@/components/ui/HealthBar';

interface EnemyProps {
  enemy: EnemyData;
}

export function Enemy({ enemy }: EnemyProps) {
  const enemyRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const aiRef = useRef<EnemyAI | null>(null);
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
    if (!enemyRef.current || !meshRef.current || !aiRef.current) return;

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
      // Mettre à jour l'IA avec le joueur actuel
      aiRef.current.updatePlayer(playerEntity);
      aiRef.current.update(delta);

      // Vérifier si l'ennemi attaque le joueur
      const attackResult = aiRef.current.getAttackResult();
      if (attackResult && attackResult.damage > 0) {
        usePlayerStore.getState().takeDamage(attackResult.damage);
        console.log(`Enemy ${enemy.id} inflige ${attackResult.damage} dégâts au joueur!`);
      }
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
  });

  // Couleur selon le type d'ennemi
  const getEnemyColor = (): string => {
    if (enemy.hp <= 0) return '#666666';
    if (enemy.speed >= 3) return '#f59e0b'; // Fast - orange
    if (enemy.maxHp >= 80) return '#8b5cf6'; // Tank - violet
    return '#ef4444'; // Basic - rouge
  };

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
        <mesh ref={meshRef} castShadow>
          <capsuleGeometry args={[0.4, 0.8]} />
          <meshStandardMaterial color={getEnemyColor()} />
        </mesh>
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

