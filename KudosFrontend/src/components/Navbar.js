import React, { useState, useEffect, useRef, useContext } from "react";
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";
import { FaHandsHelping } from "react-icons/fa";
import {
  MdOutlineExplore,
  MdEventBusy,
  MdPostAdd,
  MdAdminPanelSettings,
} from "react-icons/md";
import { HiSpeakerphone } from "react-icons/hi";
import { FaHandHoldingUsd } from "react-icons/fa";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { logoutCurrentUser } from "../utility.js";
import { generalSuccess, generalError, roleMap } from "../utility.js";
import { AiOutlineLink } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { UserContext } from "../components/UserContext";

export function Navbar() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {}, []);

  const width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <a className="navbar-logo" href="/">
          <div className="navbar-logo-wrapper">
            <img
              src={require("../logo/icon-white.png")}
              style={{ height: "100%", width: "auto" }}
            />
            <img
              src={require("../logo/text-white.png")}
              style={{ height: "100%", width: "auto" }}
            />
          </div>
        </a>
        <NavItem icon={<MdOutlineExplore className="max" />}>
          <DropdownMenu>
            <DropdownItem
              icon={<MdOutlineExplore className="max navbar-icon-button" />}
              to="/explore/"
              text="Explore"
            />
            <DropdownItem
              icon={<FaUsers className="max navbar-icon-button" />}
              to="/community"
              text="Community"
            />
          </DropdownMenu>
        </NavItem>
        <NavItem icon={<MdPostAdd className="max" />}>
          <DropdownMenu>
            <DropdownItem
              icon={<FaHandHoldingUsd className="max navbar-icon-button" />}
              to="/create-listing/0"
              text="Create Request"
              loginOnly={true}
            />
            <DropdownItem
              icon={<FaHandsHelping className="max navbar-icon-button" />}
              to="/create-listing/1"
              text="Create Offer"
              loginOnly={true}
            />
            <DropdownItem
              icon={<MdEventBusy className="max navbar-icon-button" />}
              to="/create-listing/2"
              text="Create Event"
              loginOnly={true}
            />
            <DropdownItem
              icon={<HiSpeakerphone className="max navbar-icon-button" />}
              to="/create-listing/3"
              text="Broadcast"
              loginOnly={true}
              organizationOnly={true}
            />
          </DropdownMenu>
        </NavItem>
        {user ? (
          <NavItem icon={<ProfileIcon className="max" size={24} />}>
            <DropdownMenu>
              <DropdownItem
                icon={
                  <ProfileIcon className="max navbar-icon-button" size={24} />
                }
                to={"/profile/" + user?.username}
                text="Profile"
                loginOnly={true}
              />
              <DropdownItem
                icon={<AiOutlineLink className="max navbar-icon-button" />}
                text="Referral Link"
                action={() => {
                  navigator.clipboard.writeText(
                    "Looking to make a difference in your community? Check out Kudos, the platform connecting local talent to local opportunities.\nhttps://www.kudosconnect.org/login/" +
                      user?.username +
                      "" +
                      user?.id
                  );
                  generalSuccess(
                    "Copied to clipboard!",
                    "Now you can share it with your friends!"
                  );
                }}
                loginOnly={true}
              />
              {user?.account_type == roleMap.ADMIN && (
                <DropdownItem
                  icon={
                    <MdAdminPanelSettings className="max navbar-icon-button" />
                  }
                  text="Admin Dash"
                  to="/admin/dash"
                  loginOnly={true}
                  adminOnly={true}
                />
              )}
              <DropdownItem
                icon={<BiLogOut className="max navbar-icon-button" size={24} />}
                to="/"
                text="Logout"
                action={() => {
                  setUser(undefined);
                  logoutCurrentUser();
                }}
                loginOnly={true}
              />
            </DropdownMenu>
          </NavItem>
        ) : (
          <NavItem icon={<BiLogIn className="max" size={24} />} to="/login" />
        )}
      </ul>
    </nav>
  );
}

export function NavItem(props) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
  }, []);

  const handleClick = (event) => {
    if (!navRef?.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  return (
    <li
      className="navbar-item"
      tabIndex={0}
      onClick={() => setOpen(!open)}
      ref={navRef}
      style={{ zIndex: 100, position: "relative" }}
    >
      <a href={props.to} className="max navbar-icon-button">
        {props.icon}
      </a>
      {open && props.children}
    </li>
  );
}

export function DropdownItem(props) {
  const { user, setUser } = useContext(UserContext);
  if (!user && props.loginOnly) {
    return (
      <li
        onClick={() =>
          generalError(
            "Hold on!",
            "You need to register a free account before posting"
          )
        }
      >
        <a className="max navbar-menu-item">
          {props.icon}
          <h3 className="navbar-text">{props.text}</h3>
        </a>
      </li>
    );
  } else if (
    (user &&
      props.organizationOnly &&
      user.account_type != roleMap.ADMIN &&
      user.account_type != roleMap.ORGANIZATION &&
      user.account_type != roleMap.CLUB) ||
    (!user && props.organizationOnly)
  ) {
    return (
      <li
        onClick={() =>
          generalError("Hold on!", "Only organizations can use this function")
        }
      >
        <a className="max navbar-menu-item">
          {props.icon}
          <h3 className="navbar-text">{props.text}</h3>
        </a>
      </li>
    );
  } else if (
    (user && props.adminOnly && user.account_type != roleMap.ADMIN) ||
    (!user && props.adminOnly)
  ) {
    return (
      <li
        onClick={() =>
          generalError("Unauthorized", "Only admins can access this page")
        }
      >
        <a className="max navbar-menu-item">
          {props.icon}
          <h3 className="navbar-text">{props.text}</h3>
        </a>
      </li>
    );
  } else {
    return (
      <li>
        <a
          href={props.to}
          className="max navbar-menu-item"
          onClick={() => {
            props.action && props.action();
          }}
        >
          {props.icon}
          <h3 className="navbar-text">{props.text}</h3>
        </a>
      </li>
    );
  }
}

export function DropdownMenu(props) {
  return <ul className="navbar-dropdown">{props.children}</ul>;
}
