from . import db
from sqlalchemy.sql import func


class UserModel(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  status = db.Column(db.Integer, default=0)
  create_datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())
  reports = db.Column(db.Integer, default=0)
  update_datetime = db.Column(db.DateTime(timezone=True), onupdate=func.now())

  listing_ids = db.relationship('ListingModel', foreign_keys='ListingModel.requester_id',cascade="all,delete")
  application_ids = db.relationship('ApplicationModel', foreign_keys='ApplicationModel.applicant_id',cascade="all,delete")
  reviewer_review_ids = db.relationship('ReviewModel', foreign_keys='ReviewModel.reviewer_id',cascade="all,delete")
  reciever_review_ids = db.relationship('ReviewModel', foreign_keys='ReviewModel.reciever_id',cascade="all,delete")

  username = db.Column(db.String, unique=True)
  account_type = db.Column(db.Integer, default=0)
  profile_picture_setting = db.Column(db.Integer, default=0)
  profile_picture_link = db.Column(db.String)
  profile_color = db.Column(db.Integer, default=0)
  email = db.Column(db.String(100), unique=True)
  phone = db.Column(db.String(100))
  website_link = db.Column(db.String(100))
  first_name = db.Column(db.String(50))
  last_name = db.Column(db.String(50))
  bio = db.Column(db.String(500))
  kudos = db.Column(db.Integer, default=0)
  community = db.Column(db.String(200))
  resume_link = db.Column(db.String)
  skills = db.Column(db.String(1000))

  def __init__(self, **kwargs):
    super(UserModel, self).__init__(**kwargs)


class ListingModel(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  status = db.Column(db.Integer,default=0)
  create_datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())
  reports = db.Column(db.Integer, default=0)
  update_datetime = db.Column(db.DateTime(timezone=True), onupdate=func.now())
  listing_type = db.Column(db.Integer)
  listing_category = db.Column(db.Integer)
  
  application_ids = db.relationship('ApplicationModel', foreign_keys='ApplicationModel.listing_id',cascade="all,delete")
  requester_id = db.Column(db.Integer, db.ForeignKey(UserModel.id))

  location_name=db.Column(db.String(100))
  location_lat=db.Column(db.Float)
  location_lng=db.Column(db.Float)

  title = db.Column(db.String(100))
  description = db.Column(db.String(1000))
  picture_setting = db.Column(db.Integer,default=0)
  picture_link = db.Column(db.String)
  pay_amount = db.Column(db.Integer)
  volunteer_hours = db.Column(db.Integer)
  start_datetime = db.Column(db.DateTime(timezone=True))
  end_datetime = db.Column(db.DateTime(timezone=True))

  def __init__(self, **kwargs):
    super(ListingModel, self).__init__(**kwargs)


class ApplicationModel(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  status = db.Column(db.Integer,default=0)
  create_datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())
  update_datetime = db.Column(db.DateTime(timezone=True), onupdate=func.now())

  listing_id = db.Column(db.Integer, db.ForeignKey(ListingModel.id))
  applicant_id = db.Column(db.Integer, db.ForeignKey(UserModel.id))
  review_ids = db.relationship('ReviewModel', foreign_keys='ReviewModel.application_id',cascade="all,delete")

  description = db.Column(db.String(500))

  def __init__(self, **kwargs):
    super(ApplicationModel, self).__init__(**kwargs)

class ReviewModel(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  status = db.Column(db.Integer,default=0)
  create_datetime = db.Column(db.DateTime(timezone=True), server_default=func.now())

  application_id = db.Column(db.Integer, db.ForeignKey(ApplicationModel.id))
  reviewer_id = db.Column(db.Integer, db.ForeignKey(UserModel.id))
  reciever_id = db.Column(db.Integer, db.ForeignKey(UserModel.id))

  rating = db.Column(db.Integer)
  description = db.Column(db.String(500))