var lib;
try {
  lib = require("eris");
} catch(err) {
  try {
    lib = require("discord.js");
  } catch(err) {
    throw new Error("Neither of listed modules found: Eris, Discord.js");
  }
}
if (lib.VERSION) lib = "Eris";
else lib = "Discord.js";

// ------ -----  * -----   * -----   -----  ----- ----- ----- ----- -----  ----
// -      -   -- - -       - -       -   -- -       -     -   -     -   -- ----
// ------ ------ - -----   - -----   -----  -----   -     -   ----- ------ ----
// -      ---    -     -   -     -   ------ -       -     -   -     ---    ----
// ------ -  --- - -----   - -----   -----  -----   -     -   ----- -  --- ****

function betterDrooM(token, options) {
  const Client = require(`./src/${lib}/Client.js`);
  return new Client(token, options);
}
betterDrooM.Discord = {};
betterDrooM.Eris = {
  Client: require("./src/Eris/Client.js"),
  Command: require("./src/Eris/Presets/Classes/Command.js"),
  Embed: require("./src/Eris/Util/Embed.js"),
  Handler: require("./src/Eris/Structures/Handler.js"),
  Logger: require("./src/Eris/Util/Logger.js"),
  Registry: require("./src/Eris/Structures/Registry.js")
};
module.exports = betterDrooM;
