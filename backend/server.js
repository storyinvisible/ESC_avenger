const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const users = require("./users");
const Agent = require("./Agent");
const AllAgents = require("./AllAgents");
const list_of_queues = require("./create_queue_dict");
const port = 8080;

let all_specialities_queues = list_of_queues.all_queues;
let all_agents = new AllAgents();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

rainbowsdk.events.on('rainbow_onready', () => {

    app.post('/AgentLogin', function(req,res) {
        let speciality = req.body.speciality;
        let agent = new Agent(speciality.toString());
        all_agents.add_agent(agent);
        agent.setId(all_agents.get_latest_id());
    })

    app.get('/', (req, res) => {
        res.send("Rainbow server is alive")
    })

    app.get('/checkAllQueues', (req, res) => {
        res.status(200).json(all_specialities_queues);
        console.log(all_specialities_queues);
    })

    app.get('/checkOneQueue', (req, res) => {
        let speciality = req.query.speciality;
        let result_queue = all_specialities_queues[speciality.toString()];
        res.status(200).json(result_queue);
        console.log(result_queue);
    })

    app.get('/dequeueAccount', (req, res) => {
        let speciality = req.query.speciality;
        let currentUser_email = "";
        let currentUser;

        console.log("I am agent with the skill: " + speciality.toString() + ".");

        if (all_specialities_queues[speciality.toString()].emptyQueue() === true) {
            res.send("Empty queue now for " + speciality.toString() + " related request.");
        } else {
            currentUser_email += all_specialities_queues[speciality.toString()].getFront(); 
            currentUser = {email: currentUser_email};
            all_specialities_queues[speciality.toString()].dequeue();

            /* send back the user email to agent to start conversation */
            res.status(200).json(currentUser);
            console.log(all_specialities_queues);
        }
    })

    app.post('/deleteAccount', (req, res) => {
        let user_email = req.body.email;
        let user_id = "";
        rainbowsdk.admin.getAllUsers().then((user) => {
            let found_user = false;
            for (let i = 0; i < user.length; i++) {
                if (user[i].loginEmail == user_email.toString()) {
                    user_id += user[i].id;
                    found_user = true;
                    break;
                }
            }
            if (found_user === true) {
                rainbowsdk.admin.deleteUser(user_id).then((user) => {
                    res.send("User successfully deleted!");
                    console.log("User with id ", user_id.toString(), " is successfully deleted!");
                }).catch((err) => {
                    throw err;
                })
            } else {
                res.send("The user doesn't exist.");
            }
        }).catch((err) => {
            throw err;
        })
    })
    
    app.get('/getUserAccount', (req, res) => {
        let speciality = req.query.speciality;
        let queue_slot_available = false;

        console.log("Requested speciality: ", speciality.toString());

        /* Check if the requested speciality queue have any available slot currently */
        if (all_specialities_queues[speciality.toString()].checkQueueStatus() === true) {
            queue_slot_available = true;
        }

        if (queue_slot_available === true) {
            let email_lists = users.getALlEmails();
            rainbowsdk.admin.getAllUsers().then((user) => {
                console.log("All users' email retreived!");
                let available_acc_position = 0;
                let found_available = false;
                for (let i = 0; i < email_lists.length; i++) {
                    let stop_searching = true;
                    for (let j = 0; j < user.length; j++) {
                        if (email_lists[i] == user[j].loginEmail) {
                            /* if the current email is already in the company list, continue searching */
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

                        /* enqueue the created account to the correspond speciality queue */
                        all_specialities_queues[speciality.toString()].enqueue(acc.userEmail);

                        console.log("Queue latest status: ", all_specialities_queues);
                        res.status(200).json(normalAcc);
                    }).catch((err) => {
                        throw err;
                    })
                }
            }).catch((err) => {
                throw err;
            })
        } else {
            res.send("Sorry, please come back later!");
        }
    });
})

app.listen(port, () => {
    console.log("The server is running now!");
});

rainbowsdk.start();