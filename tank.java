public final class tank {
    private final String name ;
    private final int maxHealth; 
    private final int armor ;
    private final int accuracy;
    private final int power ;
    private double x, y ;

    private int health;


    protected tank(String name, int maxHealth, int armor, int accuracy, int power, int health){
        this.name = name ;
        this.maxHealth = maxHealth ;
        this.armor = armor; 
        this.accuracy = accuracy ;
        this.power = power ;
        this.health = health;
    }

    public void takeDamage(int dam){
        int dam_mitigate = Math.max(0, dam - armor) ;
        health = Math.max(0, health - dam_mitigate);
        }

    public void setPosition(double x, double y){
        this.x = x ;
        this.y = y ;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }
    
    public String getName(){
        return name ;
    }

    public int getMaxHealth(){
        return maxHealth;
    }

    public int getArmor(){
        return armor;
    }

    public int getAccuracy(){
        return accuracy;
    }

    public int getPower(){
        return power;
    }

    public int getHealth(){
        return health;
    }

    public boolean isAlive() { 
        return health > 0; 
    }

    @Override
    public String toString() {
        return String.format("%s HP %d/%d | ARM %d | ACC %d | POW %d",
                name, health, maxHealth, armor, accuracy, power);
    }
}

