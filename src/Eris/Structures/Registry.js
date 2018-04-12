"use strict";

const fs       = require("fs");
const path     = require("path");

const Command  = fs.readFileSync(path.join(__dirname, "../Presets/Classes/Command.js"), "utf8");
const fCommand = fs.readFileSync(path.join(__dirname, "../Presets/Functions/Command.js"), "utf8");
const ev       = fs.readFileSync(path.join(__dirname, "../Presets/Functions/Event.js"), "utf8");

class Registry {
  constructor(commandPath, eventPath) {
    this.commandPath = commandPath;
    this.eventPath = eventPath;
    this.settings = this.config();
  }
  config() {
    var config;
    try {
      config = JSON.parse(fs.readFileSync(process.cwd() + "/drooMConfig.json", "utf8"));
    } catch(err) {
      config = this.write("config");
    }
    return config;
  }
  write(type, options) {
    var data, path;

    // Writing a config file
    if (type === "config") {
      data = {
        commandType: "function",
        eventType: "function",
        logger_date: "en-US"
      };
      fs.writeFileSync(process.cwd() + "/drooMConfig.json", JSON.stringify(data, null, 2));
      return JSON.parse(fs.readFileSync(process.cwd() + "/drooMConfig.json", "utf8"));
    }

    // Writing a command file
    if (type === "command") {
      if (!options.path) {
        path = this.commandPath;
      } else path = options.path;
      if (options.type === "class") {
        fs.writeFileSync(path, Command);
      } else if (options.type === "function") {
        fs.writeFileSync(path, fCommand);
      }
      return path;
    }

    // Writing an event handler file
    if (type === "event") {
      fs.writeFileSync(this.eventPath, ev);
    }
  }
}
