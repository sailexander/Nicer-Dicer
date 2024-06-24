const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');

let number = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-buttons')
        .setDescription('test button interaction')
    ,
    async execute(interaction) {
        const plus = new ButtonBuilder()
            .setCustomId('plus')
            .setLabel('increase value')
            .setStyle(ButtonStyle.Primary);

        const minus = new ButtonBuilder()
            .setCustomId('minus')
            .setLabel('decrease value')
            .setStyle(ButtonStyle.Primary);

        const reset = new ButtonBuilder()
            .setCustomId('reset')
            .setLabel('reset value')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(plus, minus, reset);

        const response = await interaction.reply({
            content: `current value: ${number}`,
            components: [row],
        });

        const collector = response.createMessageComponentCollector({});

        collector.on('collect', async i => {
            console.log(i.customId);

            if (i.customId === 'plus') {
                number += 1;
            } else if (i.customId === 'minus') {
                number -= 1;
            } else if (i.customId === 'reset') {
                number = 0;
            }

            await i.update(`current value: ${number}`)
        });
    }
}