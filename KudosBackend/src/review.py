from flask import Flask, request, jsonify, Blueprint,session
from . import db,ma
import json
from sqlalchemy import exc
from .models import ReviewModel,ApplicationModel,UserModel

review_routes = Blueprint('review', __name__)

class ReviewSchema(ma.SQLAlchemySchema):
  class Meta:
    model=ReviewModel
  id=ma.auto_field()
  status=ma.auto_field()
  create_datetime=ma.auto_field()
  
  application_id=ma.auto_field()
  reviewer_id=ma.auto_field()
  reciever_id=ma.auto_field()

  rating=ma.auto_field()
  description=ma.auto_field()

review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)

@review_routes.route('/',methods=['POST'])
def add_review():
  try:
    if 'session' not in session:
      return jsonify({'message':'Unauthorized'}),401
    
    json_dict = json.loads(json.dumps(request.json))

    if 'reviewer_id' not in json_dict or 'reciever_id' not in json_dict or 'application_id' not in json_dict:
      return {'message': 'Unauthorized'},401

    if len(json_dict['description'])<10 or len(json_dict['description'])>500:
      return {'message': 'Review must be between 10 and 500 characters'},400
    
    if json_dict['rating']<0 or json_dict['rating']>5:
      return {'message': 'Rating must be between 0 and 5 Kudos'},400
    
    application = ApplicationModel.query.get(json_dict['application_id'])
    if getattr(application,'status')==2:
      if json_dict['reviewer_id']==getattr(application,'applicant_id'):
        setattr(application,'status',5)
      else:
        setattr(application,'status',6)
    elif getattr(application,'status')==5:
      if json_dict['reviewer_id']!=getattr(application,'applicant_id'):
        setattr(application,'status',7)
      else:  
        return {'message': 'Cannot leave two reviews'},400
    elif getattr(application,'status')==6:
      if json_dict['reviewer_id']==getattr(application,'applicant_id'):
        setattr(application,'status',7)
      else:  
        return {'message': 'Cannot leave two reviews'},400
    else:
      return {'message': 'Cannot leave another review'},400
    
    reciever=db.session.query(UserModel).filter(UserModel.id==json_dict['reciever_id']).first()
    setattr(reciever,'kudos',getattr(reciever,'kudos')+json_dict['rating'])

    new_review = ReviewModel(**json_dict)

    db.session.add(new_review)
    db.session.commit()

    return review_schema.jsonify(new_review),200
  except exc.SQLAlchemyError:
    db.session.rollback()
    return {'message': 'Unknown Error'},500

@review_routes.route('/', methods=['GET'])
def get_all_reviews():
  try:
    all_reviews = ReviewModel.query.all()
    result = reviews_schema.dump(all_reviews)
    
    return jsonify(result),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500

@review_routes.route('/<id>', methods=['GET'])
def get_review(id):
  try:
    review = ReviewModel.query.get(id)

    return review_schema.jsonify(review),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500

@review_routes.route('/application/<id>', methods=['GET'])
def get_review_application_id(id):
  try:
    reviews = db.session.query(ReviewModel).filter(ReviewModel.application_id==id)

    result = reviews_schema.dump(reviews)

    return jsonify(result),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500

@review_routes.route('/reciever/<id>', methods=['GET'])
def get_review_reciever_id(id):
  try:
    reviews = db.session.query(ReviewModel).filter(ReviewModel.reciever_id==id)

    result = reviews_schema.dump(reviews)

    return jsonify(result),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500
  
@review_routes.route('/reviewer/<id>', methods=['GET'])
def get_review_reviewer_id(id):
  try:
    reviews = db.session.query(ReviewModel).filter(ReviewModel.reviewer_id==id)

    result = reviews_schema.dump(reviews)

    return jsonify(result),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500

@review_routes.route('/<id>', methods=['PUT'])
def update_review(id):
  try:
    if 'session' not in session:
      return jsonify({'message':'Unauthorized'}),401
    review = ReviewModel.query.get(id)
    json_dict = json.loads(json.dumps(request.json))

    for key in json_dict:
      setattr(review,key,json_dict[key])

    db.session.commit()
    
    return review_schema.jsonify(review),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500

@review_routes.route('/<id>', methods=['DELETE'])
def delete_review(id):
  try:
    if 'session' not in session:
      return jsonify({'message':'Unauthorized'}),401
    review = ReviewModel.query.get(id)
    db.session.delete(review)
    db.session.commit()

    return review_schema.jsonify(review),200
  except exc.SQLAlchemyError as e:
    return {'message': 'Unknown Error'},500