const express = require("express");
const app = express();
const client= express();

const bodyParser = require("body-parser");
const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const users = require("./users");
const Agent= require('./Agent.js');
const list_of_queues = require("./create_queue_dict");
const all_agent= require('./AllAgents.js')
const port = 8080;
const client_port= 3007;
const events = require("events")
event_emit= new events();
let Agent_class= new all_agent();
let all_specialities_queues = list_of_queues.all_queues;
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('Agent'))

client.use(cors())
client.use(bodyParser.urlencoded({extended: false}));
client.use(bodyParser.json());
client.use(express.static('Client'))

function matchAgent(speciality, user){
    console.log("Match agent is called")
    //Todo match the agent and send the data to the front end. through SSE
    const data = {
        spec: speciality,
        customer: user
    }
    event_emit.emit("new_customer",data)
}

rainbowsdk.events.on('rainbow_onready', () => {
    // //test matchAgent
    // app.get('/new_customer',function(req,res){
    //     res.writeHead(200,{
    //     'Content-Type': 'text/event-stream',
    //     'Cache-Control': 'no-cache',
    //     'Connection': 'keep-alive',
    //     });
    //     const data = {
    //         spec: 'finance',
    //         customer: 'Zhibo Huang'
    //     }
    //     console.log("SSE---SSE---SSE");
    //     res.write(`data: ${JSON.stringify(data)} \n\n`);    
    // })  
    // // end of testing
    app.get('/new_customer',function(req,res){
        res.writeHead(200,{
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        });
        data={}
        console.log("SSE---SSE---SSE");
        event_emit.on("new_customer",(thedata)=>{
            console.log("new cutomer event !")
            console.log(thedata.customer)
            res.write(`data: ${JSON.stringify(thedata)} \n\n`);
            
        })
        res.write(`data: ${JSON.stringify(data)} \n\n`);
        res.write(`data: Hello World! ${JSON.stringify(data)} \n\n`);    
    }) 
    app.post('/AgentLogin', function(req,res) {
        console.log("Hello")
        console.log("Agent Login Request"+req.body)
        let recv = JSON.parse(JSON.stringify(req.body));
        var speciality = recv.speciality
        
        console.log("Requested speciality: ", speciality.toString());
        all_specialities_queues[speciality.toString()].addLimit(1);
        var msg= {status:"Successful"}
        let agent = new Agent(speciality.toString())
        Agent_class.addAgent(agent)
        console.log("Now we have slot : "+all_specialities_queues[speciality.toString()].emptyslots())
        msg.agent_id= agent.getid();
        res.status(200).send(msg)
    })
    app.post('/AgentLogout', function(req,res) {
        let recv = JSON.parse(JSON.stringify(req.body));
        let speciality= recv.speciality;
        let agent_id = recv.agent_id
        try{
            Agent_class.removeAgent(speciality.toString, parseInt(agent_id))
            res.send({status:"Sucessful"})
            
        }catch(err){
            res.send({status:"Fail"})

        }
        
    })
    app.post('/updateStatus', function(req,res) {
        
        let recv = JSON.parse(JSON.stringify(req.body));
        let speciality= recv.speciality;
        let agent_id = recv.agent_id
        let status= recv.status;
        try{
            Agent_class.updateAgentstatus(speciality.toString, agent_id.toString,status.toString )
            var message={status: "Successful"}
            res.send(message)
        }catch(err){
            res.send({status: "Fail"})
        }

        
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


    app.post('/endconversation', (req, res) => {
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
    client.get('/getUserAccount', (req, res) => {
        let speciality = req.query.speciality;
        let queue_slot_available = false;
        let first_name= req.query.FirstName;
        let last_name= req.query.LastName;
        let paswd="aPassword_123"

        console.log("Requested speciality: ", speciality.toString());

        /* Check if the requested speciality queue have any available slot currently */
        if (all_specialities_queues[speciality.toString()].emptyslots()>0) {
            console.log("there is a empty slot")
            queue_slot_available = true;
        }
        if (queue_slot_available === true) {
            var emaildetail  = (+new Date).toString(36)+"@someemail.com";  
            let normalAcc = {status: "Success",email: emaildetail, password: paswd};

            rainbowsdk.admin.createUserInCompany(emaildetail, paswd ,first_name,last_name).then((user) => {
                console.log("Account successfully created!");

                /* enqueue the created account to the correspond speciality queue */
                
                console.log(all_specialities_queues[speciality.toString()].emptyslots());
                console.log("The queue is empty : "+ all_specialities_queues[speciality.toString()].isEmpty() )
                if(all_specialities_queues[speciality.toString()].isEmpty()){
                    //try assign to the most available agent . 
                    matchAgent(speciality.toString(),first_name)
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
client.listen(client_port, () => {
    console.log("The server is running now!");
});

rainbowsdk.start();