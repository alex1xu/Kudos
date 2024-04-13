from flask import (
    Flask,
    request,
    jsonify,
    Blueprint,
    session,
)
from . import db, ma, app, processImage, s3
import json
from sqlalchemy import exc, or_
from .models import UserModel, ListingModel
import uuid
import os
import boto3
from botocore.client import Config
from random import random

user_routes = Blueprint("user", __name__)


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = UserModel

    id = ma.auto_field()
    status = ma.auto_field()
    create_datetime = ma.auto_field()
    update_datetime = ma.auto_field()
    reports = ma.auto_field()
    listing_ids = ma.auto_field()
    application_ids = ma.auto_field()
    reviewer_review_ids = ma.auto_field()
    reciever_review_ids = ma.auto_field()
    username = ma.auto_field()
    account_type = ma.auto_field()
    profile_picture_setting = ma.auto_field()
    profile_picture_link = ma.auto_field()
    profile_color = ma.auto_field()
    email = ma.auto_field()
    phone = ma.auto_field()
    website_link = ma.auto_field()
    first_name = ma.auto_field()
    last_name = ma.auto_field()
    bio = ma.auto_field()
    kudos = ma.auto_field()
    community = ma.auto_field()
    resume_link = ma.auto_field()
    skills = ma.auto_field()


user_schema = UserSchema()
users_schema = UserSchema(many=True)


@user_routes.route("/images/<filename>", methods=["GET"])
def get_image(filename):
    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("S3_KEY"),
            aws_secret_access_key=os.environ.get("S3_SECRET_ACCESS_KEY"),
            config=Config(signature_version="s3v4"),
            region_name="us-east-2",
        )
        return {"message": s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": os.environ.get("S3_BUCKET"), "Key": filename},
            ExpiresIn=600,
        )}, 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/login/<user_email>", methods=["POST"])
def login_user(user_email):
    try:
        user = db.session.query(UserModel).filter(UserModel.email == user_email).first()
        if not user:
            return {"NaN": "No existing user found"}, 200
        else:
            session["session"] = user.id
            return user_schema.jsonify(user)
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/check", methods=["GET"])
def check_session():
    try:
        if "session" not in session:
            return jsonify({"message": "Unauthorized"}), 200
        return jsonify({"message": "Authorized"}), 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/logout", methods=["POST"])
def logout_user():
    try:
        if "session" not in session:
            return {"message": "No user found"}, 200
        session.pop("session", None)
        session.clear()
        return {"message": "Success"}, 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/", methods=["POST"])
def add_user():
    try:
        json_dict = request.json
        if "first_name" not in json_dict:
            return {"message": "Missing given name"}, 400

        if "username" not in json_dict or not 2 <= len(json_dict["username"]) <= 75:
            return {"message": "Account name must be between 2 and 75 characters"}, 400

        if not set(json_dict["username"]).issubset(app.config["NAME_CHARS"]):
            return {"message": "Username contains illegal characters"}, 400

        new_user = UserModel(**json_dict)

        if "session" in session:
            return {"message": "Unauthorized"}, 401
        else:
            session["session"] = new_user.id

        db.session.add(new_user)
        db.session.commit()

        return user_schema.jsonify(new_user), 200
    except exc.IntegrityError:
        db.session.rollback()
        return {"message": "Username is already taken"}, 400
    except Exception as e:
        db.session.rollback()
        return {"message": "Unknown Error"}, 500

@user_routes.route("/", methods=["GET"])
def get_all_users():
    try:
        all_users = UserModel.query.all()
        result = users_schema.dump(all_users)
        return jsonify(result), 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/verified", methods=["GET"])
def get_verified_users():
    try:
        verified_users = UserModel.query.filter(or_(
            UserModel.account_type == 2,
            UserModel.account_type == 4,
        )).all()
        result = users_schema.dump(verified_users)
        return jsonify(result), 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/<id>", methods=["GET"])
def get_user(id):
    try:
        user = UserModel.query.get(id)
        return user_schema.jsonify(user), 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/username/<username>", methods=["GET"])
def get_user_username(username):
    try:
        user = UserModel.query.filter(UserModel.username == username).first()
        return user_schema.jsonify(user), 200
    except Exception as e:
        return {"message": "Unknown Error"}, 500


@user_routes.route("/<id>", methods=["PUT"])
def update_user(id):
    try:
        if "session" not in session:
            return jsonify({"message": "Unauthorized"}), 401

        user = UserModel.query.get(id)
        for key, value in request.form.items():
            if value != "undefined":
                if key == "kudos":
                    setattr(user, key, int(user.kudos) + int(value))
                elif key == "reports":
                    setattr(user, key, int(user.reports) + int(value))
                elif key == "account_type":
                    if value in ("2", "4"):
                        db.session.add(ListingModel(
                            requester_id=user.id,
                            listing_type=3,
                            listing_category=0,
                            title=f"Welcome {user.username}!",
                            description="The Kudos team is absolutely thrilled to partner with {name}! 🎉".format(
                                name=user.username
                            )
                        ))
                        db.session.commit()
                    setattr(user, key, value)
                else:
                    setattr(user, key, value)

        if "profile_picture_link" in request.files:
            profile_picture = request.files["profile_picture_link"]
            profile_picture_filename = f"user-{uuid.uuid1()}.png"
            setattr(user, "profile_picture_link", profile_picture_filename)
            setattr(user, "profile_picture_setting", 1)
            s3.Bucket(os.environ.get("S3_BUCKET")).Object(profile_picture_filename).put(
                Body=processImage(profile_picture)
            )

        db.session.commit()
        return user_schema.jsonify(user), 200
    except exc.IntegrityError:
        db.session.rollback()
        return {"message": "Username is already taken"}, 400
    except Exception as e:
        db.session.rollback()
        return {"message": "Unknown Error"}, 500


@user_routes.route("/<id>", methods=["DELETE"])
def delete_user(id):
    try:
        if "session" not in session:
            return jsonify({"message": "Unauthorized"}), 401

        user = UserModel.query.get(id)
        db.session.delete(user)
        db.session.commit()
        return user_schema.jsonify(user), 200
    except Exception as e:
        db.session.rollback()
        return {"message": "Unknown Error"}, 500
