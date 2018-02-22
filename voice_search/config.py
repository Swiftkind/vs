import datetime
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Name of audio file
KEY = 'audio ' + str(datetime.datetime.now())
# Secret key of flask app
SECRET_KEY = os.urandom(24)
# S3 bucket name
BUCKET_NAME = 'search.audio'

# Flask-Security config
SECURITY_URL_PREFIX = "/admin"

# Flask-Security URLs, overridden because they don't put a / at the end
SECURITY_LOGOUT_URL = "/logout/"

SECURITY_POST_LOGIN_VIEW = "/admin/"
SECURITY_POST_LOGOUT_VIEW = "/admin/"
SECURITY_POST_REGISTER_VIEW = "/admin/"

# Flask-Security features
SECURITY_REGISTERABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SQLALCHEMY_TRACK_MODIFICATIONS = False


HOME = os.path.expanduser("~")
DOWNLOADS_DIR = os.path.join(HOME, "Downloads")

POSTGRES = {
    'user': 'dev',
    'pw': 'password',
    'db': 'voice_search',
    'host': '127.0.0.1',
    'port': '5432',
}