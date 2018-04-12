const drooM = require("droomtwo.js");

function run(client, ...params) {
  drooM.Logger.logError("event fired and listened to, but nothing to execute");
}

module.exports = run;
