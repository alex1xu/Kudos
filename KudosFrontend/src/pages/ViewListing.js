import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StickyShareButtons, InlineReactionButtons } from "sharethis-reactjs";
import {
  getListingById,
  getUserById,
  checkSession,
  createNewApplication,
  didUserApply,
  getApplicationsByListingId,
} from "../api";
import {
  getStringTime,
  categoryMap,
  convertToDisplayDT,
  generalLoading,
  getCurrentUser,
} from "../utility";
import ApplicationPanel from "../components/ApplicationPanel";
import UserCard from "../components/UserCard";
import Image from "../components/Image";
import { Fragment } from "react";
import { ReactComponent as DollarIcon } from "../icons/dollar.svg";
import { ReactComponent as GiftIcon } from "../icons/gift.svg";
import {
  AiOutlineClockCircle,
  AiOutlineTag,
  GrLocation,
  BsAlarm,
} from "react-icons/all";

function ViewListing() {
  const [listing, setListing] = useState(null);
  const [requester, setRequester] = useState(null);
  const [applications, setApplications] = useState(null);
  const [userApplication, setUserApplication] = useState(null);
  const [applicationDescription, setApplicationDescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const parseLines = (str) => {
    if (!str) return "";
    return str.split(/\n/).map((line, index) => (
      index > 0 ? [<br key={`br-${index}`} />, <Fragment key={index}>{line}</Fragment>] : line
    ));
  };

  const handleApplication = async (event) => {
    event.preventDefault();

    let description = applicationDescription;
    let status = 0;

    if (listing?.listing_type === 2) {
      description = `KUDOS AUTOMATIC APPLICATION: [${user?.username}] IS INTERESTED IN [${listing?.title}]`;
      status = 2;
    }

    generalLoading();
    const res = await checkSession();
    if (res) {
      const application = {
        description,
        listing_id: listing?.id,
        applicant_id: user?.id,
        status,
      };

      await createNewApplication(application);
      navigate(0);
    }
  };

  const fetchData = async () => {
    const res = await getListingById(id);
    setListing(res);
    setRequester(await getUserById(res.requester_id));
    if (user && user?.id === res.requester_id) {
      setApplications(await getApplicationsByListingId(res.id));
    }
    setUserApplication(await didUserApply(user?.id, res.id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (listing) {
      document.title = `${listing.title} | Kudos`;
    }
  }, [listing]);

  return (
    <div className="root-content">
      <StickyShareButtons
        config={{
          alignment: "left",
          color: "social",
          enabled: true,
          show_total: true,
          show_mobile: true,
          font_size: 30,
          labels: "counts",
          language: "en",
          networks: ["wechat", "whatsapp", "facebook", "email"],
          radius: 10,
          size: 48,
          top: 100,
        }}
      />
      <div className="view-listing-layout">
        {listing?.picture_link && <Image src={listing} listing unlimited />}
        <h2>{listing?.title}</h2>
        <UserCard user={requester} />
        {(listing?.listing_type === 0 || listing?.listing_type === 1 || listing?.listing_type === 2) && (
          <>
            <p className="listing-panel-info-container">
              <AiOutlineClockCircle className="listing-panel-icon" />
              {getStringTime(listing?.create_datetime)}
            </p>
            <p className="listing-panel-info-container">
              <AiOutlineTag className="listing-panel-icon green-outline" />
              {listing && categoryMap[listing?.listing_type][listing?.listing_category]}
            </p>
            {listing?.listing_type === 0 && (
              <>
                <p className="listing-panel-info-container">
                  <DollarIcon className="listing-panel-icon" id="dollarIcon" data-tooltip-content="Offered payment" />
                  Earn ${listing?.pay_amount}
                </p>
                <p className="listing-panel-info-container">
                  <GrLocation className="listing-panel-icon red-outline" />
                  {listing?.location_name}
                </p>
                <p className="listing-panel-info-container">
                  <BsAlarm className="listing-panel-icon blue-outline" />
                  {convertToDisplayDT(listing?.start_datetime)}
                </p>
              </>
            )}
            {listing?.listing_type === 1 && (
              <p className="listing-panel-info-container">
                <DollarIcon className="listing-panel-icon" />
                {listing?.pay_amount === 0 ? "Free" : <>Costs ${listing?.pay_amount}</>}
              </p>
            )}
            {listing?.listing_type === 2 && (
              <>
                <p className="listing-panel-info-container">
                  <GiftIcon className="listing-panel-icon red-outline" />
                  Earn {listing?.volunteer_hours} volunteer hour{(listing?.volunteer_hours === 0 || listing?.volunteer_hours > 1) && "s"}
                </p>
                <p className="listing-panel-info-container">
                  <GrLocation className="listing-panel-icon red-outline" />
                  {listing?.location_name}
                </p>
                <p className="listing-panel-info-container">
                  <BsAlarm className="listing-panel-icon blue-outline" />
                  {convertToDisplayDT(listing?.start_datetime)}
                </p>
              </>
            )}
          </>
        )}
        {listing?.requester_id === user?.id && (
          <h4 className="edit-listing-button" style={{ marginTop: "1rem" }}>
          <a href={`/edit-listing/${listing?.id}`}>Edit Post</a>
        </h4>
      )}
      <p>{parseLines(listing?.description)}</p>
      <div className="share-this-container-view-listing">
        <InlineReactionButtons
          config={{
            url: `https://www.kudosconnect.org/community/${id}`,
            alignment: "left",
            enabled: true,
            language: "en",
            reactions: ["slight_smile", "heart_eyes", "astonished"],
            size: 25,
          }}
        />
      </div>
    </div>
    {(listing?.listing_type === 0 || listing?.listing_type === 1 || listing?.listing_type === 2) && (
      <div className="view-listing-layout">
        {!user ? (
          <a href="/login">
            <h2 style={{ textAlign: "center" }}>Login to interact</h2>
          </a>
        ) : user?.id === listing?.requester_id ? (
          <>
            <h2 style={{ textAlign: "center" }}>Active applications</h2>
            <div className="view-listing-applications-layout">
              {applications && applications.map((application, i) => (
                <ApplicationPanel key={i} application={application} />
              ))}
            </div>
          </>
        ) : userApplication ? (
          <>
            <h2 style={{ textAlign: "center" }}>Your application</h2>
            <ApplicationPanel key={userApplication.id} application={userApplication} />
          </>
        ) : (
          <div className="view-listing-input-container">
            {listing?.listing_type !== 2 && (
              <textarea
                type="text"
                maxLength={1000}
                className="lg"
                rows={15}
                value={applicationDescription}
                placeholder={
                  listing?.listing_type === 0
                    ? "Ex:\nDear [Name],\nI am excited to apply for the volunteer position to assist with the wind turbine workshop. I am a current high school student who is taking AP Physics 1 and enjoys exploring the intersections of physics and environmental sustainability. Additionally, I have experience with public speaking, as I have presented research projects at local science fairs and have given speeches at school events. I look forward to hearing back from you. Thank you for considering my application."
                    : "Ex:\nDear [Name],\nI am writing to express my interest in the golf lessons that you are offering. As an avid golfer, I am always looking for ways to improve my game and learn new techniques. I look forward to hearing back from you to arrange a meeting."
                }
                onChange={(event) => {
                  setApplicationDescription(event.target.value);
                }}
              />
            )}
            <button
              onClick={handleApplication}
              style={{ margin: "auto" }}
              className="create-listing-button"
            >
              {listing?.listing_type === 2 ? "I am interested" : "Submit application"}
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);
}

export default ViewListing;
