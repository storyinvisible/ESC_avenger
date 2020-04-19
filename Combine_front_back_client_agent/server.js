const express = require("express");
const app = express();
const RainbowSDK = require("rainbow-node-sdk");
const configure = require("./configuration");
const rainbowsdk = new RainbowSDK(configure.options);
const users = require("./users");
const guest_user = require("./guest_names_generator");
const port = 8080;
const Queue= require("./Queue.js")
var queue = new Queue();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "127.0.0.1:8080"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/',function(req,res) {
  res.sendFile('index.html');
});
rainbowsdk.events.on('rainbow_onready', () => {

    
    app.get('/getAcc', (req, res) => {
/*        let email_lists = users.getALlEmails();
        rainbowsdk.admin.getAllUsers().then((user) => {
            console.log("All users' email retreived!");
            let available_acc_position = 0;
            let found_available = false;
            for (let i = 0; i < email_lists.length; i++) {
                let stop_searching = true;
                for (let j = 0; j < user.length; j++) {
                    console.log(email_lists[i])
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
                let acc = users.userList[targeted_acc];*/
            userreq=req.body
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
/*var data1={
    FirstName: "Huang",
    LastName: "Zhibo", 
  	speciality:"finance"
}

var user_detail={}
var post_message={
    type: 'GET',
    data: data1,
    contentType: 'application/json',
    url:'http://localhost:8080/getUserAccount',
    async: false,
    dataType: 'json',
    };
var user_detail={}
post_message.success = function(data){
  console.log("Sucess");
  console.log(JSON.stringify(data));
  user_detail=data;
}

$.ajax(post_message)*/
var data1={
 
  	speciality:"finance"
}

var user_detail={}
var post_message={
    type: 'POST',
    data: JSON.stringify(data1),
    contentType: 'application/json',
    url:'http://localhost:8080/AgentLogin',
    async: false,
    dataType: 'json',
    };
var user_detail={}
post_message.success = function(data){
  console.log("Sucess");
  console.log(JSON.stringify(data));
  user_detail=data;
}

$.ajax(post_message)

//var data1={
//    FirstName: "Huang",
//    LastName: "Zhibo", 
//}
//
//var user_detail={}
//var post_message={
//    type: 'GET',
//    data: data1,
//    contentType: 'application/json',
//    url:'http://localhost:8080/getUserAccount',
//    async: false,
//    dataType: 'json',
//    };
//var user_detail={}
//post_message.success = function(data){
//  console.log("Sucess");
//  console.log(JSON.stringify(data));
//  user_detail=data;
//}
//
//$.ajax{post_message}
var data1={
    FirstName: "Huang",
    LastName: "Zhibo", 
   speciality:"finance",
   email:"k8qmo0xl@someemail.com",
  agent_id:1
}

var user_detail={}
var post_message={
    type: 'POST',
    data: JSON.stringify(data1),
    contentType: 'application/json',
    url:'http://localhost:3007/endconversation',
    async: false,
    dataType: 'json',
    };
var user_detail={}
post_message.success = function(data){
  console.log("Sucess");
  console.log(JSON.stringify(data));
  user_detail=data;
}

$.ajax(post_message)