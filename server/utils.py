from flask import make_response, request
from models import Credentials, Users, Collections
from extensions import db
import requests, time, json


def igdbRequest(params):
	"""
	Make a request to IGDB.

	Returns:
		The parsed response from IGDB.
    """
	# The credentials needed to contact IGDB
	token = "mt8tntiq4be5mdf1m5hv72pa7xrsft"
	clientID = "fqgbk3v135ggx22yzzjx72yctiho44"
	# Make the request
	response = requests.post(
		'https://api.igdb.com/v4/games', **{
			'headers': {
				"Content-Type": "application/json", 
				"Authorization": f'Bearer {token}',
				"Client-ID": f'{clientID}'
			},
			'data': params
		}
	)
	# Get the games list from the response
	found_games = response.json()

	# See if the game is in the user's collection
	# This method hurts my soul I hope there is a better way to do this
	if request.user:
		for game in found_games:
			item = Collections.query.filter(Collections.user_id == request.user.id, Collections.game_id == game['id']).first()
			if item:
				game['wished'] = item.wished 
				game['collected'] = item.collected

	# Flatten the result, and store it in the database
	# print(json.dumps( found_games, indent=2))

	# Wait and try again if we got a 'Too Many Requests' error code from IGDB
	if response.status_code == 429:
		time.sleep(.33)
		return igdbRequest(params)
	# Return the games if we retrieved at least one
	elif response.status_code == 200 and len(found_games) > 0:
		return makeAPIResponse(200, 'Got the game.',  found_games)	
	else:
		return makeAPIResponse(404, 'Could not find a game.')
	
def makeAPIResponse(code, message, data = None):
	"""
	Create a response to an API request.
	
	Parameters:
		code : number
		message : str
		data : json | record | record array
	Returns:
		A response to the user.
    """
	payload = { 'success': code == 200, 'message': message }

	if data != None: 
		# Serialize the data into JSON if it is a model
		if issubclass(type(data), db.Model):
			if type(data) is list:
				payload['data'] = [e.serialize() for e in data]
			else:
				payload['data'] =  data.serialize()
		# Otherwisae, just return the data
		else:
			payload['data'] = data

	return make_response(payload, code)

def beforeRequest():
	"""
	Check if the user is authorized before every request, exluding log in.
	Also, let the client know CORS is allowed for an 'OPTION' request.
	It was set to automatically run in app.py.
    """
	# When seeing the CORS options, let the client know we allow the requests 
	if request.method == 'OPTIONS':
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response
   
	# Ensure we do not run this when logging/finding a game in since we will not have a session key
	if request.path != '/api/auth/login' and request.path != '/api/auth/create':
		# Get the session key from the request
		key = request.headers.get('Authorization')
		# Reject the user if they did not give us a session key
		if not key and request.path != '/api/vg/search': return makeAPIResponse(401, 'Unauthorized')
		# Check if the session key they gave us is in the DB
		credentials = Credentials.query.filter(Credentials.key == key).first()
		# Reject the user if the session key they gave is not in the DB
		if not credentials and request.path != '/api/vg/search': return makeAPIResponse(400, 'Invalid credentials')
		# Attach the session key to the request, for convenience
		request.key = key
		# Attach the user who made the request, for convenience
		request.user = Users.query.filter(Users.id == credentials.user_id).first()