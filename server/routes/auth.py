from flask import Blueprint, make_response, request
import json, hashlib, uuid, requests
from routes import utils

auth = Blueprint('auth', __name__, url_prefix='/auth')

def register(app, options):
	app.register_blueprint(auth, **options)


@auth.route('/login', methods=['POST'])
def login():
	# Reject requests without the proper fields
	if 'username' not in request.json: return utils.makeAPIResponse(400, 'Missing required field: username')
	if 'password' not in request.json: return utils.makeAPIResponse(400, 'Missing required field: password') 
	# Get the username and password from the request
	username = request.json['username']
	password = request.json['password']
	# Hash password
	hashed_password = hashlib.sha1((password + 'secret_key').encode()).hexdigest()
	# Check if this account exists in the DB
	print(f'{username}\'s password is {password} and was hashed to: {hashed_password}')
	return utils.makeAPIResponse(200, 'Login successful')

	credential = Credentials.query.filter(Credentials.username == username, Credentials.password == hashed_password).first()
	if credential:
		# Create a new session key
		session_key = uuid.uuid4()
		# Put the new session key in the DB
		credential.session_key = session_key
		db.session.commit()
		# Get the logging in user's info
		user = Users.query.filter(Users.id == credential.id).first()
		# Return the reponse, with the user info and session key attached
		response = utils.makeAPIResponse(200, 'Login successful', user)
		response.headers['Authorization'] = session_key
		return response
	else:
		return utils.makeAPIResponse(400, 'Invalid credentials')	

# @auth.route('/logout', methods=['POST'])
# def logout():
# 	# Remove session key
# 	credential = Credentials.query.filter(Credentials.session_key == request.session_key).first()
# 	credential.session_key = None
# 	db.session.commit()
# 	# Return response
# 	return utils.makeAPIResponse(200, 'Logout successful')