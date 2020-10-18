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
    let str = req.originalUrl.toString()
    let jsonObj = JSON.parse(str.slice(1,str.length));
		let new_data = {};
    new_data["username"] = jsonObj.username
    new_data["user_password"] = jsonObj.hash_and_salt
    new_data["email"] = jsonObj.email
  	new_data["salt"] = jsonObj.salt
		let login_operation = db.read({username: jsonObj.username});
		let json = JSON.stringify(login_operation);
		if(json == "{}" || json == "[]"){
    	 db.create(new_data);
			 res.send('{"response": "Registered Succesfully"}');
			 console.log("Registered Succesfully")
    }else{
			res.send('{"response": "Username Already Taken"}');
			console.log("Username Already Taken")
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
