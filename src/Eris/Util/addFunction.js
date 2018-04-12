const fs   = require("fs");
const path = require("path");

/**
* Adds functions and properties to eris's prototype
* @param {*} eris The library
* @type {Function}
* @returns {*}
*/
function addFunctions(eris) {
  const files = fs.readdirSync(path.join(__dirname, "../Extensions"));
  files.forEach(async f()) => {
    eris = await require(`../Extensions/${f}`)(eris);
  });
  // Return the modified library
  return eris;
}

module.exports = addFunctions;
