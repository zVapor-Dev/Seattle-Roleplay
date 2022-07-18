const BaseEvent = require('../../utils/structures/BaseEvent');
    const Discord = require('discord.js');
    const config = require('../../../config.json');
    const guildSchema = require('../../schemas/guilds');
    const slowdown = new Set(); // for command slowdowns

module.exports = class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }
  
  async run(client, interaction) {
    if (interaction.isCommand()) {
        const args = [];
        for (let option of interaction.options.data) {
          if (option.type === "SUB_COMMAND") {
              if (option.name) args.push(option.name);
              option.options?.forEach((x) => {
                  if (x.value) args.push(x.value);
              });
          } else if (option.value) args.push(option.value);
        }
        const command = client.commands.get(interaction.commandName.toLowerCase());
        if (command) {
          if (config.devMode === false) {
          if (command.ownerOnly === false) {
            if (command.slowdown === 0) {
            command.run(client, interaction, args);
            if (config.logCommands === true) {
              console.log(`${interaction.user.tag} ran command ${interaction.commandName} in server ${interaction.guild.name} (${interaction.guild.id}) and in channel ${interaction.channel.name}`)
            }
            } else {
              if (slowdown.has(`${command.name}: ${interaction.user.id}: guild: ${interaction.guild.id}`)) {
                let seconds = Math.round((command.slowdown / 1000).toFixed(1));
                let minutes = Math.round((command.slowdown / (1000 * 60)).toFixed(1));
                let hours = Math.round((command.slowdown / (1000 * 60 * 60)).toFixed(1));
                let days = Math.round((command.slowdown / (1000 * 60 * 60 * 24)).toFixed(1));
                interaction.reply(`You cannot run that command right now! Please wait \`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds.`)
              } else {
                command.run(client, interaction, args);
                if (config.logCommands === true) {
                  console.log(`${interaction.user.tag} ran command ${interaction.commandName} in server ${interaction.guild.name} (${interaction.guild.id}) and in channel ${interaction.channel.name}`)
                }
                slowdown.add(`${command.name}: ${interaction.user.id}: guild: ${interaction.guild.id}`);
                setTimeout(() => {
                  slowdown.delete(`${command.name}: ${interaction.user.id}: guild: ${interaction.guild.id}`)
                }, command.slowdown);
              }
          }
          } else {
            if (config.owners.indexOf(interaction.user.id).toString() !== '-1') {
                command.run(client, interaction, args);
                if (config.logCommands === true) {
                  console.log(`${interaction.user.tag} ran command ${interaction.commandName} in server ${interaction.guild.name} (${interaction.guild.id}) and in channel ${interaction.channel.name}`)
                }
            } else {
              interaction.reply("This command only works for Owners!")
            }
          }
        } else {
          if (config.owners.indexOf(interaction.user.id).toString() !== '-1') {
            command.run(client, interaction, args);
            if (config.logCommands === true) {
              console.log(`${interaction.user.tag} ran command ${interaction.commandName} in server ${interaction.guild.name} (${interaction.guild.id}) and in channel ${interaction.channel.name}`)
            }
          } else {
            interaction.reply(`Sorry, ${client.user.username} is in DEV mode so you cannot run commands at the moment!`)
          }
        }
        }
    }

  }
}