import sys
import re
from getpass import getpass
from db import DBConnection, app, bcrypt
from models import User


class CreateUser(DBConnection):
    email_regex = ('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+'
                   + '(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')

    def __init__(self):
        self.connect()

    def register(self):
        with app.app_context():
            print('Enter email address:'),
            email = input()

            match = re.match(self.email_regex, email)

            if not email:
                print('Email is required.')
                self.register()
            elif match is None:
                print('Invalid email.')
                self.register()

            user = User.query.filter_by(email=email).first()
            if user:
                print('Email is already taken.')
                self.register()

            password = getpass()

            confirm_password = getpass("Confirm password:")

            if not password:
                print('Password is required.')
                self.register()
            elif password == confirm_password:
                user = User(
                    email=email,
                    password=bcrypt.generate_password_hash(password
                                                           ).decode('utf-8'),
                    active=True)
                self.db.session.add(user)
                self.db.session.commit()
                print('User added.')
                sys.exit()
            else:
                print('Password did not matched.')
                self.register()


if __name__ == '__main__':
    create_user = CreateUser()
    create_user.register()
    sys.exit()
