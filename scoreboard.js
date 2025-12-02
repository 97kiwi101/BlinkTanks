export const scoreboard = {
    scores: JSON.parse(localStorage.getItem("tankScores")) || {
        player: 0,
        ai: 0
    },

    save() {
        localStorage.setItem("tankScores", JSON.stringify(this.scores));
    },

    getScores() {
        return this.scores;
    },

    addPlayerWin() {
        this.scores.player += 1;
        this.save();
    },

    addAIWin() {
        this.scores.ai += 1;
        this.save();
    }
};