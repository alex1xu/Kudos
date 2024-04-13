from flask import request, jsonify, Blueprint, session
from . import db, ma, processImage, s3
from sqlalchemy import exc
from .models import ListingModel
from datetime import datetime
import uuid
import os
import boto3
from botocore.client import Config

listing_routes = Blueprint('listing', __name__)

class ListingSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ListingModel

    id = ma.auto_field()
    status = ma.auto_field()
    create_datetime = ma.auto_field()
    update_datetime = ma.auto_field()
    reports = ma.auto_field()
    listing_type = ma.auto_field()
    listing_category = ma.auto_field()
    application_ids = ma.auto_field()
    requester_id = ma.auto_field()
    location_name = ma.auto_field()
    location_lat = ma.auto_field()
    location_lng = ma.auto_field()
    title = ma.auto_field()
    description = ma.auto_field()
    picture_setting = ma.auto_field()
    picture_link = ma.auto_field()
    pay_amount = ma.auto_field()
    volunteer_hours = ma.auto_field()
    start_datetime = ma.auto_field()
    end_datetime = ma.auto_field()

listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)

@listing_routes.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    s3_client = boto3.client('s3', aws_access_key_id=os.environ.get('S3_KEY'), aws_secret_access_key=os.environ.get('S3_SECRET_ACCESS_KEY'), config=Config(signature_version='s3v4'), region_name='us-east-2')
    return {'message': s3_client.generate_presigned_url('get_object', Params={'Bucket': os.environ.get('S3_BUCKET'), 'Key': filename}, ExpiresIn=600)}, 200

@listing_routes.route('/', methods=['PUT'])
def add_listing():
    try:
        if 'session' not in session:
            return jsonify({'message': 'Unauthorized'}), 401
        
        listing_dict = {key: request.form[key] for key in request.form if request.form[key] != 'undefined'}

        if int(listing_dict['listing_type']) == 3:
            new_listing = ListingModel(**listing_dict)
            db.session.add(new_listing)
            db.session.commit()
            return listing_schema.jsonify(new_listing), 200

        required_fields = ['title', 'description', 'listing_type', 'listing_category', 'requester_id']
        if any(field not in listing_dict for field in required_fields):
            return {'message': "Missing required fields"}, 400

        if (int(listing_dict['listing_type']) in (0, 2)) and any(field not in listing_dict for field in ('location_name', 'start_datetime', 'end_datetime')):
            return {'message': "Missing required fields"}, 400

        for key, value in listing_dict.items():
            if key in ('start_datetime', 'end_datetime'):
                listing_dict[key] = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
            elif key in ('pay_amount', 'volunteer_hours') and (not value.isdigit() or int(value) < 0):
                return {'message': "Hours and payment must be a positive integer value"}, 400
            elif key == 'location_name' and ((int(listing_dict['listing_type']) in (0, 2)) and len(value) <= 2):
                return {'message': "Location name too short"}, 400
            elif key == 'title' and (len(value) <= 5 or len(value) > 100):
                return {'message': "Title must be between 6 and 100 characters"}, 400
            elif key == 'description' and (len(value) <= 5 or len(value) > 1000):
                return {'message': "Description must be between 6 and 1000 characters"}, 400
            elif key == 'listing_type' and (int(value) not in (0, 1, 2)):
                return {'message': "Invalid listing type"}, 400
            elif key == 'listing_category' and int(value) < 0:
                return {'message': "Invalid listing category"}, 400

        if int(listing_dict['listing_type']) in (0, 2) and (listing_dict['start_datetime'] > listing_dict['end_datetime']):
            return {'message': "Illegal datetime"}, 400
        if int(listing_dict['listing_type']) in (0, 2) and listing_dict['start_datetime'] < datetime.now():
            return {'message': "Illegal datetime"}, 400

        if 'cover_image' in request.files:
            cover_image = request.files['cover_image']
            cover_image_filename = "listing-" + str(uuid.uuid1()) + ".png"
            listing_dict['picture_link'] = cover_image_filename
            bucket = s3.Bucket(os.environ.get('S3_BUCKET'))
            bucket.Object(cover_image_filename).put(Body=processImage(cover_image))

        new_listing = ListingModel(**listing_dict)
        db.session.add(new_listing)
        db.session.commit()

        return listing_schema.jsonify(new_listing), 200
    except Exception as e:
        return {'message': str(e)}, 500

@listing_routes.route('/', methods=['GET'])
def get_all_listings():
    try:
        all_listings = db.session.query(ListingModel).all()
        result = listings_schema.dump(all_listings)
        return jsonify(result), 200
    except exc.SQLAlchemyError:
        return {'message': "Unknown error"}, 500

