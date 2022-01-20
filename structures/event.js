const { readdirSync } = require("fs");
const { join } = require("path");
const filePath = join(__dirname, "..", "events");

module.exports.run = (client) => {
    const eventFiles = readdirSync(filePath);
    }
