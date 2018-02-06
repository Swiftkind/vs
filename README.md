Requirements:
* Python 3.5.x
* Flask

Setup:
* Run `pip install -r requirements.txt`
* Run `export FLASK_APP=mainapp.py`
* To run the app, `flask run`


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