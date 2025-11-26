import { useEffect } from 'react';
import { World } from './components/game/World';
import { HUD } from './components/ui/HUD';
import { CombatUI } from './components/ui/CombatUI';
import { CreatureTeamPanel } from './components/ui/CreatureTeam';
import { Inventory } from './components/ui/Inventory';
import { Shop } from './components/ui/Shop';
import { SaveLoadMenu } from './components/ui/SaveLoadMenu';
import { MiniMap } from './components/ui/MiniMap';
import { ProgressionPanel } from './components/ui/ProgressionPanel';
import { QuestPanel } from './components/ui/QuestPanel';
import { NotificationContainer } from './components/ui/Notification';
import { PerfPanel } from './components/ui/PerfPanel';
import { useItemEffects } from './hooks/useItemEffects';
import { useGameSave } from './hooks/useGameSave';
import { showNotification } from './components/ui/Notification';

function App() {
  useItemEffects(); // Gérer les effets des items consommables
  const { saveGame } = useGameSave();

  // Sauvegarder avec F5
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        saveGame();
        showNotification('💾 Jeu sauvegardé', 'success');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [saveGame]);

  return (
    <div className="w-screen h-screen">
      <World />
      <HUD />
      <CombatUI />
      <CreatureTeamPanel />
      <Inventory />
      <Shop />
      <SaveLoadMenu />
      <MiniMap />
      <ProgressionPanel />
      <QuestPanel />
      <NotificationContainer />
      <PerfPanel />
    </div>
  );
}

export default App;

