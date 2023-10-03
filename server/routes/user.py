from flask import Blueprint, request
import requests
from models import Credentials, Users
from utils import makeAPIResponse, igdbRequest
from extensions import db

user = Blueprint('user', __name__, url_prefix='/api/user')
def register(app, options):
	app.register_blueprint(user, **options)

@user.route('/me', methods=['GET'])
def getMe():
	return makeAPIResponse(200, 'I gotchu', request.user)

@user.route('/me', methods=['PATCH'])
def patchMe():
	user = Users.query.get(request.user.user_id)
	user.name = request.json['name']
	user.picture = request.json['picture']
	user.color = request.json['color']
	db.session.commit()
	return makeAPIResponse(200, 'Info updated')