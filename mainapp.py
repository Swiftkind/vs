import os
import datetime
from flask import Flask, flash, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/media'
ALLOWED_EXTENSIONS = set(['wav'])

app = Flask(__name__)


@app.route('/')
def mainapp():
    return render_template('google.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        now = datetime.datetime.now()
        file = request.files['data']
        filename = secure_filename('audio '  + str(now))
        file.save('media/'+filename)
        return redirect('/')


app.secret_key = os.urandom(24)