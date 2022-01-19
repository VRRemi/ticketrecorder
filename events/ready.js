const mongoose = require("mongoose");

module.exports = async (client) => {
    client.user.setActivity(`/record`)
    
}
