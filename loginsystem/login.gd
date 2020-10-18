extends Control

onready var register = get_parent().get_node("Register")
onready var http = get_parent().get_node("HTTPRequest")

func _on_register_button_down():
	hide()
	register.show()
	pass # Replace with function body.
