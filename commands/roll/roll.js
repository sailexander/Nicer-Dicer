const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice'),
    async execute(interaction) {
        await interaction.reply('crot');
    },
};