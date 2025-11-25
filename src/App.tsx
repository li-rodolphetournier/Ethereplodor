import { World } from './components/game/World';
import { HUD } from './components/ui/HUD';
import { CombatUI } from './components/ui/CombatUI';
import { CreatureTeamPanel } from './components/ui/CreatureTeam';
import { Inventory } from './components/ui/Inventory';
import { Shop } from './components/ui/Shop';
import { NotificationContainer } from './components/ui/Notification';
import { useItemEffects } from './hooks/useItemEffects';

function App() {
  useItemEffects(); // Gérer les effets des items consommables

  return (
    <div className="w-screen h-screen">
      <World />
      <HUD />
      <CombatUI />
      <CreatureTeamPanel />
      <Inventory />
      <Shop />
      <NotificationContainer />
    </div>
  );
}

export default App;

