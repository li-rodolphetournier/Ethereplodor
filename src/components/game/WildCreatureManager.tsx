import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { wildCreatureSpawn } from '@/game/systems/WildCreatureSpawn';
import { Creature } from './Creature';
import { usePlayerStore } from '@/stores/playerStore';
import { useCreatureStore } from '@/stores/creatureStore';
import { captureSystem } from '@/game/systems/CaptureSystem';
import { showNotification } from '@/components/ui/Notification';
import { questSystem } from '@/game/systems/QuestSystem';

export function WildCreatureManager() {
  const playerPosition = usePlayerStore((state) => state.position);
  const captureCreature = useCreatureStore((state) => state.captureCreature);
  const isInitialized = useRef(false);

  // Initialiser les points de spawn
  useEffect(() => {
    if (!isInitialized.current) {
      wildCreatureSpawn.initializeSpawnPoints(new THREE.Vector3(0, 0, 0), 25, 6);
      isInitialized.current = true;
    }
  }, []);

  // Mettre à jour le système de spawn
  useFrame(() => {
    wildCreatureSpawn.update(playerPosition);
  });

  // Gestion de la capture
  useEffect(() => {
    const handleCapture = () => {
      const wildCreatures = wildCreatureSpawn.getWildCreatures();
      const playerPos = playerPosition;

      // Trouver la créature la plus proche
      let closestCreature: { creature: typeof wildCreatures[0]; distance: number } | null = null;

      wildCreatures.forEach((creature) => {
        const creaturePos = creature.position || new THREE.Vector3(0, 0, 0);
        const distance = playerPos.distanceTo(creaturePos);

        if (distance < 3 && (!closestCreature || distance < closestCreature.distance)) {
          closestCreature = { creature, distance };
        }
      });

      if (closestCreature) {
        const result = captureSystem.attemptCapture(closestCreature.creature, 'basic');

        if (result.success) {
          showNotification(`🎉 Capture réussie! ${closestCreature.creature.name} a été capturé!`, 'success');
          captureCreature(closestCreature.creature);
          wildCreatureSpawn.removeWildCreature(closestCreature.creature.id);
          // Mettre à jour la progression des quêtes
          questSystem.onCreatureCaptured();
        } else {
          showNotification(`❌ Capture échouée! ${closestCreature.creature.name} s'est échappé!`, 'error');
        }
      } else {
        console.log('Aucune créature sauvage à proximité');
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyC') {
        handleCapture();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, captureCreature]);

  const wildCreatures = wildCreatureSpawn.getWildCreatures();

  return (
    <>
      {wildCreatures.map((creature) => {
        const pos = creature.position || new THREE.Vector3(0, 1, 0);
        return (
          <Creature
            key={creature.id}
            creature={creature}
            position={[pos.x, pos.y, pos.z]}
            isWild={true}
          />
        );
      })}
    </>
  );
}

