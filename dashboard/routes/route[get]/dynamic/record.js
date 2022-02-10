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

                        msg?.content?.split("<")?.map(async m => {
                            let emoji = m?.split(">")[0]?.split(":");
                            if (emoji[2]) msg.content = msg.content?.replace(`<${m?.split(">")[0]}>`, `<img src="https://cdn.discordapp.com/emojis/${emoji[2]}.webp?size=44&quality=lossless" class="inline-block w-7 h-7" alt="emoji">`)
                        })
                        msg?.content?.split("<@")?.map(async m => {
                            let mention = m?.split(">")[0];
                            if (mention) {
                                let user = (await req.client.users.fetch(mention?.split("!")?.join("")).catch(() => { }))?.username ?? mention;
                                msg.content = msg.content?.replace(`<@${mention}>`, `<a target="_blank" href="https://discord.com/users/${mention?.split("!")?.join("")}" class="bg-blurple-200 text-blurple-300 rounded px-1 hover:underline">@${user}</a>`)
                            }
                        })
                    })
                    req.render("/dynamic/records.liquid", {
                        msgs: await record.messages,
                        guild: req.client.guilds.cache?.get(await record.guild)?.name ?? "Unknown",
                        channel: req.client.channels.cache?.get(await record.channel)?.name ?? "Unknown",
                        author: (await req.client.users.fetch(await record.author).catch(() => { }))?.username ?? "Unknown"
                    });
                };
            };
        };
    });

    done()
};

module.exports = index;