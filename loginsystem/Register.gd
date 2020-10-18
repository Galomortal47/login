extends Control

onready var login = get_parent().get_node("Login")
onready var http = get_parent().get_node("HTTPRequest")

func _on_login_button_down():
	hide()
	login.show()
	pass # Replace with function body.

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
	data.username = get_node("username").get_text()
	data.email = get_node("email").get_text()
	data.password = get_node("password").get_text()
	data.password2 = get_node("password2").get_text()
	data.operation = "register"
	randomize()
	data.salt = str(int(rand_range(10000000,99999999)))
	if data.password != data.password2:
		get_node("AcceptDialog").set_text('password doesent match')
		get_node("AcceptDialog").popup_centered(Vector2(180,60))
		get_node("AcceptDialog").show()
		return
	if data.password.length() < 3:
		get_node("AcceptDialog").set_text('password is too short the minimum is 8 digits')
		get_node("AcceptDialog").popup_centered(Vector2(150,60))
		get_node("AcceptDialog").show()
		return
	if data.username.length() < 1 or data.email.length() < 1:
		get_node("AcceptDialog").set_text('username and email are obligatory')
		get_node("AcceptDialog").popup_centered(Vector2(150,60))
		get_node("AcceptDialog").show()
	var hasher = data.password.sha256_text()
	var salt = data.username.sha256_text()
	data.hash_and_salt = (hasher+salt).sha256_text()
	data.password = ""
	data.password2 = ""
	http._send_data(data)
	pass # Replace with function body.
