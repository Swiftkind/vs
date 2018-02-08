# TODO: Rename the app. it is not advisable to name
# an APP written in python and put hyphen or dash on
# the name.

from voice_search.database import db

class SearchQuery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(128))
    link = db.Column(db.String(128))