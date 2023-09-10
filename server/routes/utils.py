from flask import make_response, request

def serializeData(data):
	if type(data) is list:
		return [e.serialize() for e in data]
	else:
		return data.serialize()
		
def makeAPIResponse(code, message, data = None, serialize = True):
	payload = { 'success': code == 200, 'message': message }
	if data != None: payload['data'] = serializeData(data) if serialize else data
	return make_response(payload, code)


def beforeRequest():
	print('running hook')
    # # Ensure we do not run this when logging in since we will not have a session key
	# if request.path != '/auth/login':
	# 	# Get the session key from the request
	# 	session_key = request.headers.get('Authorization')
	# 	# Reject the user if they did not give us a session key
	# 	if not session_key: return makeAPIResponse(401, 'Unauthorized')
	# 	# Check if the session key they gave us is in the DB
	# 	credentials = Credentials.query.filter(Credentials.session_key == session_key).first()
	# 	# Reject the user if the session key they gave is not in the DB
	# 	if not credentials: return makeAPIResponse(400, 'Invalid credentials')
	# 	# Attach the session key to the request, for convenience
	# 	request.session_key = session_key
	# 	# Attach the user who made the request, for convenience
	# 	request.user = Users.query.filter(Users.id == credentials.id).first()