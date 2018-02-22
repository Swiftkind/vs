from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt
try:
    from .config import POSTGRES
except ImportError:
    from config import POSTGRES


app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_pyfile('config.py')
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:\
%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES


class DBConnection(object):

    def connect(self):
        """Establish connection to postgres
        """
        self.db = SQLAlchemy(app)
        self.db.metadata.create_all(self.db.engine)

    def migrate(self):
        """Create tables
        """
        migrate = Migrate(app, self.db)
        manager = Manager(app)
        manager.add_command('db', MigrateCommand)
        manager.run()


if __name__ == '__main__':
    db = DBConnection()
    db.connect()
    db.migrate()
