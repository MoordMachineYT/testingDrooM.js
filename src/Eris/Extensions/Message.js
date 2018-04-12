module.exports = eris => {
  Object.defineProperty(eris.Message.prototype, "guild", {
    get: function() {
      return this.channel.guild;
    }
  });
  return eris;
};
