const { readdirSync } = require("fs")
const { join } = require("path")
const filePath = join(__dirname, "..", "slash");

module.exports.run = (client) => {
    for (const cmd of readdirSync(filePath).filter(cmd => cmd.endsWith(".js"))) {
    }
}