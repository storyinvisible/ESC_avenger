let RainbowSDK = require("rainbow-node-sdk");
let configure = require("./configuration");
let users = require("./users");
let rainbowsdk = new RainbowSDK(configure.options);

let credentials = {};
let userID = "";

rainbowsdk.events.on('rainbow_onstarted', () => {
    console.log("On Started!");
})

rainbowsdk.events.on('rainbow_onconnected', () => {
    console.log("On Connected!");
});

rainbowsdk.events.on('rainbow_onready', () => {
    console.log("On Ready!");
    let acc = users.userList.user1;
    rainbowsdk.admin.createUserInCompany(acc.userEmail, acc.userPassword, acc.userFirstname, acc.userLastname)
    .then((user) => {
        credentials.Login = acc.userEmail;
        credentials.Password = acc.userPassword;
        userID += user.jid_im;
        console.log(credentials);
        console.log(userID);
    }).catch((err) => {
        throw err;
    })
});

rainbowsdk.events.on('rainbow_ondisconnected', () => {
    console.log("on disconnected!");
})

rainbowsdk.events.on('rainbow_onstopped', () => {
    console.log("on stopped");
})

rainbowsdk.start();

module.exports = {
    credentials
}