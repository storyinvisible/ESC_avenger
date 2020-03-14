const express = require("express");
const app = express();
const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const users = require("./users");
const guest_user = require("./guest_names_generator");
const port = 8080;

rainbowsdk.events.on('rainbow_onready', () => {
    app.get('/', (req, res) => {
        res.send("Index")
    })
    
    app.get('/getAcc', (req, res) => {
        let email_lists = users.getALlEmails();
        rainbowsdk.admin.getAllUsers().then((user) => {
            console.log("All users' email retreived!");
            let available_acc_position = 0;
            let found_available = false;
            for (let i = 0; i < email_lists.length; i++) {
                let stop_searching = true;
                for (let j = 0; j < user.length; j++) {
                    if (email_lists[i] == user[j].loginEmail) {
                        // if the current email is already in the company list, continue searching
                        stop_searching = false;
                        break;
                    }
                }
                if (stop_searching == true) {
                    available_acc_position += (i + 1);
                    found_available = true;
                    break;
                }
            }
            if (found_available == false) {
                res.send("Sorry, no available slot currently!");
            } else {
                let targeted_acc = "user";
                targeted_acc += available_acc_position.toString();
                let acc = users.userList[targeted_acc];
                let normalAcc = {login: acc.userEmail, password: acc.userPassword};
                rainbowsdk.admin.createUserInCompany(acc.userEmail, acc.userPassword, acc.userFirstname, acc.userLastname).then((user) => {
                    console.log("Account successfully created!");
                    res.status(200).json(normalAcc);
                }).catch((err) => {
                    throw err;
                })
            }
        }).catch((err) => {
            throw err;
        })
    });

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