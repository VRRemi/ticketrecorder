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

    fastify.register(require('fastify-formbody'))
    
    require("./routes.json").map(route => {
        fastify.register(require(route));
    })

    fastify.register(require('fastify-static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/public/'
    });

    fastify.register(require("point-of-view"), {
        engine: {
            liquid: engine,
        },
    });

    fastify.register(require('fastify-secure-session'), {
        cookieName: 'connect.sid',
        secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
        cookie: {
            path: '/',
            maxAge: 86400000000
        },
        saveUninitialized: false
    });
