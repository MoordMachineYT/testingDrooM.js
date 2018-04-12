const drooM = require("droom.js").Eris;

class Command {
  constructor(client, options) {
    /**
    * The client the bot is running on
    * @type {Object}
    */
    this.client = client;

    /**
    * The command options
    * @prop {String} [description="No description"] The description of the command
    * @prop {String?} fullDesciption A more detailed description
    * @prop {Boolean} args Whether the command needs arguments for it to work
    * @prop {Array?} aliases The additional aliases to call the command with
    * @prop {Object?} req The optional requirements the user needs
    * @prop {Boolean} guild Whether a command should be executed in a guild or not
    * @prop {Boolean} dm Whether a command should be executed in private messages or not
    * @prop {Number?} cooldown The cooldown for the command in miliseconds
    * @prop {String} usage How a command should be used
    * @prop {String?} invalidPermission The message sent if the user who called doesn't meet the requirenemts
    * @prop {String?} errorMessage The message sent when a command isn't executed successfully
    * @prop {String|Function?} onCooldown The message sent if the command is on cooldown
    * @prop {Boolean} enabled Whether the command should be enabled or not
    * @prop {Boolean} helpCommand Whether the command should show up in the default help command
    * @type {Object}
    */
    this.options = {
      description: "No description",
      fullDesciption: null,
      args: false,
      aliases: null,
      req: {},
      guild: true,
      dm: true,
      cooldown: 0,
      usage: null,
      invalidPermission: "You don't have permission to use this command.",
      errorMessage: "Something went wrong, please report this to the owner.",
      onCooldown: (ms => "You have to wait " + ms + "ms to use this command again."),
      enabled: true,
      helpCommand: true
    };

    if (typeof options === "object") {
      for (const i of Object.keys(options)) this.options[i] = options[i];
    }

    if (!this.options.req.permissions) this.options.req.permissions = [];
    if (!this.options.req.userIDs) this.options.req.userIDs = [];
    if (!this.options.req.usernames) this.options.req.usernames = [];
    if (!this.options.req.roleIDs) this.options.req.roleIDs = [];
    if (!this.options.req.rolenames) this.options.req.rolenames = [];

    /* Stay away from everything defined above */

    // You can do all kind of stuff right now in the constructor
    // It'll get executed at runtime
    // It's recommended to check if the client is ready first

    client.once("ready", () => {
      if (this.options.enabled) drooM.Logger.log(`loaded ${this.options.label}!`, "COMMAND");
    });
  }
  /**
  * Enables the command
  * @type {Function}
  */
  enable() {
    this.options.enabled = true;

    /* Stay away from everything defined above */

    drooM.Logger.log(`enabled ${this.options.label}!`, "COMMAND");
  }
  /**
  * Disables the command
  * @type {Function}
  */
  disable() {
    this.options.enabled = false;

    /* Stay away from everything defined above */

    drooM.Logger.log(`disabled ${this.options.label}!`, "COMMAND");
  }
  /**
  * Gets run when the command is called
  * @param {Object} message The message that's sent
  * @param {String?} args The arguments of the command
  * @type {Function}
  */
  run(message, args) {
    /* Change this */
    drooM.Logger.logError(`command ${this.options.label} doesn't have any code to execute`);
  }
}

module.exports = Command;
