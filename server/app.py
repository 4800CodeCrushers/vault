from flask import Flask, request
from flask_cors import CORS
from routes import auth, vg, utils
# Create app
app = Flask(__name__)
# Enable CORS request
CORS(app, supports_credentials=True, expose_headers='Authorization')
# Register routes
app.register_blueprint(auth)
app.register_blueprint(vg)
# Register hook before each request to check for a session key
app.before_request(utils.beforeRequest)
# Run the app
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=17777, debug=False)