import boto3
from .config import KEY, SECRET_KEY, BUCKET_NAME
from flask import Flask, render_template, request, redirect, Response
from manage import db, app
from models.model import SearchQuery
import json

s3 = boto3.resource('s3')
db.create_all()

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
        return Response(json.dumps({"key":KEY}), 200, mimetype="application/json")

    return ('', 400)

@app.route('/results', methods=['GET'])
def search_results():
    if request.method == 'GET':
        return render_template('results.html')

@app.route('/queries', methods=['GET', 'POST'])
def save_queries():
    if request.method == 'POST':
        keyword = str(request.form['query'])
        key = str(request.form['key'])
        query = SearchQuery(keyword=keyword, link=key)
        db.session.add(query)
        db.session.commit()
        return ('', 200)
    return ('', 400)

app.secret_key = SECRET_KEY