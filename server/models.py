from extensions import db
from sqlalchemy import inspect, ForeignKey
from sqlalchemy.orm import relationship

class Credentials(db.Model):
	"""
	Holds a credential record.
	"""
	__tablename__ = 'credentials'
	email = db.Column(db.String(320), primary_key=True)
	user_id = db.Column(db.Integer, nullable=False)
	password = db.Column(db.String(45), nullable=False)
	key = db.Column(db.String(45))

	def serialize(self):
		return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

class Users(db.Model):
	"""
	Holds a user record.
	"""
	__tablename__ = 'users'
	user_id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(320), unique=True, nullable=False)
	code = db.Column(db.String(45), unique=True, nullable=False)
	name = db.Column(db.String(45), nullable=False)
	joined = db.Column(db.BigInteger, nullable=False)
	color = db.Column(db.String(45))
	picture = db.Column(db.String(45))

	def serialize(self):
		return {c: getattr(self, c) for c in inspect(self).attrs.keys()}
	
class Collections(db.Model):
	"""
	Holds a collection record.
	"""
	__tablename__ = 'collections'
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, nullable=False)
	game_id = db.Column(db.Integer, nullable=False)
	wished = db.Column(db.Boolean, nullable=False)
	collected = db.Column(db.Boolean, nullable=False)

	def serialize(self):
		return {c: getattr(self, c) for c in inspect(self).attrs.keys()}
	

class Friends(db.Model):
	"""
	Holds a collection record.
	"""
	__tablename__ = 'friends'
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, nullable=False)
	friend_id = db.Column(db.Integer, ForeignKey(column='users.user_id'), nullable=False)

	def serialize(self):
		return {c: getattr(self, c) for c in inspect(self).attrs.keys()}
	
