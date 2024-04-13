import datetime
import io
import os

from dotenv import load_dotenv
from flask import Flask, abort
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from PIL import Image
from sqlalchemy import MetaData
import boto3

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(days=1)
app.config['SESSION_USE_SIGNER'] = True
app.config['CACHE_TYPE'] = "null"
app.config['CORS_SUPPORTS_CREDENTIALS'] = True
app.config['NAME_CHARS'] = set(("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '"))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

if os.environ.get('MODE') == 'development':
    app.config['SQLALCHEMY_DATABASE_URI'] = str(os.environ.get('DEVELOPMENT_DATABASE_URL'))
    cors = CORS(app, resources={r'/api/*': {'origins': [str(os.environ.get('DEVELOPMENT_FRONTEND_URL'))]}})
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = str(os.environ.get('DATABASE_URL')).replace("postgres", "postgresql")
    cors = CORS(app, resources={r'/api/*': {'origins': [str(os.environ.get('PRODUCTION_FRONTEND_URL'))]}})

# Database setup
metadata = MetaData(naming_convention={
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})
db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db, render_as_batch=True)

# Session setup
Session(app)

# Marshmallow setup
ma = Marshmallow(app)

# S3 setup
s3 = boto3.resource('s3', aws_access_key_id=os.environ.get('S3_KEY'), aws_secret_access_key=os.environ.get('S3_SECRET_ACCESS_KEY'))


def create_app():
    # Register blueprints
    from .user import user_routes
    from .listing import listing_routes
    from .review import review_routes
    from .application import application_routes

    app.register_blueprint(user_routes, url_prefix='/api/user')
    app.register_blueprint(listing_routes, url_prefix='/api/listing')
    app.register_blueprint(review_routes, url_prefix='/api/review')
    app.register_blueprint(application_routes, url_prefix='/api/application')

    return app


def process_image(image):
    try:
        im = Image.open(image).convert('RGBA')
        im.thumbnail((800, 800), Image.ANTIALIAS)
        im = Image.alpha_composite(Image.new('RGBA', im.size, (255, 255, 255)), im)
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")

        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=80)
        buf.seek(0)

        return buf
    except Exception:
        abort(404)
