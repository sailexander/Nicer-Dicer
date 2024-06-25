module.exports = class DiceRoll {
    constructor(diceType, diceAmount, bonusValue = 0) {
        this.diceType = diceType;
        this.diceMax = parseInt(this.diceType.substring(1));
        this.diceAmount = diceAmount;
        this.bonusValue = bonusValue;
        this.#evaluate();
    }

    #roll(max) {
        const result = Math.floor(Math.random() * max + 1);
        console.log('rolled ' + result + ' out of ' + max);
        return result;
    }

    #evaluate() {
        this.rolls = [];
        this.total = 0;
        for (let i = 0; i < this.diceAmount; i++) {
            let roll = this.#roll(this.diceMax);
            this.rolls.push(roll);
            this.total += roll;
        }
        this.total += this.bonusValue;
    }

    toString() {
        let rolls = `${this.rolls.join(' ')}`;
        let bonus = this.bonusValue > 0 ? ` +${this.bonusValue}` : '';
        return `${rolls}${bonus} => ${this.total}`;
    }

    getPattern() {
        return `${this.diceAmount}${this.diceType}` + (this.bonusValue > 0 ? `+${this.bonusValue}` : '');
    }
}