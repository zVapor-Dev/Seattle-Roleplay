const mongoose = require('mongoose');
    const defaultPrefix = require('../../config.json').prefix;
    
    const guilds = new mongoose.Schema({
      guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
      },
    });
    
    module.exports = mongoose.model('guilds', guilds);