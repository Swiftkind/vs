from flask import Flask, render_template
app = Flask(__name__)


@app.route('/')
def mainapp():
    return render_template('google.html')