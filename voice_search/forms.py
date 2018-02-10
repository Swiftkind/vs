from wtforms import Form, StringField, PasswordField


class LoginForm(Form):
    email = StringField()
    password = PasswordField()