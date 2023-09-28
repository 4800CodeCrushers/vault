from flask import Blueprint, request
import requests
from models import Credentials
from utils import makeAPIResponse, igdbRequest
from extensions import db

trivia = Blueprint('trivia', __name__, url_prefix='/api/trivia')
def register(app, options):
	app.register_blueprint(trivia, **options)

