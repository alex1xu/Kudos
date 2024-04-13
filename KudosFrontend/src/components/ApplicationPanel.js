import React, { useState, useEffect } from "react";
import { getListingById } from "../api/listing.js";
import { getUserById, checkSession } from "../api/user.js";
import { createNewReview, getReviewsByApplicationId } from "../api/review.js";
import { updateApplicationStatus } from "../api/application.js";
import {
  getStringTime,
  statusMap,
  generalLoading,
  getCurrentUser,
} from "../utility.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";
import {
  BsFillHandThumbsUpFill,
  BsFillHandThumbsDownFill,
} from "react-icons/bs";
import UserCard from "../components/UserCard";
import StatusCard from "./StatusCard.js";
import { MdMarkEmailUnread } from "react-icons/md";
import ReviewCard from "../components/ReviewCard";

function ApplicationPanel(props) {
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState();
  const [listing, setListing] = useState();
  const [requester, setRequester] = useState();
  const user = getCurrentUser();
  const [showDescription, setShowDescription] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewKudos, setReviewKudos] = useState(0);
  const [review, setReview] = useState();

  const fetchData = async () => {
    await getUserById(props.application.applicant_id).then((res) => {
      setApplicant(res);
    });
    await getListingById(props.application.listing_id).then(async (res) => {
      setListing(res);
      await getUserById(res.requester_id).then((res) => {
        setRequester(res);
      });
    });
    await getReviewsByApplicationId(props.application.id).then((res) => {
      setReview(res);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitReview = async () => {
    let new_review = {};

    generalLoading();
    await checkSession().then(async (res) => {
      if (res) {
        if (user?.id == applicant?.id)
          new_review = {
            rating: reviewKudos,
            description: reviewText,
            reciever_id: requester?.id,
            reviewer_id: user?.id,
            application_id: props.application.id,
          };
        else
          new_review = {
            rating: reviewKudos,
            description: reviewText,
            reciever_id: applicant?.id,
            reviewer_id: user?.id,
            application_id: props.application.id,
          };

        await createNewReview(new_review).then(async () => {
          navigate(0);
          return null;
        });
      }
    });
  };

  const changeStatus = async (status) => {
    generalLoading();
    await updateApplicationStatus(props.application, status).then(() => {
      navigate(0);
    });
  };

  const renderApplication = () => {
    return (
      <>
        {!props.hideDescription && listing?.listing_type == 0 && (
          <p>{props.application.description}</p>
        )}
      </>
    );
  };

  const renderTentativePOV2 = () => {
    return (
      <div>
        {listing?.listing_type != 2 && (
          <>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="icon blue application-tab"
            >
              <MdMarkEmailUnread style={{ width: "1rem", height: "1rem" }} />
              <h4>View Application</h4>
            </button>
            {showDescription &&
              (props.application.description.includes(
                "KUDOS AUTOMATIC APPLICATION: ["
              ) ? (
                <p>
                  <i>
                    This application was submitted before the application reason
                    update for service listings on (2/24/23).
                  </i>
                </p>
              ) : (
                <p>{props.application.description}</p>
              ))}
          </>
        )}
        <button
          onClick={() => changeStatus(2)}
          className="icon green application-tab"
        >
          <BsFillHandThumbsUpFill style={{ width: "1rem", height: "1rem" }} />
          <h4>Accept</h4>
        </button>
        <button
          onClick={() => changeStatus(3)}
          className="icon red application-tab"
        >
          <BsFillHandThumbsDownFill style={{ width: "1rem", height: "1rem" }} />
          <h4>Reject</h4>
        </button>
      </div>
    );
  };

  const renderAcceptedPOV1 = () => {
    if (listing?.listing_type == 0)
      return (
        <div>
          <p>
            Your application was accepted after review by the service requester.
          </p>
          <p>
            Contact requester at <b>{requester?.email}</b>
          </p>
          <p>
            We strongly recommend leaving a review after your completion of the
            service, or detailing your experience if it couldn't be completed.
          </p>
          {renderEnterReview()}
        </div>
      );
    else if (listing?.listing_type == 1)
      return (
        <div>
          <p>
            Your application was accepted after review by the service offeror.
          </p>
          <p>
            Contact offeror at <b>{requester?.email}</b>
          </p>
          <p>
            We strongly recommend leaving a review after completion of the
            service, or detailing your experience if it couldn't be completed.
          </p>
          {renderEnterReview()}
        </div>
      );
    else
      return (
        <div>
          <p>Your application was accepted by the event organizer.</p>
          <p>
            Contact organizer at <b>{requester?.email}</b>
          </p>
          <p>
            We strongly recommend leaving a review after completion of the
            event, or detailing your experience if it couldn't be completed.
          </p>
          {renderEnterReview()}
        </div>
      );
  };

  const renderAcceptedPOV2 = () => {
    if (listing?.listing_type == 0)
      return (
        <div>
          <p>You have accepted this application.</p>
          <p>
            Contact applicant at <b>{applicant?.email}</b>
          </p>
          <p>
            We strongly recommend leaving a review of this applicant after
            completion of the service, or detailing your experience if it
            couldn't be completed.
          </p>
          {renderEnterReview()}
        </div>
      );
    else if (listing?.listing_type == 1)
      return (
        <div>
          <p>You have accepted this application.</p>
          <p>
            Contact applicant at <b>{applicant?.email}</b>
          </p>
          <p>
            We strongly recommend leaving a review of this applicant after your
            completion of the service, or detailing your experience if it
            couldn't be completed.
          </p>
          {renderEnterReview()}
        </div>
      );
    else
      return (
        <div>
          <p>
            Contact participant at <b>{applicant?.email}</b>
          </p>
          <p>
            We strongly recommend leaving a review of this participant after
            completion of the event, or detailing your experience if it couldn't
            be completed.
          </p>
          {renderEnterReview()}
        </div>
      );
  };

  const renderRejectedPOV1 = () => {
    if (listing?.listing_type == 0) {
      return (
        <p>
          Your application was rejected by the service requester after review.
        </p>
      );
    } else if (listing?.listing_type == 1) {
      return (
        <p>The offer was rescinded by the service offeror after review .</p>
      );
    } else {
      return <p>Application was rejected</p>;
    }
  };

  const renderRejectedPOV2 = () => {
    return <p>You have rejected this application.</p>;
  };

  const renderEnterReview = () => {
    return (
      <div className="view-listing-input-container">
        <textarea
          type="text"
          maxLength={600}
          className="lg"
          rows={5}
          value={reviewText}
          placeholder="How was your experience?"
          onChange={(event) => {
            setReviewText(event.target.value);
          }}
        />
        <div>
          <button
            onClick={() => setReviewKudos((reviewKudos + 1) % 6)}
            className="create-listing-button"
          >
            <BsFillHandThumbsUpFill></BsFillHandThumbsUpFill>
            Award {reviewKudos}/5 Kudos
          </button>
          <button
            onClick={handleSubmitReview}
            style={{ margin: "auto" }}
            className="create-listing-button"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  const renderReviewed = () => {
    if (review && review.length > 0) {
      return (
        <>
          {review.map((each, i) => (
            <div style={{ marginBottom: ".5rem" }}>
              <ReviewCard review={each} skeleton={!each} key={i}></ReviewCard>
            </div>
          ))}
        </>
      );
    } else {
      return <></>;
    }
  };

  if (props.reviewOnly) {
    return (
      <div>
        {review && review.length >= 1 && (
          <ReviewCard review={review[0]}></ReviewCard>
        )}
        {review && review.length >= 2 && (
          <ReviewCard review={review[1]}></ReviewCard>
        )}
      </div>
    );
  } else if (user?.id == applicant?.id) {
    return (
      <div className="panel-container-sq">
        <div className="panel-text-sq">
          <UserCard user={applicant} skeleton={!applicant}></UserCard>
          <StatusCard status={props.application.status} />
          <p className="listing-panel-info-container">
            <AiOutlineClockCircle
              style={{ marginLeft: ".25rem" }}
              className="listing-panel-icon"
            />
            {getStringTime(
              props.application.update_datetime ??
                props.application.create_datetime
            )}
          </p>
          {props.application.status == 2
            ? renderAcceptedPOV1()
            : props.application.status == 3
            ? renderRejectedPOV1()
            : props.application.status == 5
            ? renderReviewed()
            : props.application.status == 6
            ? renderAcceptedPOV1()
            : props.application.status == 7
            ? renderReviewed()
            : renderApplication()}
        </div>
      </div>
    );
  } else if (user?.id != applicant?.id && applicant != undefined) {
    return (
      <div className="panel-container-sq">
        <div className="panel-text-sq">
          <UserCard user={applicant} skeleton={!applicant}></UserCard>
          <StatusCard status={props.application.status} />
          <p className="listing-panel-info-container">
            <AiOutlineClockCircle
              style={{ marginLeft: ".25rem" }}
              className="listing-panel-icon"
            />
            {getStringTime(
              props.application.update_datetime ??
                props.application.create_datetime
            )}
          </p>
          {props.application.status == 0
            ? renderTentativePOV2()
            : props.application.status == 2
            ? renderAcceptedPOV2()
            : props.application.status == 3
            ? renderRejectedPOV2()
            : props.application.status == 5
            ? renderAcceptedPOV2()
            : props.application.status == 6
            ? renderReviewed()
            : props.application.status == 7
            ? renderReviewed()
            : renderApplication()}
        </div>
      </div>
    );
  } else {
    return (
      <div className="panel-container-sq">
        <div className="panel-text-sq">
          <UserCard user={applicant} skeleton={!applicant}></UserCard>
          <StatusCard status={props.application.status} />
          <p className="listing-panel-info-container">
            {statusMap[props.application.status][0]}
            <AiOutlineClockCircle
              style={{ marginLeft: ".25rem" }}
              className="listing-panel-icon"
            />
            {getStringTime(
              props.application.update_datetime ??
                props.application.create_datetime
            )}
          </p>
          {renderApplication()}
        </div>
      </div>
    );
  }
}

export default ApplicationPanel;
