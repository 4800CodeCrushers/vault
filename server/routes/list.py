from flask import Blueprint, request
import requests
from models import Collections, Friends, Users
from utils import makeAPIResponse, igdbRequest
from extensions import db
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select


list = Blueprint('list', __name__, url_prefix='/api/list')
def register(app, options):
	app.register_blueprint(list, **options)


@list.route('/collection', methods=['GET'])
def getCollection():
	# Get the offset from the request
	offset = int(request.args.get('offset')) if request.args.get('offset') else 0
	# Get the games in the user's collection and serialize the result
	collection = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.collected == True).order_by(Collections.game_id).offset(offset).limit(100).all()
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

@list.route('/wishlist', methods=['GET'])
def getWishlist():
	# Get the offset from the request
	offset = int(request.args.get('offset')) if request.args.get('offset') else 0
	# Get the games in the user's collection and serialize the result
	collection = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.wished == True).order_by(Collections.game_id).offset(offset).limit(100).all()
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

@list.route('/friends', methods=['GET'])
def getFriends():
	# Get the offset from the request
	offset = int(request.args.get('offset')) if request.args.get('offset') else 0
	stm = select(Users.user_id, Users.name, Users.joined, Users.picture, Users.color).filter(Friends.user_id == request.user.user_id).order_by(Friends.friend_id).offset(offset).limit(100).select_from(Friends).join(Users)
	rows = db.session.execute(stm) 
	friends = []
	for row in rows:
		friends.append({"user_id": row.user_id, "name": row.name, 'picture': row.picture, 'color': row.color, 'joined': row.joined})
	if len(friends) > 0:
		return makeAPIResponse(200, 'Here is your friends', friends)	
	return makeAPIResponse(200, 'You do not have any friends :(', [])	


@list.route('/collection', methods=['POST'])
def addToCollection():
	# Get the offset and id from the request
	if 'id' not in request.json: return makeAPIResponse(400, 'Missing required field: id')
	id = request.json['id']
	# See if the collection item exists
	item = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.game_id == id).first()
	if item:
		item.collected = 1 
		db.session.commit()
	else:
		# Create the collection item
		item = Collections(user_id = request.user.user_id, wished = 0, collected = 1, game_id = id)
		# Add the item to the database
		db.session.add(item)
		db.session.commit()
	# Return a response
	return makeAPIResponse(200, f'Game added to collection.')

@list.route('/wishlist', methods=['POST'])
def addToWishlist():
	# Get the offset and id from the request
	if 'id' not in request.json: return makeAPIResponse(400, 'Missing required field: id')
	id = request.json['id']
	# See if the collection item exists
	item = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.game_id == id).first()
	if item:
		item.wished = 1
		db.session.commit()
	else:
		# Create the item
		item = Collections(user_id = request.user.user_id, wished = 1,collected = 0, game_id = id)
		# Add the item to the database
		db.session.add(item)
		db.session.commit()
	# Return a response
	return makeAPIResponse(200, f'Game added to wishlist.')

@list.route('/collection', methods=['DELETE'])
def removeFromCollection():
	# Get the offset and id from the request
	if 'id' not in request.json: return makeAPIResponse(400, 'Missing required field: id')
	id = request.json['id']
	# Get the collection item
	item = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.game_id == id).first()
	if item:
		item.collected = 0
		if item.wished == 0:
			db.session.delete(item)
		db.session.commit()
		# Return a response
		return makeAPIResponse(200, f'Game removed from collection.')
	else:
		return makeAPIResponse(200, f'You do not have this game in your collection.')

@list.route('/wishlist', methods=['DELETE'])
def removeFromWishlist():
	# Get the offset and id from the request
	if 'id' not in request.json: return makeAPIResponse(400, 'Missing required field: id')
	id = request.json['id']
	# Get the collection item
	item = Collections.query.filter(Collections.user_id == request.user.user_id, Collections.game_id == id).first()
	if item:
		item.wished = 0
		if item.collected == 0:
			db.session.delete(item)
		db.session.commit()
		# Return a response
		return makeAPIResponse(200, f'Game removed from wishlist.')
	else:
		return makeAPIResponse(200, f'You do not have this game in your wishlist.')
	