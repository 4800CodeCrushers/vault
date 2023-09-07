from flask import Blueprint, make_response

auth = Blueprint('auth', __name__, url_prefix='/auth')

def register(app, options):
	app.register_blueprint(auth, **options)


@auth.route('/foo/<int:id>', methods=['GET'])
def foo(id):
	response = make_response({'success': True, 'message': f'You are accessing id: {id}.'})
	return response
