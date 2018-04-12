"use strict";

const addFunctions      = require("./Util/addFunction.js");
const Handler           = require("./Structures/Handler.js");
const lib               = require("eris");
const Logger            = require("./Util/Logger.js");
const Registry          = require("./Structures/Registry.js");
/**
* Adds functions to the eris library
* @arg {*} lib The eris library
* @returns {*}
*/
const eris             = addFunctions(lib);

class Client extends eris.Client {
  constructor(token, options) {
    super(token, options);

    /* Required for the client to work */

    if (!token) throw new Error("no token provided"); // No token no connection
    if (!options.commandPath) throw new Error("no command path given"); // No path no commands
    if (!options.eventPath) throw new Error("no event handler path given"); // No path no event handling

    /* User defined or default */

    this.token = token;
    this.commandPath = options.commandPath;
    this.eventPath = options.eventPath;
    this.prefix = options.prefix || ["!"]; // No prefix => prefix = "!"
    this.helpCommand = options.helpCommand || true;
    this.evalCommand = options.evalCommand || false;
    this.owner = Array.isArray(options.owner) ? options.owner : [options.owner];
    if (this.evalCommand && !this.owner[0]) Logger.logWarning("No user id given, the eval command won't work."); // No owner no eval
    if (!Array.isArray(this.prefix)) this.prefix = [this.prefix];

    /* Mechanism */

    this.ready = false;
    this.started = false;
    this.Handler = new Handler(this, this.prefix);
    this.Registry = new Registry(this.commandPath, this.eventPath);

    return this;
  }
  launch() {
    if (this.ready) return Logger.logWarning("attempt to connect the client, whilst it's already connected");
    if (!this.started) this.listen();
    else {
      this.once("ready", () => {
        this.ready = true;
      });
    }
    this.connect().catch(err => Logger.logError("failed to connect to the API: " + err.message));
  }
  listen() {
    this.on("messageCreate", this.Handler.validate);
    this.once("ready", () => {
      this.ready = true;
    });
    this.started = true;
  }
  pause() {
    this.disconnect({reconnect: true});
    this.ready = false;
  }
  reconnect() {
    this.ready = false;
    this.disconnect({reconnect: true});
    this.launch();
  }
  addCommand(label, options) {
    /* Restrictions for commands */
    if (typeof label !== "string") throw new TypeError("label must be a string");
    if (label.includes(" ")) throw new Error("label may not include spaces");

    /* Default command setup */

    var cmd = {
      aliases: [],
      args: false,
      guild: true,
      dm: true,
      description: "No description.",
      fullDescription: null,
      usage: null,
      req: {},
      cooldown: 0,
      invalidUsage: null,
      invalidPermission: "You don't have permission to use this command.",
      errorMessage: "Something went wrong, please report this to the owner.",
      onCooldown: (ms => "You have to wait " + ms + "ms to use this command again."),
      helpCommand: true,
      type: "function",
      enabled: true
    };

    /* User input */

    if (typeof options === "object") {
      for (var i in options) cmd[i] = options[i];
    }

    /* Restrictions for commands */

    if (!cmd.aliases) cmd.aliases = [];
    if (!cmd.fullDescription) cmd.fullDescription = cmd.description;
    if (!cmd.invalidUsage) cmd.invalidUsage = `You are using this command incorrectly. Try \`${this.prefix[0]}help ${label} for more information.`;
    if (typeof cmd.aliases === "string") cmd.aliases = [cmd.aliases];
    if (!cmd.req.userIDs) cmd.req.userIDs = [];
    if (!cmd.req.usernames) cmd.req.usernames = [];
    if (!cmd.req.roleIDs) cmd.req.roleIDs = [];
    if (!cmd.req.rolenames) cmd.req.rolenames = [];
    if (!cmd.req.permissions) cmd.req.permissions = [];
    if (typeof cmd.req.adminCheck !== "boolean") cmd.req.adminCheck = false;
    this.Handler.registerCommand(label, options);
  }
}
