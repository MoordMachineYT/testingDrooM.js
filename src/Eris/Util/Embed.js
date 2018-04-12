class Embed {
  constructor() {
    this.fields = [];
    return this;
  }
  addField(name, value) {
    if (typeof name !== "string") Promise.reject(new TypeError("name must be a string"));
    if (typeof value !== "string") Promise.reject(new TypeError("value must be a string"));
    this.fields.push({
      name,
      value,
      inline: false
    });
    return this;
  }
  addInlineField(name, value) {
    if (typeof name !== "string") Promise.reject(new TypeError("name must be a string"));
    if (typeof value !== "string") Promise.reject(new TypeError("value must be a string"));
    this.fields.push({
      name,
      value,
      inline: true
    });
    return this;
  }
  setAuthor(name, icon_url, url) {
    this.author = {
      name,
      url,
      icon_url
    };
    return this;
  }
  setImage(img) {
    this.image = {
      url: img
    };
    return this;
  }
  setThumbnail(img) {
    this.image = {
      url: img
    };
    return this;
  }
  setTitle(title) {
    this.title = title;
    return this;
  }
  setFooter(text, img) {
    this.footer = {
      text,
      icon_url: img
    };
    return this;
  }
  setTimestamp(time) {
    this.timestamp = time;
    return this;
  }
}

module.exports = Embed;
