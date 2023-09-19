from flask import Flask
from flask_cors import CORS
from routes import auth, vg
from utils import beforeRequest
from extensions import db
from json import load

# Create app
app = Flask(__name__)
# Get the db uri from the config.json file
with open('config.json') as f:
	config = load(f)
	print(config['db_uri'])
	app.config['SQLALCHEMY_DATABASE_URI'] = config['db_uri']
# Connect database with app
db.init_app(app)
# Enable CORS request
CORS(app, supports_credentials=True, expose_headers='Authorization')
# Register routes
app.register_blueprint(auth)
app.register_blueprint(vg)
# Register hook before each request to check for a session key
app.before_request(beforeRequest)
# Run the app
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=17777, debug=False)