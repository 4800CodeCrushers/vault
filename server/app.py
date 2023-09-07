from flask import Flask
from flask_cors import CORS

# Create app
app = Flask(__name__)
# Enable CORS request
CORS(app, supports_credentials=True, expose_headers='Authorization')
# Register routes
# app.register_blueprint(auth)
# app.register_blueprint(stream)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=10000, debug=False)
