import React, { useState, useEffect } from "react";
import { deleteListingById } from "../api/listing.js";
import { getUserById, updateUserReports } from "../api/user.js";
import {
  getStringTime,
  categoryMap,
  convertToDisplayDT,
  confirmDelete,
  confirmReport,
  getCurrentUser,
  roleMap,
} from "../utility.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import UserCard from "../components/UserCard";
import { AiOutlineClockCircle, AiOutlineTag } from "react-icons/ai";
import { GrLocation } from "react-icons/gr";
import { BsAlarm } from "react-icons/bs";
import { ReactComponent as MoreIcon } from "../icons/dots.svg";
import { ReactComponent as DollarIcon } from "../icons/dollar.svg";
import { ReactComponent as GiftIcon } from "../icons/gift.svg";
import Image from "../components/Image";
import { MdReportGmailerrorred } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFlip } from "swiper";

function ListingPanel(props) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [requester, setRequester] = useState();
  const [remove, setRemove] = useState(false);
  const [report, setReport] = useState(false);
  const key = Math.random().toString().slice(2, 15);
  const fetchData = async () => {
    setRequester(await getUserById(props.listing.requester_id));
  };
  useEffect(() => {
    if (!props.skeleton) fetchData();
  }, [props.listing]);
  if (props.skeleton) {
    return (
      <div className="panel-container-sq" style={{ height: "100%" }}>
        <div className="filler skeleton"></div>
        <div className="panel-text-sq">
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-text skeleton"></div>
        </div>
      </div>
    );
  }

  const deleteButton = () => {
    if (!user) return <></>;
    return (
      <button
        className="listing-panel-more"
        onClick={() => {
          if (remove) {
            confirmDelete(() => {
              deleteListingById(props.listing.id);
              navigate(0);
            });
          } else {
            setRemove(!remove);
          }
        }}
      >
        {remove ? (
          <AiOutlineDelete
            className="listing-panel-more-icon red-outline"
            id={"deleteIcon" + key}
            data-tooltip-content="Delete post"
          >
            <Tooltip anchorId={"deleteIcon" + key}></Tooltip>
          </AiOutlineDelete>
        ) : (
          <MoreIcon className="listing-panel-more-icon"></MoreIcon>
        )}
      </button>
    );
  };

  const reportButton = () => {
    if (!user) return <></>;
    return (
      <button
        className="listing-panel-more"
        onClick={() => {
          if (report) {
            confirmReport(() => {
              updateUserReports(props.listing.requester_id, 1);
              navigate(0);
            });
          } else {
            setReport(!report);
          }
        }}
      >
        {report ? (
          <MdReportGmailerrorred
            className="listing-panel-more-icon red-outline"
            id={"reportIcon" + key}
            data-tooltip-content="Report post"
          >
            <Tooltip anchorId={"reportIcon" + key}></Tooltip>
          </MdReportGmailerrorred>
        ) : (
          <MoreIcon className="listing-panel-more-icon"></MoreIcon>
        )}
      </button>
    );
  };

  if (props.listing?.listing_type == 3) {
    return (
      <div
        className={"panel-container-sq listing-panel-partner-tag"}
        style={{ position: "relative" }}
      >
        <div className="panel-text-sq">
          <div style={{ display: "flex", width: "100%" }}>
            <a href={"/listing/" + props.listing.id}>
              <h3 className="listing-panel-title">{props.listing.title}</h3>
            </a>
            {user?.id == props.listing?.requester_id
              ? deleteButton()
              : reportButton()}
          </div>
          <hr style={{ margin: "0", marginBottom: ".5rem" }}></hr>
          <UserCard user={requester} skeleton={!requester}></UserCard>
          <a href={"/listing/" + props.listing.id}>
            <p
              className="listing-panel-info-container"
              style={{ marginTop: "1rem" }}
              id="clockIcon"
              data-tooltip-content="Date posted"
            >
              <AiOutlineClockCircle className="listing-panel-icon" />
              {getStringTime(props.listing.create_datetime)}
            </p>
            <p className="truncate-text">{props.listing.description}</p>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "panel-container-sq" +
        (requester?.account_type == roleMap.ADMIN ||
        requester?.account_type == roleMap.ORGANIZATION
          ? " listing-panel-partner-tag"
          : "")
      }
      style={{ position: "relative" }}
    >
      {props.listing?.picture_link && (
        <a href={"/listing/" + props.listing.id}>
          <Image src={props.listing} listing></Image>
        </a>
      )}
      <div className="panel-text-sq">
        <div style={{ display: "flex", width: "100%" }}>
          <a href={"/listing/" + props.listing.id}>
            <h3 className="listing-panel-title">{props.listing.title}</h3>
          </a>
          {user?.id == props.listing?.requester_id
            ? deleteButton()
            : reportButton()}
        </div>
        <hr style={{ margin: "0", marginBottom: ".5rem" }}></hr>
        <UserCard user={requester} skeleton={!requester}></UserCard>
        <a href={"/listing/" + props.listing.id}>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            modules={[EffectFlip]}
            effect="flip"
            loop
          >
            <SwiperSlide>
              <p
                className="listing-panel-info-container"
                style={{ marginTop: "1rem" }}
                id="clockIcon"
                data-tooltip-content="Date posted"
              >
                <AiOutlineClockCircle className="listing-panel-icon" />
                {getStringTime(props.listing.create_datetime)}
              </p>
              <p className="listing-panel-info-container">
                <AiOutlineTag className="listing-panel-icon green-outline" />
                {
                  categoryMap[props.listing.listing_type][
                    props.listing.listing_category
                  ]
                }
              </p>
              {props.listing.listing_type == 0 ? (
                <>
                  <p className="listing-panel-info-container">
                    <DollarIcon
                      className="listing-panel-icon"
                      id="dollarIcon"
                      data-tooltip-content="Offered payment"
                    ></DollarIcon>
                    Earn ${props.listing.pay_amount}
                  </p>
                  <p className="listing-panel-info-container">
                    <GrLocation className="listing-panel-icon red-outline" />
                    {props.listing.location_name}
                  </p>
                  <p className="listing-panel-info-container">
                    <BsAlarm className="listing-panel-icon blue-outline" />
                    {convertToDisplayDT(props.listing.start_datetime)}
                  </p>
                </>
              ) : props.listing.listing_type == 1 ? (
                <>
                  <p className="listing-panel-info-container">
                    <DollarIcon className="listing-panel-icon" />
                    {props.listing.pay_amount == 0 ? (
                      "Free"
                    ) : (
                      <>Costs ${props.listing.pay_amount}</>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p className="listing-panel-info-container">
                    <GiftIcon className="listing-panel-icon red-outline" />
                    Earn {props.listing.volunteer_hours} volunteer hour
                    {(props.listing.volunteer_hours === 0 ||
                      props.listing.volunteer_hours > 1) &&
                      "s"}
                  </p>
                  <p className="listing-panel-info-container">
                    <GrLocation className="listing-panel-icon red-outline" />
                    {props.listing.location_name}
                  </p>
                  <p className="listing-panel-info-container">
                    <BsAlarm className="listing-panel-icon blue-outline" />
                    {convertToDisplayDT(props.listing.start_datetime)}
                  </p>
                </>
              )}
            </SwiperSlide>
          </Swiper>
        </a>
      </div>
    </div>
  );
}

export default ListingPanel;
