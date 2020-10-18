var express = require('express');
var app = express();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/game_server_test_4", {
	useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
	console.log("MongoDB had connected");
}).catch((err) => {
	console.log("an error had ocurred: " + err);
});

// schema for the database
const userDataSchema = mongoose.Schema({
	// _id: Number,
	username: {type: String, required: true, index : {unique: true}},
	user_password: {type: String, required: true},
	email: {type: String, required: true},
  salt: {type: String, required: true},
	content: Object
}, {collection: 'user_Data'});

var UserData = mongoose.model('userData', userDataSchema);


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

		if (jsonObj.operation == "login"){
				//console.log(jsonObj.username);
				UserData.find(
				{username: jsonObj.username}
				, function(err, docs){
					console.log(docs);
				});
				res.send('{"response": "connecting..."}');
			}

		if (jsonObj.operation == "register"){
		new UserData(
			new_data
		).save(function (err){
			if(err){
				res.send('{"response": "Username Already Taken"}');
				console.log("Username Already Taken")
			}
			else{
				res.send('{"response": "Registered Succesfully"}');
				console.log("Registered Succesfully")
			}});
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
