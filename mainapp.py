import os
import boto3
from .config import KEY, SECRET_KEY, BUCKET_NAME
from flask import Flask, render_template, request, redirect
from werkzeug.utils import secure_filename

app = Flask(__name__)

s3 = boto3.resource('s3')

@app.route('/')
def mainapp():
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def uploadFile():
    if request.method == 'POST':
        file = request.files['data']
        s3.Bucket(BUCKET_NAME).put_object(Key=KEY, Body=file)
        return ('', 200)

    return ('', 400)


@app.route('/results', methods=['GET'])
def searchResults():
    if request.method == 'GET':
        return render_template('results.html')

app.secret_key = SECRET_KEY