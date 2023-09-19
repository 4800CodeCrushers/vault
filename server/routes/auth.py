from flask import Blueprint, request
import hashlib, uuid
from extensions import db
from models import Credentials, Users
from utils import makeAPIResponse

auth = Blueprint('auth', __name__, url_prefix='/api/auth')
def register(app, options):
	app.register_blueprint(auth, **options)

@auth.route('/create', methods=['POST'])
def create():
    return makeAPIResponse(200, 'Creation successful')


@auth.route('/resetpassword', methods=['POST'])
def create():
	#verify password first before reset
	#after password verified, ask for new password
	#reset password after new password verified to be within password constraints
	return makeAPIResponse(200, 'Reset successful')


@auth.route('/login', methods=['POST'])
def login():
	# Reject requests without the proper fields
	if 'email' not in request.json: return makeAPIResponse(400, 'Missing required field: email')
	if 'password' not in request.json: return makeAPIResponse(400, 'Missing required field: password') 
	# Get the username and password from the request
	email = request.json['email']
	password = request.json['password']
	# Hash password
	secret_key = '9e4906f13c979b6c15432f6de4526f7179bb3641'
	hashed_password = hashlib.sha1((password + secret_key).encode()).hexdigest()
	# Check if this account exists in the DB
	print(f'{email}\'s password is {password} and was hashed to: {hashed_password}')
	credential = Credentials.query.filter(Credentials.email == email, Credentials.password == hashed_password).first()
	if credential:
		# Create a new session key
		key = uuid.uuid4()
		# Put the new session key in the DB
		credential.key = key
		db.session.commit()
		# Get the logging in user's info
		user = Users.query.filter(Users.id == credential.user_id).first()
		# Return the reponse, with the user info and session key attached
		response = makeAPIResponse(200, 'Login successful', user)
		response.headers['Authorization'] = key
		return response
	else:
		return makeAPIResponse(400, 'Invalid credentials')	

@auth.route('/logout', methods=['POST'])
def logout():
	# Remove session key
	credential = Credentials.query.filter(Credentials.key == request.key).first()
	credential.key = None
	db.session.commit()
	# Return response
	return makeAPIResponse(200, 'Logout successful')