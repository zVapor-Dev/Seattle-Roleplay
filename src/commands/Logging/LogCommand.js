const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const logSchema = require("../../schemas/log-schema");
var moment = require("moment");

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
            name: "Verbal warn",
            value: "Verbal warn",
          },
          {
            name: "Warn",
            value: "Warn",
          },
          {
            name: "Kick",
            value: "Kick",
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
    const staffMember = interaction.user;
    if (!notes) notes = "No notes provided";

    const guildMember = interaction.guild.members.cache.get(staffMember.id);
    if (!guildMember.roles.cache.has(`957078158400704562`))
      return message.reply(
        `You do not have permission to execute this command. You must be a staff member to use this command.`
      );

    if (subCommand === "add") {
      const replyEmbed = new Discord.MessageEmbed()
        .setTitle("Punishment Added: " + `${staffMember.tag}`)
        .setDescription(
          `<:online:996129575719415848> ${staffMember} |  \`${
            moment().format().split("-")[2].split("T")[0] +
            "/" +
            moment().format().split("-")[1] +
            "/" +
            moment().format().split("-")[0] +
            " | " +
            moment().format().split("T")[1]
          }\``
        )
        .addFields(
          {
            name: "◉ Username:",
            value: `<:icons_text1:986426740144496720> ${user}`,
          },
          {
            name: "◉ Action:",
            value: `<:icons_text1:986426740144496720> ${action}`,
          },
          {
            name: "◉ Reason:",
            value: `<:icons_text1:986426740144496720> ${reason}`,
          },
          {
            name: "◉ Notes (if any):",
            value: `<:icons_text1:986426740144496720> ${notes}`,
          }
        )
        .setThumbnail(staffMember.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `${staffMember.id}`,
          iconURL: staffMember.displayAvatarURL({ dynamic: true }),
        })
        .setColor(`#446ac2`)
        .setTimestamp();

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
                username: user.toLowerCase(),
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
                `\n**ID**: ${id + 1}\n**◉ Username**: ${user}\n**<:icons_text1:986426740144496720> Action**: ${
                  log.action
                }\n**<:icons_text1:986426740144496720> Reason**: ${log.reason}\n**<:icons_text1:986426740144496720> Notes**: ${
                  log.notes
                }\n**<:icons_text1:986426740144496720> Staff Member**: <@${log.staffId}>\n`
            );

            const embed = new Discord.MessageEmbed()
              .setColor(`#446ac2`)
              .setDescription(`${e.join(" ") + "<:line_bg:967182042808869014><:line_bg:967182042808869014><:line_bg:967182042808869014><:line_bg:967182042808869014><:line_bg:967182042808869014><:line_bg:967182042808869014><:line_bg:967182042808869014>" || "No punishments found"}`);
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
          username: user.toLowerCase(),
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
          username: user.toLowerCase(),
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await logSchema.findOneAndDelete({
              guildId: interaction.guild.id,
              username: user.toLowerCase(),
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
