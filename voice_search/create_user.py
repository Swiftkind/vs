from getpass import getpass
import sys

from flask import current_app
from database import app, db
from models.model import User
from passlib.hash import pbkdf2_sha512

def main():
    """Main entry point for script."""
    with app.app_context():
        db.metadata.create_all(db.engine)

        print('Enter email address: '),
        email = raw_input()

        users = User.query.all()

        for user in users:
            if user.email == email:
                print('Email is already taken.')
                main()
            elif not email:
                print('Email is required.')
                main()

        password = getpass()

        confirm_password = getpass()

        if not password:
            print('Password is required .') 
            main()
        elif password == confirm_password:
            user = User(
                email=email, 
                password=pbkdf2_sha512.hash(password),
                active=True)
            db.session.add(user)
            db.session.commit()
            print ('User added.')
            sys.exit()
        else:
            print('Password did not matched.') 
            main()


if __name__ == '__main__':
    sys.exit(main())