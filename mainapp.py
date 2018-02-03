import os
import boto3
from .config import key
from flask import Flask, render_template, request, redirect
from werkzeug.utils import secure_filename

app = Flask(__name__)

s3 = boto3.resource('s3')

@app.route('/')
def mainapp():
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['data']
        s3.Bucket('search.audio').put_object(Key=key, Body=file)
        return redirect('/')


app.secret_key = os.urandom(24)