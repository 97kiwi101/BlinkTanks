public class scoreboard {
    private player current;   // whose turn
    private int round;        // 1..N
    private boolean canFire;  // UI hint

    public scoreboard() {
        this.round = 1;
        this.canFire = true;
    }

    // quick updater the game manager will call
    public void update(player current, int round, boolean canFire) {
        this.current = current;
        this.round = Math.max(1, round);
        this.canFire = canFire;
    }

    // getters the canvas/renderer can pull
    public player getCurrent() { 
        return current; 
    }

    public int getRound(){
         return round; 
        }

    public boolean canFire() {
         return canFire; 
        }

    // optional: convenience for a console print
    public String lineFor(player p1, player p2) {
        return String.format(
            "R%d | Turn: %s | %s %d/%d  vs  %s %d/%d",
            round,
            current != null ? current.getName() : "-",
            p1.getName(), p1.getTank().getHealth(), p1.getTank().getMaxHealth(),
            p2.getName(), p2.getTank().getHealth(), p2.getTank().getMaxHealth()
        );
    }
}

