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

function rollOne(max) {
    const result =  Math.floor(Math.random() * max + 1);
    console.log('rolled ' + result + ' out of ' + max);
    return result;
}

function parseInput(input) {
    input = input || 'W100';
    console.log('parsing ' + input);
    const match = input.match(DICE_PATTERN);
    if (!match) {
        throw new Error("Invalid pattern")
    }

    console.log(match);

    const diceAmount = parseInt(match[1]) || 1;
    const diceType = parseInt(match[2]);
    const bonusValue = parseInt(match[3]) || 0;

    let total = 0;
    let result = '';
    for (let i=0; i< diceAmount; i++) {
        let roll = rollOne(diceType);
        total += roll;
        result += ' ' + roll;
    }

    total += bonusValue;
    result = input + ' =>' + result + ' +' + bonusValue + ' => ' + total;

    console.log('total result ' + result);
    return result;
}