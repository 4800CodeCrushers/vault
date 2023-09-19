from flask import make_response, request
from models import Credentials, Users
from extensions import db
import requests

def IGDBrequest():
	"""
	Make a request to IGDB.

	Returns:
		The parsed response from IGDB.
    """
	# The credentials needed to contact IGDB
	token = "mt8tntiq4be5mdf1m5hv72pa7xrsft"
	clientID = "fqgbk3v135ggx22yzzjx72yctiho44"
	# Get the query from the request
	query = request.json['query']
	# The search params
	params = (
		f'search \"{query}\";' if query else ''
		'fields '
		'url,'
		'name,'
		'first_release_date,'
		'summary,'
		'cover.*,'
		'involved_companies.company.name,'
		'involved_companies.company.logo.url,'
		'involved_companies.developer;'
	)
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
	# Return the games if we retrieved at least one
	if response.status_code == 200 or len(found_games) > 0:
		# Filter involved companies where developer = true
		for i in range(len(found_games)):
			# developer_companies = [company for company in data[i]['involved_companies'] if company['developer'] == True]
			# data[i]['involved_companies'] = developer_companies
			print(found_games[i])
		return makeAPIResponse(200, 'Got the game.',  found_games[0])	
	else:
		return makeAPIResponse(404, 'Could not find a game.')
	
def serializeData(data):
	"""
	Serialize a record or array of records into a JSON format.

	Parameters:
		data : record | record array
	Returns:
		A response to the user.
    """
	if type(data) is list:
		return [e.serialize() for e in data]
	else:
		return data.serialize()
		
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
	if data != None: payload['data'] = serializeData(data) if issubclass(type(data), db.Model) else data
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
    
	# Ensure we do not run this when logging in since we will not have a session key
	if False and request.path != '/auth/login':
		# Get the session key from the request
		key = request.headers.get('Authorization')
		# Reject the user if they did not give us a session key
		if not key: return makeAPIResponse(401, 'Unauthorized')
		# Check if the session key they gave us is in the DB
		credentials = Credentials.query.filter(Credentials.key == key).first()
		# Reject the user if the session key they gave is not in the DB
		if not credentials: return makeAPIResponse(400, 'Invalid credentials')
		# Attach the session key to the request, for convenience
		request.key = key
		# Attach the user who made the request, for convenience
		request.user = Users.query.filter(Users.id == credentials.id).first()