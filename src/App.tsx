import { World } from './components/game/World';
import { HUD } from './components/ui/HUD';
import { CombatUI } from './components/ui/CombatUI';
import { CreatureTeamPanel } from './components/ui/CreatureTeam';
import { Inventory } from './components/ui/Inventory';

function App() {
  return (
    <div className="w-screen h-screen">
      <World />
      <HUD />
      <CombatUI />
      <CreatureTeamPanel />
      <Inventory />
    </div>
  );
}

export default App;

