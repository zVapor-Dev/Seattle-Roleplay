
const { Client, Intents } = require('discord.js');
const { registerCommands, registerEvents, registerDMCommands, registerTempCommands } = require('./utils/registry');
const config = require('../config.json');
const client = new Client({ intents: 32767 });

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.owners = config.owners;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();

