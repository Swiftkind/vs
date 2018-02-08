import boto3
from .config import KEY, SECRET_KEY, BUCKET_NAME
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)
s3 = boto3.resource('s3')

@app.route('/')
def mainapp():
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    """ Upload to s3 bucket
    """
    if request.method == 'POST':
        file = request.files['data']
        s3.Bucket(BUCKET_NAME).put_object(Key=KEY, Body=file)
        return ('', 200)

    return ('', 400)

@app.route('/results', methods=['GET'])
def search_results():
    if request.method == 'GET':
        return render_template('results.html')

@app.route('/queries', methods=['GET', 'POST'])
def save_queries():
    if request.method == 'POST':
        import pdb;pdb.set_trace()

app.secret_key = SECRET_KEY