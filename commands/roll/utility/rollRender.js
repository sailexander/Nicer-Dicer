const { createCanvas } = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const diceShapes = require('./diceShapes.js');

const DICE_SIZE = 50;
const MARGIN = 10;
const COLOR_BACKGROUND = 'black';
const COLOR_DICE = 'white';

module.exports = { rollRender }

async function rollRender(diceRoll) {
    const canvasWidth = diceRoll.diceAmount * (DICE_SIZE + MARGIN) + MARGIN;
    const canvasHeight = DICE_SIZE + 2 * MARGIN;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    //fill background
    context.fillStyle = COLOR_BACKGROUND;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    console.log(diceShapes);
    console.log(diceShapes['W4']);
    console.log(diceShapes['W4'][0][0]);

    for (let i in diceRoll.rolls) {
        renderDice(
            context, 
            diceShapes[diceRoll.diceType], 
            diceRoll.rolls[i],
            MARGIN + i * (DICE_SIZE + MARGIN),
            MARGIN
        );
    }

    return new AttachmentBuilder(await canvas.encode('png'), { name: 'roll.png'});
}

async function renderDice(context, shape, number, x, y, color = '#ffffff') {
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = color;
    context.translate(x, y);

    shape.forEach((path) => context.fill(path));

    context.font = '20px sans-serif';
    let textMeasure = context.measureText(number.toString());
    context.fillText(number.toString(), 25 - (textMeasure.width / 2), 33);

    /* context.strokeStyle = 'red';
    context.strokeRect(0, 0, 50, 50);
    context.strokeRect(0, 0, 25, 25);
    context.strokeRect(25, 25, 25, 25); */

    return context;
}