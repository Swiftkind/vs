import boto3
from .config import KEY, SECRET_KEY, BUCKET_NAME
from flask import render_template, request, Response, redirect
from database import db, app, bcrypt
from models.model import SearchQuery, User
import json
from flask_security.forms import LoginForm
from flask_wtf.csrf import CSRFProtect
from forms import LoginForm
from flask.ext.login import LoginManager, login_user, login_required

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

s3 = boto3.resource('s3')
db.create_all()
csrf = CSRFProtect(app)

@app.route('/')
def mainapp():
    return render_template('index.html')

@app.route("/login", methods=["GET", "POST"])
def login():
    """For GET requests, display the login form. 
    For POSTS, login the current user by processing the form.

    """
    form = LoginForm(request.form)
    error = {}
    if request.method == 'POST':
        if form.validate():
            user = User.query.filter_by(email=form.email.data).first()
            if user:
                if bcrypt.check_password_hash(user.password, form.password.data):
                    login_user(user, remember=True)
                    return redirect("/admin/")
        error = {'error':'Invalid Email or password.'}
    return render_template("security/login_user.html", form=form, error=error)

@csrf.exempt
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

@csrf.exempt
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

@app.route('/list', methods=['GET'])
@login_required
def queries():
    query_lists = SearchQuery.query.all()
    return render_template('queries.html',query_lists=query_lists)

@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(user_id)
    except:
        return None

app.secret_key = SECRET_KEY