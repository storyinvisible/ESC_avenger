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
let Agent_password="a_Password_123";
let agent1={
    email:"ironman@avenger.com",
    first_name: "Tony",
    LastName: "Stark"
}
let agent2={
    email:"black_widow@avenger.com",
    first_name:"Natasha",
    LastName:"Romanoff"
}
let agent3={
    email:"captain_america@avenger.com",
    first_name:"Steve",
    LastName :"Roger"
}
var agents_account=[agent1,agent2,agent3]
function matchAgent(speciality){
    console.log("Match agent is called for "+speciality.toString())
    //Todo match the agent and send the data to the front end. through SSE
    let agent = Agent_class.getTheMostAvailableAgent(speciality.toString())
    let queue= all_specialities_queues[speciality.toString()]
    console.log("queue size" +queue.size())
    if(agent!=null){
        var data_1= agent.dequeue(queue)
        data_1.agent_id=agent.getid();
        console.log(typeof(data_1))
        console.log("queue size " +queue.size())
        console.log("Matched and sending SSE " +data_1.email)
        event_emit.emit("new_customer",data_1)
        
    }
    else{
        console.log("There is no available Agent ")
    }
}

rainbowsdk.events.on('rainbow_onready', () => {
    rainbowsdk.admin.getAllUsers().then((user) => {
        let found_user = false;
        let user_id='';
        for (let i = 0; i < user.length; i++) {
            if (user[i].loginEmail != "storyinvisible@gmail.com" && user[i].loginEmail !="black_widow@avenger.com"
            &&user[i].loginEmail=="captain_america"&&user[i].loginEmail !="ironman@avenger.com") {
                rainbowsdk.admin.deleteUser(user[i].id).then((user) => {
                    console.log("User with id ", user_id.toString(), " is successfully deleted!");
                }).catch((err) => {
                    throw err;
                })
            }
        }
        var i = 0;
        while(i<20000000){
            i++
        }
        for(let i =0; i<3;i++){
            console.log(agents_account[i].first_name)
            rainbowsdk.admin.createUserInCompany(agents_account[i].email, Agent_password ,agents_account[i].first_name,
                agents_account[i].LastName).then((user) => {

            }).catch((err) => {
                throw err;
            })

        }

        
    }).catch((err) => {
        throw err;
    })

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

        console.log(speciality.toString()+" Now we have slot : "+all_specialities_queues[speciality.toString()].emptyslots())
        msg.agent_id= agent.getid();
        res.status(200).send(msg)
    })
    app.post('/AgentLogout', function(req,res) {
        
        let recv = JSON.parse(JSON.stringify(req.body));
        let speciality= recv.speciality;
        let agent_id = recv.agent_id
        let queue= all_specialities_queues[speciality.toString()]
        try{
            console.log("Agent logout: " + "speciality: " + speciality.toString() + "agent ID: " + parseInt(agent_id));
            Agent_class.removeAgent(speciality.toString(), parseInt(agent_id))
            queue.addLimit(-1)
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
    app.get('/dequeue',  (req, res) => {
        let speciality = post_data.speciality;
        let agent_id= parseInt(post_data.agent_id.toString());
        let agent = Agent_class.getOneAgent(speciality.toString(),agent_id);
        let user_detail = agent.dequeue(all_specialities_queues[speciality.toString()])
        res.send(user_detail)
    })
    app.post('/endconversation', (req, res) => {
        let post_data= JSON.parse(JSON.stringify(req.body))
        let user_email = post_data.email;
        let speciality = post_data.speciality;
        let agent_id= parseInt(post_data.agent_id.toString());
        console.log("End conversation request from agent_id : " + agent_id+" with speciality: "+speciality.toString())
        console.log("End conversation request for customer with email: " + user_email);
        let agent= Agent_class.getOneAgent(speciality.toString(), agent_id);
        console.log("Going to close conversation!\n")
        agent.end_conversation(user_email)
        queue = all_specialities_queues[speciality.toString()]
        rainbowsdk.admin.getAllUsers().then((user) => {
            let found_user = false;
            let user_id='';
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
                console.log("Delete users "+user_id.toString+"Fail")
            }
        }).catch((err) => {
            throw err;
        })
        
    if(!queue.isEmpty()){
        console.log("Specialty "+speciality.toString()+"Is not empty Match agent agin ")
        matchAgent(speciality);
    }
    res.sendStatus(200)
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
            var hashcoode=(+new Date).toString(36)
            var emaildetail  = hashcoode+"@someemail.com";  
            let normalAcc = {status: "Success", email: emaildetail, password: paswd,FirstName: first_name+hashcoode};

            rainbowsdk.admin.createUserInCompany(emaildetail, paswd ,first_name+hashcoode,last_name).then((user) => {
                console.log("Account successfully created!");
                normalAcc.user_id=user.id;
                /* enqueue the created account to the correspond speciality queue */
                
                console.log(all_specialities_queues[speciality.toString()].emptyslots());
                console.log("The queue is empty : "+ all_specialities_queues[speciality.toString()].isEmpty() )
                normalAcc.speciality=speciality.toString()
                console.log("The email " +normalAcc.email)
                if(all_specialities_queues[speciality.toString()].enqueue(normalAcc)){

                console.log("Queue latest status: ", all_specialities_queues);
                res.status(200).json(normalAcc);
                }
            
                
                if(all_specialities_queues[speciality.toString()].size()==1){
                    //try assign to the most available agent . 
                    matchAgent(speciality.toString())
                }
            }).catch((err) => {
                console.log("Create Account "+first_name+" failed")
                normalAcc = {status: "Fail",};
                res.status(505)
                throw err;
            })
            
        }
          
       else {
           console.log("Queue is full, no slot ")
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