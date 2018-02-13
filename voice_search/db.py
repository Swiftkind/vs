import os, sys

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt
from config import DATABASE

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_pyfile('config.py')

# PROJECT ROOT DIR
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# LOCAL DOWNLOAD DIRECTORY
home = os.path.expanduser("~")
DOWNLOADS_DIR = os.path.join(home, "Downloads")

# load database
app.config.update(**DATABASE)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()