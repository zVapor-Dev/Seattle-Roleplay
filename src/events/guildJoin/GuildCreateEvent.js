// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
  const BaseEvent = require('../../utils/structures/BaseEvent');
  const config = require('../../../config.json');
  const guildSchema = require('../../schemas/guilds');
  
  module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() {
      super('guildCreate');
    }
    
    async run(client, guild) {
      if (config.database !== '') {
      guildSchema.create({
        guildID: guild.id
      })
      .then(() => {console.log(`Added new guild to database! Guild: ${guild.name} (${guild.id})`)})
      .catch(err => {console.log(`Critical Error! Failed to add new Guild "${guild.name} (${guild.id})" to the database! Error: ${err}`)})
    }
  }
  }