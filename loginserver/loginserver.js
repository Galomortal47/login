var express = require('express');
var app = express();
const mongoose = require("mongoose");
const sha256 = require("sha256");


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

var user_salt = {};

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
		console.log(jsonObj.operation);
		if (jsonObj.operation == "login"){
				//console.log(jsonObj.username);
				UserData.find(
				{username: jsonObj.username}
				, function(err, docs){
					//console.log(docs);
					if(docs.length == 0){
						res.send('{"response": {"message": "user not found"}}');
						console.log("user not found");
					}else{
					let rand = Math.floor((Math.random() * 100000000) + 1);
					let salt = sha256(rand.toString());
					user_salt[jsonObj.username] = salt
					var aunt = (docs[0].user_password + salt)
					var auth = sha256(aunt);
					//console.log(salt);
					//console.log(auth);
					res.send('{"response": {"message": "connecting...", "auth": "'+ salt +'"}}');
					console.log("connecting..");
					}
				});
			}

		if (jsonObj.operation == "auth"){
			//console.log(jsonObj.username);
			UserData.find(
			{username: jsonObj.username}
			, function(err, docs){
				console.log(docs);
				if(docs.length == 0){
					res.send('{"response": {"message": "user not found"}}');
					console.log("user not found");
				}else{
				var aunt = (docs[0].user_password + user_salt[jsonObj.username])
				var auth = sha256(aunt);
				//console.log(salt);
				//console.log(auth);
				if (jsonObj.auth2 == auth){
						res.send('{"response": {"message": "Login Succesfully"}}');
						console.log("Login Succesfully");
					}
				}
			});
		}

		if (jsonObj.operation == "register"){
		new UserData(
			new_data
		).save(function (err){
			if(err){
				res.send('{"response": {"message": "Username Already Taken"}}');
				console.log("Username Already Taken")
			}
			else{
				res.send('{"response": {"message": "Registered Succesfully"}}');
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
