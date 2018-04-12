module.exports = eris => {
  Object.defineProperty(eris.Guild.prototype, "me", {
    get: function() {
      return this.members.get(this.shard.client.user.id);
    }
  });
  return eris;
};
