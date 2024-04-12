import React from "react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginByEmail, createNewUser } from "../api/user.js";
import jwt_decode from "jwt-decode";
import { FaUsers } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { BsFillAwardFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { loginCurrentUser } from "../utility.js";
import { UserContext } from "../components/UserContext";

function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const onPageLoad = () => {
    window?.google?.accounts?.id?.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleSignIn,
    });
    window?.google?.accounts?.id?.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "filled_blue",
        size: "large",
        type: "standard",
        shape: "pill",
        logo_alignment: "left",
      }
    );
  };

  window.onload = onPageLoad;

  async function handleSignIn(response) {
    const creds = jwt_decode(response.credential);
    await loginByEmail(creds.email).then((loginUser) => {
      if ("id" in loginUser) {
        loginCurrentUser(loginUser);
        setUser(loginUser);
        navigate("/profile/" + loginUser.username);
      } else {
        Swal.mixin({
          customClass: {
            confirmButton: "swal-confirm",
          },
        })
          .fire({
            title: "Welcome to Kudos!",
            text: "What should we call you?",
            input: "text",
            confirmButtonText: "Register",
            inputPlaceholder: "Enter username",
            showCancelButton: false,
            allowOutsideClick: false,
          })
          .then(async (username) => {
            const loginUser = {
              first_name: creds.given_name,
              last_name: creds.family_name,
              username: username.value,
              email: creds.email,
              profile_picture_setting: 0,
              profile_picture_link: creds.picture,
            };

            await createNewUser(loginUser).then(async (res) => {
              loginCurrentUser(res);
              setUser(loginUser);
              navigate("/profile/" + res.username);
              return true;
            });
          });
      }
    });
  }

  return (
    <div className="root-content">
      <div className="panel-container-sq create-account-panel">
        <img
          src={require("../logo/icon-blue.png")}
          style={{ width: "7rem", marginBottom: ".5rem", marginTop: "-4.5rem" }}
        />
        <img
          src={require("../logo/text-blue.png")}
          style={{ width: "10rem", marginBottom: "2rem" }}
        />
        <h3 style={{ textAlign: "center" }}>
          Join 50+ students and 10+ organizations across 5 New York districts
        </h3>
        <div style={{ width: "300px !important", height: "100px !important" }}>
          <div id="signInDiv" className="login-api-container"></div>
        </div>
        <div className="login-list-container">
          <div className="login-block-container">
            <div className="login-icon-container">
              <FaUsers className="icon" />
            </div>
            <p>
              Discover a wealth of <b>talent</b> in your local community
            </p>
          </div>
          <div className="login-block-container">
            <div className="login-icon-container">
              <BsFillAwardFill className="icon" />
            </div>
            <p>
              Build your personal <b>brand</b> and showcase your skills
            </p>
          </div>
          <div className="login-block-container">
            <div className="login-icon-container">
              <MdTipsAndUpdates className="icon" />
            </div>
            <p>
              Stay up-to-date with local events and <b>volunteer</b>{" "}
              opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
