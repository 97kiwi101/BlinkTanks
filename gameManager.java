public class gameManager {
    private final player user;
    private final player cpu;
    private final controller user_control;
    private final controller cpu_control;
    private final scoreboard scb;

    private final int maxRounds;   // e.g., 4
    private player current;        // whose turn
    private int turnCount = 0;     // every 2 turns -> +1 round

    public gameManager(player user,
                       player cpu,
                       controller user_control,
                       controller cpu_control,
                       scoreboard scb,
                       int maxRounds) {
        this.user = user;
        this.cpu = cpu;
        this.user_control = user_control;
        this.cpu_control = cpu_control;
        this.scb = scb;
        this.maxRounds = Math.max(1, maxRounds);
        this.current = user; // user starts
        scb.update(current, getRound(), true);
    }

    public void start() {
        while (!isGameOver()) {
            playTurn();
            swapTurn();
        }
        endSummary();
    }

    // --- core ---

    private void playTurn() {
        player attacker, defender;
        controller ctl;

        if (current == user) {
            attacker = user; defender = cpu; ctl = user_control;
        } else {
            attacker = cpu; defender = user; ctl = cpu_control;
        }

        System.out.println(scb.lineFor(user, cpu)); // quick status line

        // controller performs action and applies effects
        ctl.takeTurn(attacker, defender, scb);

        // refresh scoreboard hint (UI may redraw here)
        scb.update(current, getRound(), false);
    }

    private void swapTurn() {
        current = (current == user) ? cpu : user;
        turnCount++;
        scb.update(current, getRound(), true);
    }

    private boolean isGameOver() {
        if (!user.getTank().isAlive() || !cpu.getTank().isAlive()) return true;
        return getRound() > maxRounds;
    }

    private int getRound() {
        return 1 + (turnCount / 2);
    }

    private void endSummary() {
        System.out.printf("Final: %s HP=%d, %s HP=%d%n",
                user.getName(), user.getTank().getHealth(),
                cpu.getName(), cpu.getTank().getHealth());
    }
}
