import React, { useState, useEffect } from "react";
import { getUserById } from "../api/user.js";
import UserCard from "../components/UserCard";
import { AiOutlineClockCircle } from "react-icons/ai";
import { getStringTime } from "../utility.js";
import { BsSuitHeartFill } from "react-icons/bs";

function ReviewCard(props) {
  const [reviewer, setReviewer] = useState();

  const fetchData = async () => {
    if (props.review) {
      await getUserById(props.review?.reviewer_id).then((res) => {
        setReviewer(res);
      });
    }
  };

  const colorOrder = [
    "#FFD12C",
    "#FFD12C",
    "#FBC629",
    "#F8BC25",
    "#F4B122",
    "#F0A61E",
  ];

  useEffect(() => {
    fetchData();
  }, [props.review]);

  let rating = [];
  for (let i = 0; i < props.review?.rating; i++) {
    rating.push(
      <div className="heart-handshake-container" key={i}>
        <BsSuitHeartFill
          key={i}
          className="heart-handshake"
          style={{ color: colorOrder[5 - i] }}
        />
      </div>
    );
  }

  if (props.skeleton) {
    return (
      <div className="review-card-container">
        <div className="skeleton-text skeleton"></div>
        <div className="skeleton-text skeleton"></div>
        <UserCard user={reviewer} skeleton={!reviewer}></UserCard>
      </div>
    );
  }

  return (
    <div className="review-card-container">
      <div className="review-card-icon-container">
        {rating.map((thumb) => {
          return thumb;
        })}
      </div>
      <p className="review-panel-info-container">
        <AiOutlineClockCircle className="listing-panel-icon" />
        {getStringTime(
          props.review.update_datetime ?? props.review.create_datetime
        )}
      </p>
      <h4>{props.review?.description}</h4>
      <UserCard user={reviewer} skeleton={!reviewer}></UserCard>
    </div>
  );
}

export default ReviewCard;
