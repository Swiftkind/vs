import sys
from getpass import getpass
from app import db, app, bcrypt
from models.model import User


def register():
    """Main entry point for script."""
    with app.app_context():
        db.metadata.create_all(db.engine)

        print('Enter email address: '),
        email = raw_input()
        users = User.query.all()

        for user in users:
            if user.email == email:
                print('Email is already taken.')
                register()
            elif not email:
                print('Email is required.')
                register()

        password = getpass()

        confirm_password = getpass()

        if not password:
            print('Password is required .') 
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