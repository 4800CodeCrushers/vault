from flask import Flask, render_template
from flask_cors import CORS
from routes import vg, auth, trivia, user, list
from utils import beforeRequest
from extensions import db
from json import load

# Create app
app = Flask(__name__, static_folder="../client/build/static", template_folder="../client/build")
# Connect database with app
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:motcon-dofcop-Topqa7@vault.c5rigsmisjnw.us-west-1.rds.amazonaws.com:3306/vault'
db.init_app(app)
# Enable CORS request
CORS(app, supports_credentials=True, expose_headers='Authorization')
# Register routes
app.register_blueprint(vg)
app.register_blueprint(auth)
app.register_blueprint(user)
app.register_blueprint(list)
app.register_blueprint(trivia)
# Register hook before each request to check for a session key
app.before_request(beforeRequest)

# Serve the react app
@app.route("/")
def home():
    return render_template('index.html')

# Run the app
if __name__ == '__main__':
	# app.run(host='0.0.0.0', debug=False)
	app.run(host='0.0.0.0', debug=False, port=17777)