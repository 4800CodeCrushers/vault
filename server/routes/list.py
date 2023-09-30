from flask import Blueprint, request
import requests
from models import Collections
from utils import makeAPIResponse, igdbRequest
from extensions import db

list = Blueprint('list', __name__, url_prefix='/api/list')
def register(app, options):
	app.register_blueprint(list, **options)


@list.route('/collection', methods=['GET'])
def getCollection():
	# Get the offset from the request
	wished = request.args.get('wished') if request.args.get('wished') else 'false'
	offset = request.args.get('offset') if request.args.get('offset') else 0
	# Get the games in the user's collection and serialize the result
	if wished == 'true':
		collection = Collections.query.filter(Collections.user_id == request.user.id, Collections.wished == True).offset(offset).limit(100).all()
	elif wished == 'false':
		collection = Collections.query.filter(Collections.user_id == request.user.id, Collections.collected == True).offset(offset).limit(100).all()
	else:
		return makeAPIResponse(404, 'Bad input for "wished".')	
	collection = [e.serialize() for e in collection]
	if len(collection) > 0:
		# Format the game_ids as a string in the form of "(1, 2, 3, ...)"
		the_ids = "(" + ", ".join(str(item['game_id']) for item in collection) + ")"
		# The params for our search
		params = (
			f'fields first_release_date, url, name, summary, cover.*, rating, genres.name, screenshots.image_id, platforms.name,'
			f'involved_companies.company.name, involved_companies.company.logo.image_id, involved_companies.developer, involved_companies.publisher;' 
			f'where id = {the_ids};'
		)
		# Get the game(s) from IGDB
		return igdbRequest(params)
	return makeAPIResponse(200, 'You do not have any games stored.', [])	
	
@list.route('/collection', methods=['POST'])
def addToCollection():
	# Get the offset and id from the request
	if 'id' not in request.json: return makeAPIResponse(400, 'Missing required field: id')
	id = request.json['id']
	wished = request.args.get('wished') if request.args.get('wished') else 'false'
	# See if the collection item exists
	item = Collections.query.filter(Collections.user_id == request.user.id, Collections.game_id == id).first()
	if item:
		if wished == 'true': item.wished = 1
		else: item.collected = 1
		db.session.commit()
	else:
		# Create the collection item
		if wished == 'true': item = Collections(user_id = request.user.id, wished = 1,collected = 0, game_id = id)
		else: item = Collections(user_id = request.user.id, wished = 0, collected = 1, game_id = id)
		# Add the item to the database
		db.session.add(item)
		db.session.commit()
	# Return a response
	return makeAPIResponse(200, f'Game added to {"wishlist" if wished else "collection"}.')

@list.route('/collection', methods=['DELETE'])
def removeFromCollection():
	# Get the offset and id from the request
	if 'id' not in request.json: return makeAPIResponse(400, 'Missing required field: id')
	id = request.json['id']
	wished = request.args.get('wished') if request.args.get('wished') else 'false'
	# Get the collection item
	item = Collections.query.filter(Collections.user_id == request.user.id, Collections.game_id == id).first()
	if item:
		# Add the item to the database
		db.session.delete(item)
		db.session.commit()
		# Return a response
		return makeAPIResponse(200, f'Game added to {"wishlist" if wished else "collection"}.')
	else:
		return makeAPIResponse(200, f'You do not have this game in your {"wishlist" if wished else "collection"}.')

