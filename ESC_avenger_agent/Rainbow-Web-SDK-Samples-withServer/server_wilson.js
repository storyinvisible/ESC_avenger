const express = require("express");
const app = express();
const client=express();
const bodyParser = require("body-parser");
const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const Agent= require('./Agent.js');
const list_of_queues = require("./create_queue_dict");
const all_agent= require('./AllAgents.js')
const port = 8080;
const events = require("events")
event_emit= new events();
let Agent_class= new all_agent();
let all_specialities_queues = list_of_queues.all_queues;
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('SDKAngularSample'))
app.use(express.static('SDKAngularSample'))
function matchAgent(speciality, ){
    console.log("Match agent is called")
    //Todo match the agent and send the data to the front end. through SSE
    const data = {
        spec: speciality,
        customer: user
    }
    let agent = Agent_class.getTheMostAvailableAgent(speciality)
    if(agent!=null){
        data= agent.dequeue(all_specialities_queues[speciality])
        if(data!=null){
            
            event_emit.emit("new_customer",data)
        }
    }
    
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

    app.post('/endconversation', function(req,res) {
        console.log("Ending Conversation")
       let post_data= JSON.parse(JSON.stringify(req.body));
        let user_email = post_data.email.toString();
        let speciality = post_data.speciality.toString();
        let agent_id= parseInt(post_data.agent_id.toString());
        let agent= Agent_class.getOneAgent(speciality,agent_id);
        let msg={status:"Fail"}
        agent.end_conversation(user_email)
        queue = all_specialities_queues[speciality.toString()]
        console.log("Deleting Account : "+user_email)
        rainbowsdk.admin.getAllUsers().then((user) => {
            let found_user = false;
            console.log("Find the deleting users")
            let user_id=''
            for (let i = 0; i < user.length; i++) {
                if (user[i].loginEmail == user_email.toString()) {
                    user_id += user[i].id;
                    found_user = true;
                    console.log("The deleted user found")
                    break;
                }
            }
            if (found_user === true) {
                rainbowsdk.admin.deleteUser(user_id).then((user) => {
                    console.log("User with id ", user_id.toString(), " is successfully deleted!");
                    msg.status= "Successful"
                    agent.end_conversation(user_email)
                   
                }).catch((err) => {
                    msg.status="Fail"
                    throw err;
                })
            } else {
                console.log("Fail")
            }
        }).catch((err) => {
             throw err;
         })
        
     let user_detail= agent.dequeue(queue)
     if(user_detail!=NaN){
         user_detail.status='Success'
         res.send(user_detail)
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
            console.log("there is a empty slot")
            queue_slot_available = true;
        }
        if (queue_slot_available === true) {
            var user_hash =(+new Date).toString(36)
            var emaildetail  =user_hash +"@someemail.com";  
            let normalAcc = {status: "Success",email: emaildetail, password: paswd,FirstName: first_name+user_hash};

            rainbowsdk.admin.createUserInCompany(emaildetail, paswd ,first_name+user_hash,last_name).then((user) => {
                console.log("Account successfully created!");

                /* enqueue the created account to the correspond speciality queue */
                
                console.log(all_specialities_queues[speciality.toString()].emptyslots());
                console.log("The queue is empty : "+ all_specialities_queues[speciality.toString()].isEmpty() )

                if(all_specialities_queues[speciality.toString()].enqueue(normalAcc)){

                console.log("Queue latest status: ", all_specialities_queues);
                res.status(200).json(normalAcc);
                }
                else{
                    console.log("create account fails")
                }
                if(all_specialities_queues[speciality.toString()].isEmpty()){
                    //try assign to the most available agent . 
                    matchAgent(speciality.toString(),first_name+user_hash)
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