export const TurnManager = {
    players: [],
    tanks: {},

    currentIndex: 0,


    // Who's turn is it
    get currentPlayer() {
        return this.players[this.currentIndex];
    },

    registerPlayers(player1, player2, tankMap) {
        this.players = [player1, player2];
        this.tanks = tankMap;
    
    },

    executeAction(playerName, actionFunction, ...args) {
        if (playerName !== this.currentPlayer) {
            return;
        }

        actionFunction(...args);
        this.nextTurn();
    },

    // Switch to next player's turn
    nextTurn() {
        this.currentIndex = (this.currentIndex + 1) % this.players.length;
        console.log("Turn switched to:", this.currentPlayer);
    },

    // Prevent inputs when not your turn
    isTurn(playerName) {
        return this.currentPlayer === playerName;
    }
};