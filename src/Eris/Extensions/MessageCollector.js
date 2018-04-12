const EventEmitter = require("events").EventEmitter;

class MessageCollector extends EventEmitter {
  constructor(channel, filter, options) {
    super();
    this.filter = filter;
    this.channel = channel;
    this.options = options;
    this.bot = channel.guild ? channel.guild.shard.client : channel._client;
    this.collected = [];
    this.func = m => this.messageCheck(m);
    this.bot.on("messageCreate", this.func);
    if (this.options.time) setTimeout(() => this.stop("time"), this.options.time);
  }
  messageCheck(message) {
    if (message.channel.id !== this.channel.id) return;
    if (this.filter(message)) {
      this.collected.push(message);
      this.emit("message", message);

      if (this.collected.length >= this.options.limit) {
        this.stop("limit reached");
      }
      return true;
    }
    return false;
  }
  stop(reason) {
    if (this.end) return;
    this.end = true;
    this.emit("end", this.collected, reason);
    this.bot.removeListener("messageCreate", this.func);
  }
}

module.exports = eris => {
  eris.Channel.prototype.awaitMessages = function(filter, options) {
    const collector = new MessageCollector(this, filter, options);
    return new Promise(res => {
      collector.on("end", res);
    });
  };
};
