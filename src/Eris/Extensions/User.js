module.exports = eris => {
  Object.defineProperty(eris.User.prototype, "tag", {
    get: function() {
      return `${this.username}$${this.discriminator}`;
    }
  });
  eris.User.prototype.createMessage = function(content, file) {
    return this.getDMChannel().then(channel => channel.createMessage(content, file));
  }
  return eris;
};
