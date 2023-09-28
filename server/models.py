from extensions import db
from sqlalchemy import inspect


class Credentials(db.Model):
	"""
	Holds a credential record.
	"""
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
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(320), unique=True, nullable=False)
	code = db.Column(db.String(45), unique=True, nullable=False)
	name = db.Column(db.String(45), nullable=False)
	picture = db.Column(db.String(45), nullable=False)
	joined = db.Column(db.BigInteger, nullable=False)

	def serialize(self):
		return {c: getattr(self, c) for c in inspect(self).attrs.keys()}
	
