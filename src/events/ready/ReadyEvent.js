const BaseEvent = require("../../utils/structures/BaseEvent");
const mongoose = require("mongoose");
const config = require("../../../config.json");
const { commands } = require("../../utils/registry");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client) {
    if (config.database !== "") {
      mongoose
        .connect(config.database, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log("✔️ Succesfully Connected To Database!");
        })
        .catch((err) => {
          console.log(`❌ Failed To Connect To Database! Error: ${err}`);
        });
    }

    await client.guilds.cache
      .get("825985134434975765")
      .commands.set(commands)
      .then(console.log("✅ Successfully loaded Commands"));
    console.log(`${client.user.tag} has logged in.`);
    client.user.setPresence({
      activity: [{ name: `${client.users.cache.size} members,` }],
      type: `WATCHING`,
    });
  }
};
