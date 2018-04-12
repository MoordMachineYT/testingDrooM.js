"use strict";

const Collection = require("../Util/Collection.js"), Logger = require("../Util/Logger.js");

class Handler {
  constructor(client, prefixes) {
    this.client = client;
    this.prefixes = {default: prefixes};
    this.commands = new Collection();
    this.commandAliases = {};
    this.onCooldown = {};
  }
  /**
  * Checks if a command is called
  * @param {Object} message The message object
  * @type {Function}
  * @returns {Undefined}
  */
  async validate(message) {
    if (!message.author) return this.client.emit("warn", "message received without an author");
    var check = await this.commandCheck(message);
    if (!check) return;
    let args = message.content.slice(check);
    if (!args) return;
    args = args.split(" ");
    let command = args.shift();
    if (!command) return;
    command = this.commandAliases[command.toLowercase()] || command.toLowercase();
    if (!this.commands.has(command)) return;
    message.command = command;
    command = this.commands.get(command);
    const q = await cooldownCheck(message, command);
    if (q) {
      if (!command.onCooldown) return;
      if (typeof command.onCooldown === "function") {
        message.channel.createMessage(command.onCooldown(q));
      } else message.channel.createMessage(command.onCooldown);
    }
    const c = await this.channelCheck(message, command);
    if (!c) return;
    if (command.options.args && !args[0]) return message.channel.createMessage(command.options.invalidUsage).catch(() => {
      return Logger.logWarning(`Cannot send a message to ${message.channel.name} in ${message.channel.guild.name}, insufficient permissions`);
    });
    const p = await this.permissionCheck(message, command);
    args = args.join(" ");
    if (!p) return;
    const eCommand = await command.run(message, args, this.client);
    if (!eCommand) return this.emit("failure", eCommand, command);
    if (eCommand instanceof Promise) return this.emit("success", eCommand, command);
    if (typeof eCommand === "string") {
      this.emit("success", eCommand, command);
    } else if (typeof eCommand === "object") {
      if (!eCommand.isSuccess && eCommand.reason) {
        this.emit("failure", eCommand, command);
      }
      if (!eCommand.isSuccess && !eCommand.reason) {
        eCommand.reason = command.errorMessage;
        this.emit("failure", eCommand, command);
      }
      if (eCommand.isSuccess && eCommand.send) {
        message.channel.createMessage(eCommand.send);
        this.emit("success", eCommand, command);
      }
      if (typeof eCommand.exec === "function") {
        eCommand.exec(this);
      }
    }
    if (command.cooldown) {
      if (!this.onCooldown[message.command]) this.onCooldown[message.command] = {};
      this.onCooldown[message.command][message.author.id] = Date.now();
    }
  }
  /**
  * Updates global prefixes
  * @param {String|Array<String>} prefix The prefix(es)
  * @type {Function}
  * @returns {Undefined}
  */
  updatePrefix(prefix) {
    if (typeof prefix === "string") {

      /* If only 1 prefix given */

      this.prefixes.default = [prefix];
    } else {

      /* If more than 1 prefix given */

      this.prefixes.default = prefix;
    }
  }
  /**
  * Registers prefixes for any guild
  * @param {String|Array<String>} prefix The prefix(es)
  * @param {String} guildID The id of the guild to use the prefix(es) in
  * @type {Function}
  * @returns {Undefined}
  */
  registerGuildPrefix(prefix, guildID) {
    if (typeof prefix === "string") {
      /* If only 1 prefix given */
      if (!this.prefixes[guildID]) {

        /* If there isn't a prefix registered for the specified guild */

        this.prefixes[guildID] = [prefix];
      } else {

        /* If there is a prefix registered for the specified guild */

        this.prefixes[guildID].push(prefix);
      }
    } else {

      /* If more than 1 prefix given */

      this.prefixes[guildID] = prefix;
    }
  }
  /**
  * Checks if the message starts with a prefix
  * @param {Object} message The message object
  * @type {Function}
  * @returns {Number|Boolean}
  */
  commandCheck(message) {
    var prefix;

    /* Guild prefixes first, then default */

    if (this.prefixes[message.channel.guild.id]) {

      /* If there are guild prefixes */

      prefix = this.prefixes[message.channel.guild.id].filter(pref => message.content.startsWith(pref));
      if (!prefix[0]) return false;
      return prefix[0].length;
    }

    /* If there aren't any guild prefixes */

    prefix = this.prefixes.default.filter(pref => message.content.startsWith(pref));
    if (!prefix[0]) return false;
    return prefix[0].length;

  }
  /**
  * Checks if the user has permission to use the command
  * @param {Object} msg The message object
  * @param {Object} command The command that's called
  * @type {Function}
  * @returns {Boolean}
  */
  permissionCheck(msg, command) {
    var cur, req;
    const perm = command.options.req;

    /* Custom permissions */

    if (typeof perm.custom === "function") {
      req = true;
      if (perm.custom(msg)) return true;
    }

    /* Channel permissions */

    if (perm.permissions[0]) {
      req = true;
      cur = true;
      const permissions = msg.channel.permissionsOf(msg.author.id).json;
      const preq = command.req.permissions;
      for (var i = 0; i < req.length; i++) {
        if (!permissions[preq[i]]) {
          req = false;
          break;
        }
      }
      if (cur) return true;
    }

    /* User ids */

    if (perm.userIDs[0]) {
      req = true;
      if (~perm.userIDs.indexOf(msg.author.id)) return true;
    }

    /* Usernames */

    if (perm.usernames[0]) {
      req = true;
      if (~perm.usernames.indexOf(msg.author.username)) return true;
    }

    /* Role ids */

    if (perm.roleIDs[0]) {
      req = true;
      cur = false;
      const roles = msg.member.roles;
      roles.forEach(r => {
        if (~perm.roleIDs.indexOf(r)) cur = true;
      });
      if (cur) return true;
    }

    /* Rolenames */

    if (perm.rolenames[0]) {
      req = true;
      cur = false;
      const roles = msg.member.roles.map(r => msg.channel.guild.roles.get(r));
      roles.forEach(r => {
        if (~perm.rolenames.indexOf(r.name)) cur = true;
      });
      if (cur) return true;
    }

    /* Admin check */

    if (perm.adminCheck && msg.member.permission.has("administrator")) return true;
    return !req;
  }
  /**
  * Checks if the command that's called is used in the right channel
  * @param {Object} message The message object
  * @param {Object} command The command that's called
  * @type {Function}
  * @returns {Boolean}
  */
  channelCheck(message, command) {
    const c = command.options;

    /* If the message is called in a guild and it should be called in a private channel */

    if (!c.guild && message.member) return false;

    /* If the message is called in a private channel and it should be called in a guild */

    if (!c.dm && !message.member) return false;

    /* If that's not the case */

    return true;
  }
  cooldownCheck(message, command) {
    if (!command.cooldown) return false;
    if (!this.onCooldown[message.command]) this.onCooldown[message.command] = {};
    if (!this.onCooldown[message.command][message.author.id]) return false;
    if (new Date(message.timestamp) - this.onCooldown[message.command][message.author.id] > command.cooldown) return new Date(message.timestamp) - this.onCooldown[message.command][message.author.id];
    return false;
  }
  registerCommand(label, options) {
    if (this.commands.has(label) || this.commandAliases[label]) throw new Error("already registered a command with label " + label);
    options.aliases.forEach((val) => {
      if (this.commands.has(val) || this.commandAliases[val]) throw new Error("already registered a command with label " + val);
    });
    options.aliases.forEach((val) => {
      this.commandAliases[val] = label;
    });
    const types = [
      "function",
      "class"
    ];
    if (!types.indexOf(options.type)) options.type = "function";
    const type = options.type;
    delete options.type;
    var path = this.client.Registry.write("command", { type: type, path: options.path });
    path += `/${label}.js`;
    const Command = require(path);
    if (type === "class") {
      this.commands.set(label, new Command(this.client, options));
    } else {
      var qwerty = {
        options: options,
        run: Command.run,
        disable: Command.disable,
        enable: Command.enable
      };
      this.commands.set(label, qwerty);
    }
  }
  unregisterCommand(label) {
    if (!label) Promise.reject(new Error("no label specified"));
    label = this.commandAliases[label] || label;
    if (!this.commands.has(label)) Promise.reject(new Error("command not found"));
    const command = this.commands.get(label);
    command.options.aliases.forEach(a => {
      delete this.commandAliases[a];
    });
    return this.commands.delete(label);
  }
}

module.exports = Handler;
