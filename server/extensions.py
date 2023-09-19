from flask_sqlalchemy import SQLAlchemy

# Putting this here avoids circular imports
# This create a reference to the database
db = SQLAlchemy()