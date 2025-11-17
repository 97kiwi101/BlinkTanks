public class player {
    private final String name;
    private final tank tank;
    private int wins;

    public player(String name, tank tank) { this.name = name; this.tank = tank; }

    public String getName() { 
        return name; }

    public tank getTank() { 
        return tank; }

    public int getWins() { 
        return wins; }

    public void addWin() {
         wins++; }
}
