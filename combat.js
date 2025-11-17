export function shoot(attacker, defender) {
    if (!attacker.isAlive || !defender.isAlive) return;

    defender.takeDamage(attacker.damage);

    console.log(
        `${attacker.id} shot ${defender.id} for ${attacker.damage} damage!`
    );

    if (!defender.isAlive) {
        console.log(`${defender.id} has been destroyed!`);
    }
}

export function heal(tank, amount = 5) {
    if (!tank.isAlive) return;

    tank.heal(amount);
    console.log(`${tank.id} healed for ${amount}. HP is now ${tank.hp}.`);
}