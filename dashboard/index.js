const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
    const { port } = require("../config");
    const fastify = require('fastify')({ logger: false });
    const { Liquid } = require("liquidjs");
    const path = require("path");

    const engine = new Liquid({
        root: path.join(__dirname, "components"),
        extname: ".liquid",
    });
