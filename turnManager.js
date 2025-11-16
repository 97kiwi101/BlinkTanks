export const TurnManager = {
    players: ["player1", "player2"],
    currentIndex: 0,


    // Who's turn is it
    get currentPlayer() {
        return this.players[this.currentIndex];
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