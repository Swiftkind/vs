import sys
import re
from getpass import getpass
from app import db, app, bcrypt
from models.model import User


def register():
    """Main entry point for script."""

    email_regex = '^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$'

    with app.app_context():
        db.metadata.create_all(db.engine)

        print('Enter email address:'),
        email = raw_input()
        users = User.query.all()

        match = re.match(email_regex, email)

        if not email:
            print('Email is required.')
            register()
        elif match == None:
            print('Invalid email.')
            register()

        for user in users:
            if user.email == email:
                print('Email is already taken.')
                register()

        password = getpass()

        confirm_password = getpass("Confirm password:")

        if not password:
            print('Password is required.') 
            register()
        elif password == confirm_password:
            user = User(
                email=email, 
                password=bcrypt.generate_password_hash(password),
                active=True)
            db.session.add(user)
            db.session.commit()
            print ('User added.')
            sys.exit()
        else:
            print('Password did not matched.') 
            register()

if __name__ == '__main__':
    register()
    sys.exit()