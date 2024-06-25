const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder, userMention, MembershipScreeningFieldType } = require('discord.js');
const { rollRender } = require('./utility/rollRender.js');
const DiceRoll = require('./utility/diceRoll.js');

const DICE_PATTERN = /^(\d+)?W(\d+)(\+\d+)?$/;
const DICE_TYPE = {
    W4: 'W4',
    W6: 'W6',
    W8: 'W8',
    W10: 'W10',
    W12: 'W12',
    W20: 'W20',
    W100: 'W100',
}

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
        console.log(`>> ${interaction.member.guild.name}|${interaction.user.globalName} used /${interaction.commandName}`);
        let input = interaction.options.getString('pattern');
        
        try {
            if (input) {
                console.log(`rolling by pattern ${input}`);
                let result = rollByPattern(input);
                console.log(`Roll result: ${result}`)
                await interaction.reply(`${input} => ${result}`);
            } else {
                console.log('rolling by interaction');
                await rollByInteraction(interaction);
            }
        } catch (error) {
            console.error(error.message);
            await interaction.reply({
                content: `ERROR: ${error.message}`,
                ephemeral: true,
            });
        }
    },
};

function rollByPattern(input) {
    input = input.toUpperCase();
    const match = input.match(DICE_PATTERN);
    if (!match) {
        throw new Error("Invalid pattern")
    }
    const diceAmount = parseInt(match[1]) || 1;
    const diceType = 'W' + parseInt(match[2]);
    const bonusValue = parseInt(match[3]) || 0;

    let diceRoll = new DiceRoll(diceType, diceAmount, bonusValue);

    return diceRoll.toString();
}

async function rollByInteraction(interaction) {
    let currentDiceType = null;
    let currentDiceAmount = 0;
    let currentBonusValue = 0;

    const interactiveReply = await interaction.reply({
        content: 'choose dice to roll',
        components: getActionRows(currentDiceType),
        ephemeral: true
    });

    const collector = interactiveReply.createMessageComponentCollector({});

    collector.on('collect', async buttonInteraction => {
        let [buttonType, buttonId] = buttonInteraction.customId.split('_');
        console.log(`>> ${interaction.member.guild.name}|${interaction.user.globalName} pressed ${buttonType} ${buttonId}`);

        switch (buttonType) {
            case 'dice':

                if (currentDiceType === null) {
                    currentDiceType = buttonId;
                    currentDiceAmount = 1;
                } else if (currentDiceType === buttonId) {
                    currentDiceAmount += 1;
                }
                break;

            case 'bonus':

                switch (buttonId) {
                    case 'reset':
                        currentBonusValue = 0;
                        break;
                    case 'one':
                        currentBonusValue += 1;
                        break;
                    case 'five':
                        currentBonusValue += 5;
                        break;
                }
                break;

            case 'action':

                switch (buttonId) {
                    case 'roll':
                        let diceRoll = new DiceRoll(currentDiceType, currentDiceAmount, currentBonusValue);
                        console.log(`Roll result: ${diceRoll.toString()}`)
                        interaction.followUp({
                            content: `${diceRoll.getPattern()} => ${diceRoll.toString()}`,
                            files: [await rollRender(diceRoll)],
                        });
                        break;
                    case 'reset':
                        currentDiceType = null;
                        currentDiceAmount = 0;
                        currentBonusValue = 0;
                        break;
                }
                break;
        }

        await buttonInteraction.update({
            content: currentDiceType ? `current roll: ${currentDiceAmount} ${currentDiceType} +${currentBonusValue}` : 'choose dice to roll',
            components: getActionRows(currentDiceType),
        });
    });
}

function getActionRows(currentDiceType) {
    //dice buttons
    const buttonW4 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W4}`)
        .setLabel(DICE_TYPE.W4)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W4);

    const buttonW6 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W6}`)
        .setLabel(DICE_TYPE.W6)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W6);

    const buttonW8 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W8}`)
        .setLabel(DICE_TYPE.W8)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W8);

    const buttonW10 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W10}`)
        .setLabel(DICE_TYPE.W10)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W10);

    const buttonW12 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W12}`)
        .setLabel(DICE_TYPE.W12)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W12);

    const buttonW20 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W20}`)
        .setLabel(DICE_TYPE.W20)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W20);

    const buttonW100 = new ButtonBuilder()
        .setCustomId(`dice_${DICE_TYPE.W100}`)
        .setLabel(DICE_TYPE.W100)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentDiceType !== null && currentDiceType !== DICE_TYPE.W100);

    //bonus value buttons
    const buttonResetValue = new ButtonBuilder()
        .setCustomId('bonus_reset')
        .setLabel('+ 0')
        .setStyle(ButtonStyle.Secondary);

    const buttonAddOne = new ButtonBuilder()
        .setCustomId('bonus_one')
        .setLabel('+ 1')
        .setStyle(ButtonStyle.Secondary);

    const buttonAddFive = new ButtonBuilder()
        .setCustomId('bonus_five')
        .setLabel('+ 5')
        .setStyle(ButtonStyle.Secondary);

    //action buttons
    const buttonRoll = new ButtonBuilder()
        .setCustomId('action_roll')
        .setLabel('🎲')
        .setStyle(ButtonStyle.Success)
        .setDisabled(currentDiceType === null);

    const buttonReset = new ButtonBuilder()
        .setCustomId('action_reset')
        .setLabel('❌')
        .setStyle(ButtonStyle.Success)
        .setDisabled(currentDiceType === null);

    const row1 = new ActionRowBuilder()
        .addComponents(buttonW4, buttonW6, buttonW8, buttonW10, buttonW12);

    const row2 = new ActionRowBuilder()
        .addComponents(buttonW20, buttonW100, buttonResetValue, buttonAddOne, buttonAddFive);

    const row3 = new ActionRowBuilder()
        .addComponents(buttonRoll, buttonReset);

    return [row1, row2, row3];
}