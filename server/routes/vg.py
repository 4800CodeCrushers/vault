from flask import Blueprint, request
import requests
from models import Credentials
from utils import makeAPIResponse, igdbRequest
from extensions import db

vg = Blueprint('vg', __name__, url_prefix='/api/vg')
def register(app, options):
	app.register_blueprint(vg, **options)


@vg.route('/', methods=['POST'])
def getGames():
	# Get the query from the request
	id = request.json['id']
	# Reject requests without the proper field
	if 'id' is None: 
		return makeAPIResponse(400, 'Missing required field: id')
	
	
	# Check to see if the game with this id is in our database
	# If it is, return the game
	
	# If it is not, contact IGDB
	# The params for our search
	params = (
		f'fields first_release_date, url, name, summary, cover.*, rating, genres.name, screenshots.image_id, platforms.name,'
		f'involved_companies.company.name, involved_companies.company.logo.image_id, involved_companies.developer, involved_companies.publisher;' 
		f'where id = {id};'
	)
	# Get the game(s) from IGDB
	return igdbRequest(params)
	

@vg.route('/search', methods=['POST'])
def searchGame():
	# Get the query from the request
	query = request.json['query']
	# Reject requests without the proper field
	if 'query' is None: 
		return makeAPIResponse(400, 'Missing required field: query')
	# Get the offset of the search results
	offset = request.json['offset'] if request.json['offset'] else 0
	# The params for our search
	params = (
		f'search \"{query}\";'
		f'fields first_release_date, url, name, summary, cover.*, rating, genres.name, screenshots.image_id, platforms.name,'
		f'involved_companies.company.name, involved_companies.company.logo.image_id, involved_companies.developer, involved_companies.publisher;' 
		f'limit 1; offset {offset}; where rating > 0;'
	)
	# Get the game(s) from IGDB
	return igdbRequest(params)

