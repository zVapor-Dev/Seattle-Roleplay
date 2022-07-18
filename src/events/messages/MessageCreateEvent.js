const BaseEvent = require("../../utils/structures/BaseEvent");
const Discord = require("discord.js");
const config = require("../../../config.json");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }
  /**
   *
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   */
  async run(client, message) {
    if (
      message.content.includes(`<@!531162627389259829>`) ||
      message.content.includes(`<@!415177519851896832>`) ||
      message.content.includes(`<@!597874378537041921>`) ||
      message.content.includes(`<@!631390340598857728>`) ||
      message.content.includes(`<@!583975549194731530>`) ||
      message.content.includes(`<@!868955829137727568>`) ||
      message.content.includes(`<@!581266592076136468>`) ||
      message.content.includes(`<@!931351730736726048>`)
    ) {
      if (message.member.roles.cache.has(`886710022162239508`)) return;
      if (message.author.bot) return;
      const embed = new Discord.MessageEmbed()
      .setDescription(
        `Please do not ping SHR/HR for no reason, Only ping them for important reason! If you need assistance please make a ticket in <#883468644313628712> .`
      )
      .setTimestamp()
      .setColor("RANDOM");
      message.reply({ content: `<@${message.author.id}>`, embeds: [embed]});
    }
  }
};
