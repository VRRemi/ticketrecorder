const oauth2 = require('fastify-oauth2')
const config = require("../../../../config");

const discordoauth2 = (fastify, options, done) => {

    fastify.register(oauth2, {
        name: 'discordOAuth2',
        credentials: {
            client: {
                id: config.clientID,
                secret: config.clientSecret
            },
            auth: oauth2.DISCORD_CONFIGURATION
        },
        scope: ['identify'],
        startRedirectPath: '/auth',
        callbackUri: `${config.domain}/callback`
    })

