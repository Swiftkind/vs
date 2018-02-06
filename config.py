import datetime
import os

# Name of audio file
KEY = 'audio ' + str(datetime.datetime.now())
# Secret key of flask app
SECRET_KEY = os.urandom(24)
# S3 bucket name
BUCKET_NAME = 'search.audio'