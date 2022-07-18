const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const config = require("../../../config.json");

var slashCommandOptions = [
  {
    name: "ia",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "View all the Internal Affairs commands.",
  },
  {
    name: "ssu",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "View all the SSU commands.",
  },
  {
    name: "logging",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "View all the ingame logging commands.",
  },
];
/*
Example: 

var slashCommandOptions = [
  {
    name: 'song',
    description: 'The song to play!',
    required: true,
    type: Discord.Constants.ApplicationCommandOptionTypes.STRING
  }
]

So the options is basically the Arguments for the command
*/

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super(
      "help",
      "Information",
      false,
      0,
      "A basic help command.",
      slashCommandOptions
    );
  }

  /**
   *
   * @param {Discord.Client} client
   * @param {Discord.CommandInteraction} interaction
   * @param {String[]} args
   * @returns
   */

  async run(client, interaction, args) {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === "logging") {
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(`${client.user.username} - **Help menu** - User Logging Commands`)
            .addFields([
              {
                name: "`/log add` - <roblox user> <action> <reason> [notes]",
                value: "Add a user log",
              },
              {
                name: "`/log search` - <roblox user>",
                value: "Find a user log",
              },
              {
                name: "`/log remove` - <roblox user> <log id>",
                value: "Remove a user log",
              },
              {
                name: "`/log clear` - <roblox user>",
                value: "Clear a user's file",
              },
            ]),
        ],
      });
    } else if (subCommand === "ia") {
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(`${client.user.username} - **Help menu** - IA+ Commands`)
            .addField(
              "Staff Punishment Logging:",
              "This is used for logging staff punishments to the brain of the bot aka the database.",
              true
            )
            .addFields([
              {
                name: "`/staff-punishment add` - <user @> <action> <reason> [notes]",
                value: "Add a staff punishment",
              },
              {
                name: "`/staff-punishment search` - <user @>",
                value: "Find a staff punishment",
              },
              {
                name: "`/staff-punishment remove` - <user @> <punishment id>",
                value: "Remove a staff punishment",
              },
              {
                name: "`/staff-punishment clear` - <user @>",
                value: "Clear a staff file",
              },
            ])
        ],
      });
    } else if (subCommand === "ssu") {
      return interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(`${client.user.username} - **Help menu** - SSU Commands`)
            .addFields([
              {
                name: "`/ssu start`",
                value: "Starts the SSU & enables reminders for staff",
              },
              {
                name: "`/ssu stop`",
                value: "Stops the SSU and clears the SSU channels",
              },
              {
                name: "`/ssu extend`",
                value:
                  "If the reminders have stopped resume them with this command",
              },
              { name: "`/ssu boost`", value: "Request a boost in the server!" },
              { name: "`/ssu poll`", value: "Start a poll for hosting a SSU!" },
            ]),
        ],
      });
    }
  }
};
