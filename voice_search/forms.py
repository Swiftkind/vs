from wtforms import Form, StringField, PasswordField, validators
from .models import User
from .db import bcrypt


class LoginForm(Form):
    email = StringField()
    password = PasswordField()


class EditProfileForm(Form):
    email = StringField('Email address', [validators.DataRequired(),
                        validators.Email()])
    first_name = StringField()
    last_name = StringField()


class EditPasswordForm(Form):
    old_password = PasswordField('Old Password', [validators.Required()])
    password = PasswordField('New Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm_password', message='Passwords must match')
        ])
    confirm_password = PasswordField()

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)
        self.user = kwargs['user']

    def validate(self):
        form_validate = Form.validate(self)
        if not form_validate:
            return False
        user = User.query.get(self.user.id)
        if not bcrypt.check_password_hash(user.password,
                                          self.old_password.data):
            self.old_password.errors.append('Wrong old password')
            return False

        self.user = user
        return True
