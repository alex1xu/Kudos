import React from "react";
import { MdVerified } from "react-icons/md";
import { BsShieldFillCheck } from "react-icons/bs";
import Image from "../components/Image";
import { FaSchool, FaUserGraduate } from "react-icons/fa";
import { roleMap } from "../utility";
import { Tooltip } from "react-tooltip";

function UserCard(props) {
  const key = Math.random().toString().slice(2, 15);
  if (props.skeleton) {
    return (
      <div className="user-card-container">
        <div className="user-card-profile-picture-wrapper">
          <div className="profile-img skeleton"></div>
        </div>
        <div className="user-card-text">
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-text skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-card-container">
      <div className="user-card-profile-picture-wrapper">
        <a href={"/profile/" + props.user?.username}>
          <Image src={props.user} user></Image>
        </a>
      </div>
      <div className="user-card-text">
        <h4 style={{ display: "flex" }}>
          <a
            href={"/profile/" + props.user?.username}
            style={{ marginRight: ".1rem" }}
          >
            <b>@{props.user?.username}</b>
          </a>
          <span id={"studentIcon" + key} data-tooltip-content="Local student">
            {!props.disableTooltips && (
              <Tooltip anchorId={"studentIcon" + key} />
            )}
            {props.user?.account_type == roleMap.STUDENT && (
              <FaUserGraduate className="student-icon" />
            )}
          </span>
          <span
            id={"organizationIcon" + key}
            data-tooltip-content="Local organization"
          >
            {!props.disableTooltips && (
              <Tooltip anchorId={"organizationIcon" + key} />
            )}
            {props.user?.account_type == roleMap.ORGANIZATION && (
              <MdVerified className="verified-icon" />
            )}
          </span>
          <span id={"adminIcon" + key} data-tooltip-content="Administrator">
            {!props.disableTooltips && <Tooltip anchorId={"adminIcon" + key} />}
            {props.user?.account_type == roleMap.ADMIN && (
              <BsShieldFillCheck className="moderator-icon"></BsShieldFillCheck>
            )}
          </span>
          <span id={"clubIcon" + key} data-tooltip-content="School club">
            {!props.disableTooltips && <Tooltip anchorId={"clubIcon" + key} />}
            {props.user?.account_type == roleMap.CLUB && (
              <FaSchool className="club-icon"></FaSchool>
            )}
          </span>
        </h4>
        <h4>
          {props.user?.account_type == roleMap.STUDENT ||
          props.user?.account_type == roleMap.UNMAPPED
            ? props.user?.first_name +
              " " +
              (props.user?.last_name ? props.user?.last_name : "")
            : props.user?.account_type == roleMap.CLUB
            ? "Club"
            : props.user?.account_type == roleMap.ORGANIZATION ||
              props.user?.account_type == roleMap.ADMIN
            ? "Organization"
            : ""}
          {props.user?.community &&
            " | " + props.user?.community?.replace("_", " ")}
        </h4>
      </div>
    </div>
  );
}

export default UserCard;
