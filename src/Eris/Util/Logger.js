var config;
try {
  config = require(`${process.cwd()}/drooMConfig.json`);
} catch(err) { // eslint-disable no-empty
}

class Logger {
  log(message, level) {
    const date = new Date();
    const l = this.formatMessage(message, level, date);
    console.log(l);
  }
  formatMessage(message, level, date) {
    return `${date.toLocaleTimeString(config ? config.logger_date : "en-US")} [${level}] ${message}`;
  }
  logError(message) {
    return this.log(message, "ERROR");
  }
  logWarning(message) {
    return this.log(message, "WARNING");
  }
}

module.exports = new Logger();
