var express = require('express');
var app = express();
var database = require("./mongodb.js");
var db = new database();

const userDataSchema = {
	// _id: Number,
	username: "",
	user_password: "",
	email: "",
  salt: "",
	content: {}
};

// on the request to root (localhost:3000/)
app.get('*', function (req, res) {
    //console.log(req.originalUrl);
    var str = req.originalUrl.toString()
    var jsonObj = JSON.parse(str.slice(1,str.length));
    userDataSchema.username = jsonObj.username
    userDataSchema.user_password = jsonObj.hash_and_salt
    userDataSchema.email = jsonObj.email
    userDataSchema.salt = jsonObj.salt
    var error = db.create(userDataSchema);
    //console.log(error);
    if(!(error == null)){
      res.send('{"response": "Username Already Taken"}');
      console.log("Username Already Taken")
    }else{
      res.send('{"response": "Registered Succesfully"}');
      console.log("Registered Succesfully")
      }
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3000 !
app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});
