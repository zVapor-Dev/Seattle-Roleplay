const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const config = require("../../../config.json");
const logSchema = require("../../schemas/log-schema");

var slashCommandOptions = [
  {
    name: "add",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
      {
        name: "user",
        description: "The user you are punishing!",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
      },
      {
        name: "action",
        description: "The action you performed!",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        choices: [
          {
            name: "Verbal warn 1",
            value: "Verbal warn 1",
          },
          {
            name: "Verbal warn 2",
            value: "Verbal warn 2",
          },
          {
            name: "Warn 1",
            value: "Warn 1",
          },
          {
            name: "Warn 2",
            value: "Warn 2",
          },
          {
            name: "Warn 3",
            value: "Warn 3",
          },
          {
            name: "Kick 1",
            value: "Kick 1",
          },
          {
            name: "Kick 2",
            value: "Kick 2",
          },
          {
            name: "Kick 3",
            value: "Kick 3",
          },
          {
            name: "Ban",
            value: "Ban",
          },
        ],
      },
      {
        name: "reason",
        description: "The reason for this punishment",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
      },
      {
        name: "notes",
        description: "Any notes if applicable",
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
    description: "Add a staff punishment to a staff member",
  },
  {
    name: "search",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "search a  file.",
    options: [
      {
        name: "user",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        description: "The user to clear the  file for.",
        required: true,
      },
    ],
  },

  {
    name: "remove",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "Remove a punishment from a staff member",
    options: [
      {
        name: "user",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        description: "the user to remove a punishment from",
        required: true,
      },
      {
        name: "log-number",
        type: Discord.Constants.ApplicationCommandOptionTypes.INTEGER,
        description: "The ID of the punishment to remove",
        required: true,
      },
    ],
  },
  {
    name: "clear",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "Clear a  file.",
    options: [
      {
        name: "user",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        description: "The user to clear the  file for.",
        required: true,
      },
    ],
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

module.exports = class LogCommand extends BaseCommand {
  constructor() {
    super(
      "log",
      "Logging",
      false,
      0,
      "Manage a user punishment.",
      slashCommandOptions
    );
  }

  async run(client, interaction, args) {
    const subCommand = interaction.options.getSubcommand();
    const user = interaction.options.getString("user");
    const reason = interaction.options.getString("reason");
    let notes = interaction.options.getString("notes");
    const action = interaction.options.getString("action");
    const logNumber = interaction.options.getInteger("log-number") - 1;
    const staffMember = interaction.user.id;
    if (!notes) notes = "No notes provided";

    if (subCommand === "add") {
      const replyEmbed = new Discord.MessageEmbed()
        .setTitle(`New user log created.`)
        .addField("User", `${user}`)
        .addField("Reason", `${reason}`)
        .addField("Action", `${action}`)
        .addField("Staff", `<@${staffMember}>`)
        .addField("Notes", `${notes}`)
        .setTimestamp()
        .setColor(`#446ac2`);

      interaction.reply({ embeds: [replyEmbed] });

      try {
        logSchema.findOne(
          {
            username: user,
            guildId: interaction.guild.id,
          },
          async (err, data) => {
            if (err) throw err;
            if (!data) {
              data = new logSchema({
                username: user,
                guildId: interaction.guild.id,
                content: [
                  {
                    action,
                    reason,
                    notes,
                    staffId: staffMember,
                  },
                ],
              });
            } else {
              const object = {
                action,
                reason,
                notes,
                staffId: staffMember,
              };
              data.content.push(object);
            }
            data.save();
          }
        );
        console.log(`Saved new data for user ${user} to the database.`);
      } catch (e) {
        console.log(`Failed to save data to the database! ${e}`);
      }
    }

    if (subCommand === "search") {
      const user = interaction.options.getString("user");
      logSchema.findOne(
        {
          username: user,
          guildId: interaction.guild.id,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            const e = data.content.map(
              (log, id) =>
                `\n**ID**: ${id + 1}\n**Username**: ${user}\n**Action**: ${
                  log.action
                }\n**Reason**: ${log.reason}\n**Notes**: ${
                  log.notes
                }\n**Staff Member**: <@${log.staffId}>\n`
            );

            const embed = new Discord.MessageEmbed()
              .setColor(`#446ac2`)
              .setDescription(`${e.join(" ") || "No punishments found"}`);
            interaction.reply({
              embeds: [embed],
              content: `Here is the file of ${user}`,
            });
          } else {
            interaction.reply({
              content: `Creating file for ${user}...`,
            });
            const newData = new logSchema({
              username: user,
              guildId: interaction.guild.id,
              content: [],
            });
            newData.save();
          }
        }
      );
    }

    if (subCommand === "remove") {
      const user = interaction.options.getString("user");
      logSchema.findOne(
        {
          guildId: interaction.guild.id,
          username: user,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            data.content.splice(logNumber, 1);
            interaction.reply(
              `Ok. Your wish is my command! Punishment is deleted!`
            );
            data.save();
          } else {
            interaction.reply(
              `Damn... that guy has a clean lookin file tho.. make sure to keep it that way bud!`
            );
          }
        }
      );
    }

    if (subCommand === "clear") {
      const user = interaction.options.getString("user");
      logSchema.findOne(
        {
          guildId: interaction.guild.id,
          username: user,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await logSchema.findOneAndDelete({
              guildId: interaction.guild.id,
              username: user,
            });
            interaction.reply(
              `Ok. Your wish is my command! All punishments deleted from this member!`
            );
          } else {
            interaction.reply(
              `Damn... that guy has a clean lookin file tho.. make sure to keep it that way bud!`
            );
          }
        }
      );
    }
  }
};
