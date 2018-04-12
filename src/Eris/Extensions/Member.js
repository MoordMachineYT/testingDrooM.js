module.exports = eris => {
  Object.defineProperty(eris.Member.prototype, "highestRole", {
    get: function() {
      return this.roles.map(role => this.guild.roles.get(role)).sort((a, b) => a.position - b.position).reverse()[0];
    }
  });
  Object.defineProperty(eris.Member.prototype, "lowestRole", {
    get: function() {
      return this.roles.map(role => this.guild.roles.get(role)).sort((a, b) => a.position - b.position)[0];
    }
  });
  return eris;
}