@listing_routes.route('/search', methods=['PUT'])
def search_listings():
    try:
        json_dict = request.json
        query = db.session.query(ListingModel)
        
        for key, value in json_dict.items():
            if hasattr(ListingModel, key):
                query = query.filter(getattr(ListingModel, key) == value)

        if json_dict.get('cover_only'):
            query = query.filter(ListingModel.picture_link != None)

        if json_dict.get('community') and json_dict['community'] != 'Any' and '...' not in json_dict['community']:
            query = query.filter(ListingModel.location_name.ilike('%{}%'.format(json_dict['community'])))

        result = listings_schema.dump(query.order_by(ListingModel.create_datetime.desc()).all())
        return jsonify(result), 200
    except exc.SQLAlchemyError:
        return {'message': "Unknown error"}, 500

@listing_routes.route('/user/<uid>', methods=['GET'])
def get_listing_requester_id(uid):
    try:
        listings = db.session.query(ListingModel).filter(ListingModel.requester_id == uid)
        result = listings_schema.dump(listings)
        return jsonify(result), 200
    except exc.SQLAlchemyError:
        return {'message': "Unknown error"}, 500

@listing_routes.route('/<lid>', methods=['GET'])
def get_listing(lid):
    try:
        listing = ListingModel.query.get(lid)
        return listing_schema.jsonify(listing), 200
    except exc.SQLAlchemyError:
        return {'message': "Unknown error"}, 500

@listing_routes.route('/<lid>', methods=['PUT'])
def update_listing(lid):
    try:
        if 'session' not in session:
            return jsonify({'message': 'Unauthorized'}), 401

        listing = ListingModel.query.get(lid)
        listing_dict = {key: request.form[key] for key in request.form if request.form[key] != 'undefined'}

        if int(listing_dict['listing_type']) == 3:
            for key, value in listing_dict.items():
                setattr(listing, key, value)
            db.session.commit()
            return listing_schema.jsonify(listing), 200

        required_fields = ['title', 'description', 'listing_type', 'listing_category', 'requester_id']
        if any(field not in listing_dict for field in required_fields):
            return {'message': "Missing required fields"}, 400

        if (int(listing_dict['listing_type']) in (0, 2)) and any(field not in listing_dict for field in ('location_name', 'start_datetime', 'end_datetime')):
            return {'message': "Missing required fields"}, 400

        for key, value in listing_dict.items():
            if key in ('start_datetime', 'end_datetime'):
                listing_dict[key] = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
            elif key in ('pay_amount', 'volunteer_hours') and (not value.isdigit() or int(value) < 0):
                return {'message': "Hours and payment must be a positive integer value"}, 400
            elif key == 'location_name' and ((int(listing_dict['listing_type']) in (0, 2)) and len(value) <= 2):
                return {'message': "Location name too short"}, 400
            elif key == 'title' and (len(value) <= 5 or len(value) > 100):
                return {'message': "Title must be between 6 and 100 characters"}, 400
            elif key == 'description' and (len(value) <= 5 or len(value) > 1000):
                return {'message': "Description must be between 6 and 1000 characters"}, 400
            elif key == 'listing_type' and (int(value) not in (0, 1, 2)):
                return {'message': "Invalid listing type"}, 400
            elif key == 'listing_category' and int(value) < 0:
                return {'message': "Invalid listing category"}, 400

        if int(listing_dict['listing_type']) in (0, 2) and (listing_dict['start_datetime'] > listing_dict['end_datetime']):
            return {'message': "Illegal datetime"}, 400

        if 'cover_image' in request.files:
            cover_image = request.files['cover_image']
            cover_image_filename = "listing-" + str(uuid.uuid1()) + ".png"
            listing_dict['picture_link'] = cover_image_filename
            bucket = s3.Bucket(os.environ.get('S3_BUCKET'))
            bucket.Object(cover_image_filename).put(Body=processImage(cover_image))

        for key, value in listing_dict.items():
            setattr(listing, key, value)

        db.session.commit()
        return listing_schema.jsonify(listing), 200
    except exc.SQLAlchemyError:
        return {'message': "Unknown error"}, 500

@listing_routes.route('/<lid>', methods=['DELETE'])
def delete_listing(lid):
    try:
        if 'session' not in session:
            return jsonify({'message': 'Unauthorized'}), 401

        listing = ListingModel.query.get(lid)
        db.session.delete(listing)
        db.session.commit()
        return listing_schema.jsonify(listing), 200
    except exc.SQLAlchemyError:
        return {'message': "Unknown error"}, 500
