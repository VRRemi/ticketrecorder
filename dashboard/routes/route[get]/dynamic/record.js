let MSGS = require("../../../../models/msgs");
let moment = require ("moment-timezone");
let { markdown } = ("../../../../utils");
const iplocate = require("node-iplocate");

const index = async (fastify, options, done) => {
    fastify.get("/transcript/:record", async (req, res) => {
        if (!req.params.record) fastify.notFound(req, res)
        else {
            let record = await MSGS.findOne({ id: req.params.record })
            if (!record) fastify.notFound(req, res);
            else {
                if (record.messages.length <= 0) {
                    record.deleteOne();
                    fastify.notFound(req, res);
                } else {
                    let time_zone = await (await iplocate(req.headers['x-forwarded-for'] || req.connection.remoteAddress)).time_zone
                    await record.messages.map(async msg => {
                        msg.dateTz = moment.tz(msg.date, time_zone).format('DD/MM/YY hh:mm A');
                        msg.content = await markdown(msg.content);
                        msg.avatar = (await req.client.users.fetch(msg.author).catch(() => { })).displayAvatarURL();
                        msg.username = (await req.client.users.fetch(msg.author).catch(() => { })).username;
                        msg.media = msg.attachment?.endsWith(".mp4") ? "video" : msg.attachment?.endsWith(".mp3") ? "music" : "attach";

