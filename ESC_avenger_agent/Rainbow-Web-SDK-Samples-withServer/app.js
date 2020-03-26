var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cor = require('cors');

const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const users = require("./users");
const guest_user = require("./guest_names_generator");
const port = 8080;
const Queue= require("./Queue.js")
var queue = new Queue();


app.use(express.static('SDKAngularSample'));
app.use(bodyParser.json());
app.use(cor())

rainbowsdk.events.on('rainbow_onready', () => {

    
    app.get('/getAcc', (req, res) => {

            console.log(req.query)
            userreq=JSON.parse(req.query)
            let email= userreq.FirstName+"@"+userreq.LastName+'.com'
            let normalAcc = {login: email, password: "Hello123"};
            rainbowsdk.admin.createUserInCompany(acc.userEmail, acc.userPassword, acc.userFirstname, acc.userLastname).then((user) => {
                console.log("Account successfully created!");
                queue.enqueue(normalAcc);
                console.log(JSON.stringify(queue.getallitem))
                res.status(200).json(normalAcc);
            }).catch((err) => {
                throw err;
            })
        }
            )
 

    app.get('/getGuestAcc', (req, res) => {
        let guest_name = guest_user.generate_guest_name();
        let guest_first_name = guest_name.guestFirstName;
        let guest_last_name = guest_name.guestLastName;
        let language = "en-US";
        let ttl = 60;
        let guestAcc = {FirstName: guest_first_name, LastName: guest_last_name};
        rainbowsdk.admin.createGuestUser(guest_first_name, guest_last_name, language, ttl).then((guest) => {
            console.log("Guest account successfully created!");
            res.status(200).json(guestAcc);
        }).catch((err) => {
            throw err;
        })
    });
})

app.listen(port, () => {
    console.log("The server is running now!");
});

rainbowsdk.start();
