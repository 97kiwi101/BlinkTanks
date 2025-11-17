public class shot {
    private final String name;
    private final int baseDamage;        // before armor
    private final double splashRadius;   // world units
    private final int accuracyMod;       // +/- to tank accuracy

    public shot(String name, int baseDamage, double splashRadius, int accuracyMod) {
        this.name = name;
        this.baseDamage = Math.max(0, baseDamage);
        this.splashRadius = Math.max(0.0, splashRadius);
        this.accuracyMod = accuracyMod;
    }

    public String getName() { return name; }
    public int getBaseDamage() { return baseDamage; }
    public double getSplashRadius() { return splashRadius; }
    public int getAccuracyMod() { return accuracyMod; }

    // helper: damage after shooter’s power
    public int damageFrom(tank shooter) {
        double scaled = baseDamage * (shooter.getPower() / 100.0);
        return (int)Math.round(scaled);
    }
}
