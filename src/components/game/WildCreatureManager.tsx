import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { wildCreatureSpawn } from '@/game/systems/WildCreatureSpawn';
import { Creature as CreatureData } from '@/game/entities/Creature';
import { Creature } from './Creature';
import { usePlayerStore } from '@/stores/playerStore';
import { useCreatureStore } from '@/stores/creatureStore';
import { captureSystem } from '@/game/systems/CaptureSystem';
import { showNotification } from '@/components/ui/Notification';
import { questSystem } from '@/game/systems/QuestSystem';
import { useQuestStore } from '@/stores/questStore';

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
      let closestCreature: CreatureData | null = null;
      let closestDistance = Infinity;

      for (const creature of wildCreatures) {
        // Ignorer les créatures sans position définie
        if (!creature.position) {
          continue;
        }
        const distance = playerPos.distanceTo(creature.position);

        if (distance < 3 && distance < closestDistance) {
          closestCreature = creature;
          closestDistance = distance;
        }
      }

      if (closestCreature) {
        const result = captureSystem.attemptCapture(closestCreature, 'basic');

        if (result.success) {
          showNotification(`🎉 Capture réussie! ${closestCreature.name} a été capturé!`, 'success');
          captureCreature(closestCreature);
          wildCreatureSpawn.removeWildCreature(closestCreature.id);
          // Mettre à jour la progression des quêtes
          questSystem.onCreatureCaptured();
          useQuestStore.getState().refreshQuests();
        } else {
          showNotification(`❌ Capture échouée! ${closestCreature.name} s'est échappé!`, 'error');
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

