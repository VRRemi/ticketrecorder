const mongoose = require("mongoose");

module.exports = async (client) => {
    client.user.setActivity(`/record`)
    require("../dashboard/index")(client);
    await mongoose.connect(client.config.mongodb. {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err) => {
        if (err) return console.error(err);
        console.log(`${client.user.username} database is connected...`)
    });

}
