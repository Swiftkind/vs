from wtforms import Form, StringField, PasswordField, validators
from models.model import User


class LoginForm(Form):
    email = StringField()
    password = PasswordField()


class EditProfileForm(Form):
    email = StringField('Email address', [validators.DataRequired(), validators.Email()])
    first_name = StringField()
    last_name = StringField()


class EditPasswordForm(Form):
    old_password = PasswordField('Old Password', [
        validators.DataRequired()])
    password = PasswordField('New Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm_password', message='Passwords must match')
        ])
    confirm_password = PasswordField()