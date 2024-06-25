# Discord Dice Roll Bot

Based on https://discord.js.org/

Made for pen & paper stuff.
Adds a `/roll` command to roll dice in chat. 
It supports any number of `D4`, `D6`, `D8`, `D10`, `D12`, `D20` or `D100` and a flat bonus value.


* `/roll` shows a personal message with buttons. You can interact to select the dice to roll.
* `/roll <pattern>` rolls the given pattern, for example `W10`, `3W6`, `2W6+9`, `W100+12`.

## Setup

Create copy and rename the `.env.dist` file to `.env`.
Add your bot credentials and Discord server ID.

Deploy commands with `node deploy-commands.js`.

Start bot with `node index.js`.