const { Schema, model } = require('mongoose');

const logSchema = Schema({
    username: String,
    guildId: String,
    content: Array
})
module.exports = model('user-logs', logSchema)