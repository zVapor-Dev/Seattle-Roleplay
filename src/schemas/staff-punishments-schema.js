const { Schema, model } = require('mongoose');

const StaffPunishmentSchema = Schema({
    username: String,
    guildId: String,
    content: Array,
})
module.exports = model('user-StaffPunishments', StaffPunishmentSchema)