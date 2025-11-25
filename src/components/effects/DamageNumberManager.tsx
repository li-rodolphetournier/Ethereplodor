import { useState, useEffect } from 'react';
import { DamageNumber } from './DamageNumber';
import * as THREE from 'three';

interface DamageInfo {
  id: string;
  damage: number;
  position: [number, number, number];
  isCritical: boolean;
}

export function DamageNumberManager() {
  const [damageNumbers, setDamageNumbers] = useState<DamageInfo[]>([]);

  useEffect(() => {
    // Écouter les événements de dégâts
    const handleDamage = (event: CustomEvent<DamageInfo>) => {
      const damageInfo: DamageInfo = {
        id: `damage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...event.detail,
      };
      setDamageNumbers((prev) => [...prev, damageInfo]);
    };

    window.addEventListener('damage-dealt', handleDamage as EventListener);
    return () => {
      window.removeEventListener('damage-dealt', handleDamage as EventListener);
    };
  }, []);

  const removeDamageNumber = (id: string) => {
    setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <>
      {damageNumbers.map((damageInfo) => (
        <DamageNumber
          key={damageInfo.id}
          damage={damageInfo.damage}
          position={damageInfo.position}
          isCritical={damageInfo.isCritical}
          onComplete={() => removeDamageNumber(damageInfo.id)}
        />
      ))}
    </>
  );
}

// Helper pour déclencher un nombre de dégâts
export function showDamageNumber(
  damage: number,
  position: THREE.Vector3,
  isCritical: boolean = false
): void {
  const event = new CustomEvent('damage-dealt', {
    detail: {
      damage,
      position: [position.x, position.y, position.z] as [number, number, number],
      isCritical,
    },
  });
  window.dispatchEvent(event);
}

