//@ts-check

const Client = require("../../Client");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    // console.log("oouugh")
    client.user.setActivity({
        name: "stevebotV5 in development :o",
        type: "WATCHING"
    })


}
