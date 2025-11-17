public class game {
    public static void main(String[] args) {
        // Tanks (use your Tanks factory or constructors)
        tank tUser = new tank("Tiny Terror", 100, 3, 60, 100, 100);
        tank tCpu  = new tank("Big Bertha", 140, 5, 50, 120, 140);

        player user = new player("You", tUser);
        player cpuP = new player("CPU", tCpu);

        shot basic = new shot("Basic", 30, 0.0, 0);

        controller userCtl = new humanController(basic); // replace with real UI later
        controller cpuCtl  = new cpuController(basic);

        scoreboard scb = new scoreboard();

        gameManager gm = new gameManager(user, cpuP, userCtl, cpuCtl, scb, /*maxRounds*/4);
        gm.start();
    }
}
