extends Control

onready var register = get_parent().get_node("Register")
onready var http = get_parent().get_node("HTTPRequest")

var data = {
"username":"",
"email":"",
"password":"",
"password2":"",
"salt":"",
"hash_and_salt":"",
"operation":""
}

func _on_register_button_down():
	hide()
	register.show()
	pass # Replace with function body.

func _authentication(auth_data):
	if auth_data.response.has("auth"):
		var hasher = get_node("password").get_text().sha256_text()
		var  username = get_node("username").get_text().sha256_text()
		var salt =  auth_data.response.auth
		var hash_and_salt = (hasher+username).sha256_text()
		var hash_and_salt2 = (hash_and_salt+salt).sha256_text()
		var senddata = {}
		senddata["username"] = get_node("username").get_text()
		senddata["auth2"] = hash_and_salt2
		senddata["operation"] = 'auth'
		get_parent().get_node("HTTPRequest")._send_data(senddata)

func _on_login_button_down():
	data.username = get_node("username").get_text()
	data.operation = "login"
#	data.password = get_node("password").get_text()
#	var hasher = data.password.sha256_text()
#	var salt = data.salt.sha256_text()
#	data.hash_and_salt = (hasher+salt).sha256_text()
#	data.password = ""
	http._send_data(data)
	pass # Replace with function body.

