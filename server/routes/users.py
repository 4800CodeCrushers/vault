from flask import Blueprint, request
import requests
from models import Credentials, Users
from utils import makeAPIResponse, igdbRequest
from extensions import db

users = Blueprint('users', __name__, url_prefix='/api/users')
def register(app, options):
	app.register_blueprint(users, **options)

@users.route('/me', methods=['GET'])
def getMe():
	return makeAPIResponse(200, 'I gotchu', request.user)

@users.route('/me', methods=['PATCH'])
def patchMe():
	user = Users.query.get(request.user.id)
	user.name = request.json['name']
	user.picture = request.json['picture']
	db.session.commit()
	return makeAPIResponse(200, 'Info updated')