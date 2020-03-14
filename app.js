var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var guest_user='';
var guest_password=''

var user_credentials = require("./rainbow_server");

app.use(express.static('SDKAngularSample'));
app.use(bodyParser.json());


var user_detail={
    user: "testzbacc@email.com",
    password:"supermanZB@01",
} 
app.get('/getAccount', function() {
    
})

app.post('/message', function(req, res){
    var obj={};
    console.log('body :'+ JSON.stringify(req.body));
    res.send(user_detail);
})
app.listen(3001);
