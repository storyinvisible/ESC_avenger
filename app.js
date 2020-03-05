var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var guest_user='';
var guest_password=''

var user_credentials = require("./rainbow_server");

app.use(express.static('SDKAngularSample'));
app.use(bodyParser.json());

/*
var user_detail={
    user: "some@email.com",
    password:"aPassword_123",
} */
app.post('/message', function(req, res){
    var obj={};
    console.log('body :'+ JSON.stringify(req.body));
    res.send(user_credentials.credentials);
})
app.listen(3001);