const { Schema, model } = require("mongoose");

module.exports = model("msgs", new Schema({
    id: { type: String, default: "" },
    guild: { type: String, default: "" },
    channel: { type: String, default: "" },
    author: { type: String, default: "" },
    messages: { type: Object, default: {}},
    date: { type: Number, default: Date.now()}
}));