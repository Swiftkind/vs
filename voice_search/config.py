import datetime
import os

# Name of audio file
KEY = 'audio ' + str(datetime.datetime.now())
# Secret key of flask app
SECRET_KEY = os.urandom(24)
# S3 bucket name
BUCKET_NAME = 'search.audio'


# DATABASE
DATABASE = {
    'SQLALCHEMY_DATABASE_URI':'sqlite:///app.db',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
}

# Flask-Security config
SECURITY_URL_PREFIX = "/admin"
SECURITY_PASSWORD_HASH = "pbkdf2_sha512"
SECURITY_PASSWORD_SALT = "ATGUOHAELKiubahiughaerGOJAEGj"

# Flask-Security URLs, overridden because they don't put a / at the end
SECURITY_LOGIN_URL = "/login/"
SECURITY_LOGOUT_URL = "/logout/"
SECURITY_REGISTER_URL = "/register/"

SECURITY_POST_LOGIN_VIEW = "/admin/"
SECURITY_POST_LOGOUT_VIEW = "/admin/"
SECURITY_POST_REGISTER_VIEW = "/admin/"

# Flask-Security features
SECURITY_REGISTERABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SQLALCHEMY_TRACK_MODIFICATIONS = False