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
