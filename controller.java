public interface controller {
    /**
     * Perform this side's turn (fire/move/skip). Apply effects directly
     * (e.g., opponent.getTank().takeDamage(...)).
     */
    void takeTurn(player me, player opponent, scoreboard scb);
}
