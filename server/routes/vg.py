from flask import Blueprint, make_response, request
import requests

vg = Blueprint('vg', __name__, url_prefix='/vg')

def register(app, options):
	app.register_blueprint(vg, **options)


@vg.route('/<int:id>', methods=['GET'])
def getGame(id):
	token = "ymcmxs5eonnq98z5sjteoa33yxhryx"
	clientID = "fqgbk3v135ggx22yzzjx72yctiho44"
	response = requests.post(
		'https://api.igdb.com/v4/games', **{
			'headers': {
				"Content-Type": "application/json", 
				"Authorization": f'Bearer {token}',
				"Client-ID": f'{clientID}'
			},
			'data':f'fields *; where id = {1942};'
			# 'data':'fields name, cover.image_id; where id = 1942;'
		}
	)
	print(response.text)
	data = {"html": response.text}	
	return make_response({'success': True, 'message': 'Got the game.', 'data': data})


