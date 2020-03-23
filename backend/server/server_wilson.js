const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const users = require("./users");
const Agent= require('./Agent.js');
const list_of_queues = require("./create_queue_dict");
const all_agent= require('./AllAgents.js')
const port = 8080;
let Agent_class= new all_agent();
let all_specialities_queues = list_of_queues.all_queues;
let Agentspool= list_of_queues.agent;
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('SDKAngularSample'))
var agent
function matchAgent(speciality, user){
    //Todo match the agent and send the data to the front end. through SSE
    app.get('/new_customer',function(req,res){
        res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
        res.write('\n');
        
    })
    
}
rainbowsdk.events.on('rainbow_onready', () => {
    app.post('/AgentLogin', function(req,res) {
        console.log("Hello")
        console.log("Agent Login Request"+req.body)
        let recv = JSON.parse(JSON.stringify(req.body));
        var speciality = recv.speciality
        
        console.log("Requested speciality: ", speciality.toString());
        all_specialities_queues[speciality.toString()].addLimit(1);
        var msg= {status:"Successful"}
        agent = new Agent(speciality.toString, "available")
        Agentspool[speciality.toString]
        
        all_agents.add_agent(agent);
        agent.setId(all_agents.get_latest_id());

        msg.agent_id= all_agent.get_latest_id();
        res.status(200).send(msg)
    })
    app.post('/AgentLogout', function(req,res) {
        let recv = JSON.parse(JSON.stringify(req.body));
        let speciality= recv.speciality;
        let agent_id = recv.agent_id
        
    })
    app.post('/updateStatus', function(req,res) {
        
        let recv = JSON.parse(JSON.stringify(req.body));
        let speciality= recv.speciality;
        let agent_id = recv.agent_id
        
    })

    app.get('/getUserInfo', (req, res) => {
        let result = rainbowsdk.presenceService.getUserConnectedPresence()
        console.log(result);
        res.send("OK");
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
        let currentUser_email =req.query.speciality;
        let currentUser;
        agent.dequeue()
        console.log("I am agent with the skill: " + speciality.toString() + ".");

        if (all_specialities_queues[speciality.toString()].emptyQueue() === true) {
            res.send("Empty queue now for " + speciality.toString() + " related request.");
        } else {
            currentUser_email += all_specialities_queues[speciality.toString()].getFront(); 
            currentUser = {email: currentUser_email};
            all_specialities_queues[speciality.toString()].dequeue();
            matchAgent(speciality,user_1)
            /* send back the user email to agent to start conversation */
            res.status(200).json(currentUser);
            console.log(all_specialities_queues);
        }
    })

    app.post('/deleteAccount', (req, res) => {
        let post_data= JSON.parse(req.body)
        let user_email = post_data.email;
        let speciality = post_data.speciality;
        let agent_id= post_data.agent_id;
        let agent= Agent_class.get_agent(agent_id);
        agent.end_conversation(user_email)
        queue = all_specialities_queues[speciality.toString()]
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
                    console.log("User with id ", user_id.toString(), " is successfully deleted!");
                }).catch((err) => {
                    throw err;
                })
            } else {
                console.log("Fail")
            }
        }).catch((err) => {
            throw err;
        })
        
    let user_detial= agent.dequeue(queue)
    if(user_detial!=NaN){
        user_detial.status='Success'
        res.send(user_detial)
    }
    })
    app.get('/getUserAccount', (req, res) => {
        let speciality = req.query.speciality;
        let queue_slot_available = false;
        let first_name= req.query.FirstName;
        let last_name= req.query.LastName;
        let paswd="aPassword_123"

        console.log("Requested speciality: ", speciality.toString());

        /* Check if the requested speciality queue have any available slot currently */
        if (all_specialities_queues[speciality.toString()].emptyslots()>0) {
            queue_slot_available = true;
        }
        if (queue_slot_available === true) {
            var emaildetail  = (+new Date).toString(36)+"@someemail.com";  
            let normalAcc = {status: "Success",email: emaildetail, password: paswd};

            rainbowsdk.admin.createUserInCompany(emaildetail, paswd ,first_name,last_name).then((user) => {
                console.log("Account successfully created!");

                /* enqueue the created account to the correspond speciality queue */
                
                console.log(all_specialities_queues[speciality.toString()].emptyslots());
                if(all_specialities_queues[speciality.toString()].isEmpty()){
                    //try assign to the most available agent . 
                }
                if(all_specialities_queues[speciality.toString()].enqueue(normalAcc)){

                console.log("Queue latest status: ", all_specialities_queues);
                res.status(200).json(normalAcc);
                }
                else{
                    console.log("create account fails")
                }
            }).catch((err) => {
                normalAcc = {status: "Fail",};
                res.send(JSON.stringify(normalAcc))
                throw err;
            })
            
        }
          
       else {
           normalAcc = {status: "Fail",};
           res.send(JSON.stringify(normalAcc))
        }
    })
})
app.listen(port, () => {
    console.log("The server is running now!");
});

rainbowsdk.start();