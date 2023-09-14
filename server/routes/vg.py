from flask import Blueprint, make_response, request
import requests
from routes import utils

vg = Blueprint('vg', __name__, url_prefix='/vg')

def register(app, options):
	app.register_blueprint(vg, **options)


@vg.route('/<int:id>', methods=['GET'])
def getGame(id):
	token = "mt8tntiq4be5mdf1m5hv72pa7xrsft"
	clientID = "fqgbk3v135ggx22yzzjx72yctiho44"

	params = (
		'fields '
		'url,'
		'name,'
		'first_release_date,'
		'summary,'
		'cover.*,'
		'involved_companies.company.name,'
		'involved_companies.company.logo.url,'
		'involved_companies.developer;'
		f'where id = {id};'
	)

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
	data = response.json()
	if response.status_code == 200:
		# Filter involved companies where developer = true
		for i in range(len(data)):
			developer_companies = [company for company in data[i]['involved_companies'] if company['developer'] == True]
			data[i]['involved_companies'] = developer_companies
			print(data[0])
	else:
		print("Error:", response.text)
	
	if len(data) > 0:
		return utils.makeAPIResponse(200, 'Got the game.',  data[0], False)
	else:
		return utils.makeAPIResponse(404, 'Could not find game.', {}, False)
	

@vg.route('/', methods=['POST'])
def searchGame():
	token = "mt8tntiq4be5mdf1m5hv72pa7xrsft"
	clientID = "fqgbk3v135ggx22yzzjx72yctiho44"

	# Reject requests without the proper field
	if 'query' not in request.json: return utils.makeAPIResponse(400, 'Missing required field: query')
	# Get the query from the request
	query = request.json['query']

	params = (
		f'search \"{query}\";'
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

	data = response.json()
	if response.status_code == 200:	
		
		# Filter involved companies where developer = true
		for i in range(len(data)):
			# developer_companies = [company for company in data[i]['involved_companies'] if company['developer'] == True]
			# data[i]['involved_companies'] = developer_companies
			print(data[i])
			
	else:
		print("Error:", response.text)
	
	if len(data) > 0:
		return utils.makeAPIResponse(200, 'Got the game.',  data[0], False)
	else:
		return utils.makeAPIResponse(404, 'Could not find game.', {}, False)



