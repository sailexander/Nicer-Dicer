const { createCanvas } = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const diceShapes = require('./diceShapes.js');

const DICE_SIZE = 50;
const MARGIN = 10;
const COLOR_BACKGROUND = 'black';
const COLOR_DICE = 'white';
const COLOR_CRIT = '#60c39f';
const COLOR_FAIL = '#fd7175';

module.exports = { rollRender }

async function rollRender(diceRoll) {
    const canvasWidth = diceRoll.diceAmount * (DICE_SIZE + MARGIN) + MARGIN + (diceRoll.bonusValue > 0 ? DICE_SIZE + MARGIN : 0);
    const canvasHeight = 2 * DICE_SIZE + 3 * MARGIN;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    //fill background
    context.fillStyle = COLOR_BACKGROUND;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i in diceRoll.rolls) {
        renderDice(
            context,
            diceShapes[diceRoll.diceType] ?? diceShapes['W10'],
            diceRoll.rolls[i],
            MARGIN + i * (DICE_SIZE + MARGIN),
            MARGIN,
            getDiceColor(diceRoll.rolls[i], parseInt(diceRoll.diceType.substring(1)))
        );
    }

    if (diceRoll.bonusValue > 0) {
        renderBonusValue(
            context,
            diceRoll.bonusValue,
            MARGIN + diceRoll.diceAmount * (DICE_SIZE + MARGIN),
            MARGIN
        );
    }

    renderTotal(
        context,
        diceRoll.total,
        canvasWidth,
        DICE_SIZE + 2 * MARGIN
    );

    return new AttachmentBuilder(await canvas.encode('png'), { name: 'roll.png' });
}

function getDiceColor(number, max) {
    if (number === 1) return COLOR_FAIL;
    if (number === max) return COLOR_CRIT;
    return COLOR_DICE;
}

async function renderDice(context, shape, number, x, y, color = COLOR_DICE) {
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = color;
    context.translate(x, y);

    shape.forEach((path) => context.fill(path));

    context.fillStyle = color;
    context.font = '20px DejaVu Sans';
    let textMeasure = context.measureText(number.toString());
    context.fillText(number.toString(), 25 - (textMeasure.width / 2), 33);

    /* context.strokeStyle = 'red';
    context.strokeRect(0, 0, 50, 50);
    context.strokeRect(0, 0, 25, 25);
    context.strokeRect(25, 25, 25, 25); */
}

async function renderBonusValue(context, number, x, y) {
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = COLOR_DICE;
    context.translate(x, y);

    context.font = '20px DejaVu Sans';
    let textMeasure = context.measureText(`+ ${number.toString()}`);
    context.fillText(`+ ${number.toString()}`, 25 - (textMeasure.width / 2), 33);

    /* context.strokeStyle = 'red';
    context.strokeRect(0, 0, 50, 50);
    context.strokeRect(0, 0, 25, 25);
    context.strokeRect(25, 25, 25, 25); */
}

async function renderTotal(context, number, canvasWidth, y) {
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = COLOR_DICE;
    context.translate(0, y);

    context.font = '40px DejaVu Sans';
    let textMeasure = context.measureText(number.toString());
    context.fillText(number.toString(), canvasWidth / 2 - (textMeasure.width / 2), 33);
}