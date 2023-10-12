from flask import make_response, request
from models import Credentials, Users, Collections
from extensions import db
import requests, time, json, orjson


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
			item = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.game_id == game['id']).first()
			if item:
				game['wished'] = item.wished 
				game['collected'] = item.collected


	# Flatten the result, and store it in the database

	# First, we access the JSON content as a string
	json_data = response.text

	# Second, we parse it using orjson.loads()
	parsed_data = orjson.loads(json_data)

	# This is printing all information about all retrieved games.
	# Functionality will still work with the following line commented out.
	#print(json.dumps(parsed_data, indent=2))

	# Iterate through the list of games and collect the desired fields
	for game in parsed_data:
		# Retrieve game attributes.
		name = game.get("name", "Unavailable")
		game_id = game.get("id", "Unavailable")
		summary = game.get("summary", "Unavailable")
		print(f"\nName: {name}")
		print(f"\nGame ID: {game_id}")
		print(f"\nSummary: {summary}")
		# Check if "involved_companies" exists in the JSON data
		if "involved_companies" in game:
			# If it does, initialize default values for developer/publisher
			developer_name = publisher_name = "Unavailable"
			# Then, iterate through the "involved_companies" list
			for company_info in game["involved_companies"]:
				# First, get the name of the company.
				company = company_info["company"]
				# Check if the company is a developer
				if company_info["developer"]:
					developer_name = company["name"]
				# Check if the company is a publisher
				if company_info["publisher"]:
					publisher_name = company["name"]
			print(f"\nDeveloper: {developer_name}")
			print(f"\nPublisher: {publisher_name}")
			print(f"\n\n\n")
		else:
			#If there are no involved companies on record, then print unavailable.
			print(f"\nDeveloper: Unavailable")
			print(f"\nPublisher: Unavailable")
			print(f"\n\n\n")


	# Wait and try again if we got a 'Too Many Requests' error code from IGDB
	if response.status_code == 429:
		time.sleep(.3)
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
	It was set to automatically run before every request in app.py.
    """
	# When seeing the CORS options, let the client know we allow the requests 
	if request.method == 'OPTIONS':
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response
   
	print(request.path)
	# Ensure we do not run this when logging/finding a game in since we will not have a session key
	if request.path != '/'  and request.path != '/manifest.json'  and not request.path.startswith('/static/') and request.path != '/api/auth/login' and request.path != '/api/auth/create':
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
		request.user = Users.query.filter(Users.user_id == credentials.user_id).first()