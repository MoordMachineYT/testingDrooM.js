const drooM = require("droomtwo.js");

function run(message, args, client) {
  /* Change this */
  drooM.Logger.logError(`command ${message.command} doesn't have any code to execute`);
}
function disable(command, client) {
  client.Handler.commands[command].options.enabled = false;

  /* Stay away from everything defined above */

  drooM.Logger.log(`disabled ${client.Handler.commands[command].label}`, "COMMAND");
}
function enable(command, client) {
  client.Handler.commands[message.command].options.enabled = true;

  /* Stay away from everything defined above */

  drooM.Logger.log(`enabled ${client.Handler.commands[command].label}`, "COMMAND");
}

/* Stay away from everything defined below */

module.exports = {
  run: run,
  disable: disable,
  enable: enable
};
