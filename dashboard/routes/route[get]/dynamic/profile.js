let MSGS = require("../../../../models/msgs");

const index = async(fastify, options, done) => {
    fastify.get("/profile", async(req, res) => {
        if (!(await req.user)) res.redirect("/auth");
        else {
            let ids = []
            await (await MSGS.find({})).filter(message => {
                message.messages.map(async msg => {
                    if (msg.author == (await req.user).id) return !ids.includes(message.id) ? ids.push(message.id) : ""
};
