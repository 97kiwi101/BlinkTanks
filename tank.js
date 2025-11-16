export class Tank {
    constructor(id, x, y, color, width, height, hp, ammotype) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;

        // Combat stats
        this.maxHP = hp;
        this.hp = hp;
        this.ammo = ammotype;      
        if (this.ammo === "basic"){
            this.damage = 3;
        }
        

        this.isAlive = true;
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
        }
    }

    switchAmmo(newammo) {
        this.ammo = newammo;
        if (this.newammo === 'basic') {
            this.damage = 3;
        }
    }

    heal(amount) {
        this.hp += amount;
        if ((this.hp + amount >= this.maxHP)) {
            this.hp = this.maxHP;
        }
    }

    getID() {
        return this.id;
    }

    getColor() {
        return this.color;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getHP() {
        return this.hp;
    }

    getMaxHP() {
        return this.maxHP;
    }

    getCurrentAmmo() {
        return this.ammo;
    }
    
}