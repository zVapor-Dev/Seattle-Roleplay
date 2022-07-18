// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
  const BaseEvent = require('../../utils/structures/BaseEvent');
  const config = require('../../../config.json');
  const guildSchema = require('../../schemas/guilds');
  
  module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() {
      super('guildCreate');
    }
    
    async run(client, guild) {
      if (config.database !== '') {
      guildSchema.remove({
        guildID: guild.id
      })
      .then(() => {console.log(`Removed server from Database! Guild: ${guild.name} (${guild.id})`)})
      .catch(err => {console.log(`Critical Error! Failed to remove Guild "${guild.name} (${guild.id})" from Database! Error: ${err}`)})
    }
  }
  }