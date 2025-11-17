public class humanController implements controller {
    private final shot defaultShot;

    public humanController(shot defaultShot) { this.defaultShot = defaultShot; }

    @Override
    public void takeTurn(player me, player opponent, scoreboard scb) {
        // TODO: replace with UI inputs (angle/aim/move). For now: always fire.
        int raw = defaultShot.damageFrom(me.getTank());
        int dmg = Math.max(0, raw - opponent.getTank().getArmor());
        opponent.getTank().takeDamage(dmg);
        System.out.printf("%s fired: %s took %d dmg%n",
                me.getName(), opponent.getName(), dmg);
    }
}

