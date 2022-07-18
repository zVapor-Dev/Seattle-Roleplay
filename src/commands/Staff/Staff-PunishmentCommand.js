const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const config = require("../../../config.json");
const StaffPunishmentSchema = require("../../schemas/staff-punishments-schema");
const staffPunishmentsSchema = require("../../schemas/staff-punishments-schema");

var slashCommandOptions = [
  {
    name: "add",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
      {
        name: "user",
        description: "The user you are punishing!",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER,
      },
      {
        name: "action",
        description: "The action you performed!",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        choices: [
          {
            name: "Warn",
            value: "Warn",
          },
          {
            name: "Strike",
            value: "Strike",
          },
          {
            name: "Termination",
            value: "Termination",
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
    description: "search a personnel file.",
    options: [
      {
        name: "user",
        type: Discord.Constants.ApplicationCommandOptionTypes.USER,
        description: "The user to clear the personnel file for.",
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
        type: Discord.Constants.ApplicationCommandOptionTypes.USER,
        description: "the user to remove a punishment from",
        required: true,
      },
      {
        name: "strike-number",
        type: Discord.Constants.ApplicationCommandOptionTypes.INTEGER,
        description: "The ID of the punishment to remove",
        required: true,
      },
    ],
  },
  {
    name: "clear",
    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    description: "Clear a personnel file.",
    options: [
      {
        name: "user",
        type: Discord.Constants.ApplicationCommandOptionTypes.USER,
        description: "The user to clear the personnel file for.",
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

module.exports = class StaffPunishmentcommand extends BaseCommand {
  constructor() {
    super(
      "staff-punishment",
      "Staff",
      false,
      0,
      "Punish a staff member.",
      slashCommandOptions
    );
  }

  async run(client, interaction, args) {
    const subCommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member.roles.cache.has(`922790478242541569`) || !member.roles.cache.has(`969005575805493328`)) return interaction.reply(`Oi mate, you're not allowed to use this command.`)
    const reason = interaction.options.getString("reason");
    const action = interaction.options.getString("action");
    const strikeNumber = interaction.options.getInteger("strike-number") - 1;
    let notes = interaction.options.getString("notes");
    if (!notes) notes = "No notes provided";
    const staffMember = interaction.user.id;

    if (subCommand === "add") {
      const replyEmbed = new Discord.MessageEmbed()
        .setTitle(`New user Punished created.`)
        .addField("User", `${user}`)
        .addField("Reason", `${reason}`)
        .addField("Action", `${action}`)
        .addField("Notes", `${notes}`)
        .addField("IA Personal", `<@${staffMember}>`)
        .setTimestamp()
        .setColor("RED");

      const userEmbed = new Discord.MessageEmbed()
        .setTitle(`There has been a punishment added to your File`)
        .setDescription(
          `Read below for more info on what this punisment is. If you have any compaints please DM Internal Affairs`
        )
        .addField("User", `${user.username}`)
        .addField("Reason", `${reason}`)
        .addField("Action", `${action}`)
        .addField("IA Personal", `<@${staffMember}>`)
        .setTimestamp()
        .setColor("RED");

      interaction.reply({ embeds: [replyEmbed] });
      user
        .send({ embeds: [userEmbed] })
        .catch((err) =>
          interaction.channel.send(
            `Couldn't message this member. is it a bot? or do they have their DM's disabled?`
          )
        );

      try {
        StaffPunishmentSchema.findOne(
          {
            username: user.username,
            guildId: interaction.guild.id,
          },
          async (err, data) => {
            if (err) throw err;
            if (!data) {
              data = new StaffPunishmentSchema({
                username: user.username,
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
        console.log(
          `Saved new data for user ${user.username} to the database.`
        );
      } catch (e) {
        console.log(`Failed to save data to the database! ${e}`);
      }
    }

    if (subCommand === "search") {
      const user = interaction.options.getUser("user");
      staffPunishmentsSchema.findOne(
        {
          username: user.username,
          guildId: interaction.guild.id,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            const e = data.content.map(
              (staffLog, id) =>
                `\n**ID**: ${id + 1}\n**Username**: ${user.tag}\n**Action**: ${
                  staffLog.action
                }\n**Reason**: ${staffLog.reason}\n**Notes**: ${
                  staffLog.notes
                }\n**Staff Member**: <@${staffLog.staffId}>\n`
            );
            const embed = new Discord.MessageEmbed().setDescription(
              `${e.join(" ") || "No punishments found"}`
            );
            return interaction.reply({
              embeds: [embed],
              content: `Here is the personnel file of <@${user.id}>`,
            });
          } else {
            interaction.reply({
              content: `Creating personnel file for <@${user.id}>...`,
            });
            const newData = new StaffPunishmentSchema({
              username: user.username,
              guildId: interaction.guild.id,
            });
            newData.save();
          }
        }
      );
    }

    if (subCommand === "remove") {
      const user = interaction.options.getUser("user");
      staffPunishmentsSchema.findOne(
        {
          guildId: interaction.guild.id,
          username: user.username,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            data.content.splice(strikeNumber, 1);
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
      const user = interaction.options.getUser("user");
      staffPunishmentsSchema.findOne(
        {
          guildId: interaction.guild.id,
          username: user.username,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await staffPunishmentsSchema.findOneAndDelete({
              guildId: interaction.guild.id,
              username: user.username,
            });
            interaction.reply(
              `Ok. Your wish is my command! All punishments deleted from this staff member!`
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
