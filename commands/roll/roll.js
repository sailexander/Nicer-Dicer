const { SlashCommandBuilder } = require('discord.js');

//const DICE_PATTERN = /^[1-9]?(w|W)(4|6|8|10|20|100)(\+\d{1,3})?$/;
const DICE_PATTERN = /^(\d+)?W(\d+)(\+\d+)?$/;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice')
        .addStringOption(option =>
            option
                .setName('pattern')
                .setDescription('Bsp. W6, 2w10, 3W6+5')
        )
    ,
    async execute(interaction) {
        let input = interaction.options.getString('pattern');

        try {
            await interaction.reply(parseInput(input));
        } catch (error) {
            console.log(error.message);
            await interaction.reply(error.message);
        }
    },
};

function roll(max) {
    const result =  Math.floor(Math.random() * max + 1);
    console.log('rolled ' + result + ' out of ' + max);
    return result;
}

function parseInput(input) {
    const match = input.match(DICE_PATTERN);
    console.log(match);

    if (!match) {
        throw new Error("Invalid pattern")
    }

    const diceAmount = parseInt(match[1]) || 1;
    const diceType = parseInt(match[2]);
    const bonusValue = parseInt(match[3]) || 0;

    let total = 0;
    for (let i=0; i< diceAmount; i++) {
        total += roll(diceType);
    }

    total += bonusValue;

    console.log('total result ' + total);
    return total.toString();
}