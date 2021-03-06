Requirements:
* Python 3.5.x
* Flask
* Postgres

Create virtual environment and install requirements.txt:
* Run `virtualenv --python=python3 venv`
* Activate the virtual environment
* Run `pip install -r requirements.txt`

Database setup:
* Change the database settings in config.py POSTGRES variable

Migration:
* Run `python db.py db init`
* Run `python db.py db migrate`

Setup and initialize database:
* Run `export FLASK_APP=main.py`
* To run the app, `flask run`

Add user:
* Run `python create_user.py`

Setup boto3:
* If you have the AWS CLI installed, then you can use it to configure your credentials file by typing this command:
- $ aws configure

* If you haven't just type the following command:
- $ pip install awscli
- $ aws configure


Setup google API key:
- Go to static/js folder then change the config.js according to your settings

Setup s3 bucket:
- Go to config.py then change the bucket name