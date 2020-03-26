// Define your configuration
let options =  {
    "rainbow": {
        //        "host": "official",                      // Can be "sandbox" (developer platform), "official" or any other hostname when using dedicated AIO
                "host": "sandbox"                      // Can be "sandbox" (developer platform), "official" or any other hostname when using dedicated AIO
    },
    "credentials": {
        "login": "li.jiaxi97@gmail.com",  // The Rainbow email account to use
        "password": "P#uc9O6nLf(6"   // The Rainbow associated password to use
    },
    // Application identifier

    "application": {
        "appID": "e78b583059f511eabf7e77d14e87b936", // Need to create your own application on the hub.openrainbow.com platform
        "appSecret": "U3LdMSRdTzkjDbCkKajXWSQj3URPO5EfQStjACIVQLHsc45WQOc6v0dpWxusgSnv"
    },
    // */

    // Proxy configuration
    /*"proxy": {
        "host": "xx.xx.xx.xx",
        "port": 8080,
        "protocol": "http"
    }, // */

    // Logs options
    "logs": {
        "enableConsoleLogs": true,              // Default: true
        "enableFileLogs": false,                // Default: false
        "color": true,
        "level": "info",
        "customLabel": "StarterKit",
        "system-dev": {
            "internals": false,
            "http": false
        }, // */
        "file": {
            "path": "d:\\SUTD",     // Default path used
            "customFileName": "R-SDK-Node-StarterKit",
            //"level": 'info',                    // Default log level used
            "zippedArchive" : false
        }
    },
    // IM options
    "im": {
        "sendReadReceipt": false,   // True to send the 'read' receipt automatically
        "messageMaxLength": 1024,
        "sendMessageToConnectedUser": true,
        "conversationsRetrievedFormat": "small",
        "storeMessages": false,
        "nbMaxConversations": 15,
        "rateLimitPerHour": 1000
    }
}

module.exports = {
    options
}