import { Tank } from "./tank.js";
import { TurnManager } from "./turnManager.js";
import { shoot, heal } from "./combat.js";

const tank1 = new Tank("player1", 0, 0, "red", 20, 20, 20, "basic");
const tank2 = new Tank("player2", 0, 0, "blue", 20, 20, 20, "basic");

TurnManager.registerPlayers(
    "player1",
    "player2",
    {
        "player1": tank1,
        "player2": tank2
    }
);


TurnManager.executeAction(
    "player1",
    shoot,
    tank1, tank2
);

// Player 2 heals
TurnManager.executeAction(
    "player2",
    heal,
    tank2,
    5
);

// Player 1 shoots again
TurnManager.executeAction(
    "player1",
    shoot,
    tank1, tank2
);

console.log('Final HP of Tank 2:', tank2.hp);