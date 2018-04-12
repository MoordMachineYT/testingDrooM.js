class Collection extends Map {
  constructor(limit) {
    super();
    this.limit = typeof limit === "number" ? limit : "Infinity";
  }
  find(val) {
    for (const i of this.values()) {
      if (val(i)) return i;
    }
    return null;
  }
  findKey(val) {
    for (const i of this.entries()) {
      if (val(i[1])) return i[0];
    }
    return null;
  }
  set(id, val) {
    if (typeof id !== "string") Promise.reject(new TypeError("snowflake is not a string"));
    if (this.has(id)) Promise.reject(new Error(`snowflake ${id} is already used`));
    if (this.limit !== "Infinity" && this.size >= this.limit) Promise.reject(new Error("limit of properties reached, property cannot be stored"));
    super.set(id, val);
    return val;
  }
  map(val) {
    var arr = [];
    for (const i of this.values()) {
      arr.push(val(i));
    }
    return arr;
  }
  filter(val) {
    var arr = [];
    for (const i of this.values()) {
      if (val(i)) arr.push(i);
    }
    return arr;
  }
  update(id, val) {
    if (typeof id !== "string") Promise.reject(new TypeError("snowflake is not a string"));
    if (!this.has(id)) Promise.reject(new Error(`no value found with snowflake ${id}`));
    super.set(id, val);
    return val;
  }
  random() {
    return Array.from(this.values())[~~(Math.random() * this.size)];
  }
  randomKey() {
    return Array.from(this.keys())[~~(Math.random() * this.size)];
  }
}

module.exports = Collection;
