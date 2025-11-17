import java.util.Random;

public class cpuController implements controller {
    private final shot defaultShot;
    private final Random rng = new Random();

    public cpuController(shot defaultShot) {
        this.defaultShot = defaultShot;
    }

    @Override
    public void takeTurn(player me, player opponent, scoreboard scb) {
        // 70% fire, 30% nudge move
        if (rng.nextDouble() < 0.7) {
            int raw = defaultShot.damageFrom(me.getTank());
            int dmg = Math.max(0, raw - opponent.getTank().getArmor());
            opponent.getTank().takeDamage(dmg);
            System.out.printf("CPU fired: %s took %d dmg%n",
                    opponent.getName(), dmg);
        } else {
            double dx = rng.nextBoolean() ? +10 : -10;
            me.getTank().setPosition(me.getTank().getX() + dx, me.getTank().getY());
            System.out.printf("CPU moved %s%d%n", dx > 0 ? "+" : "", (int)dx);
        }
    }
}
