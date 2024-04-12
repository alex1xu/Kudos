import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  communityList,
  generalLoading,
  getCurrentUser,
  loginCurrentUser,
} from "../utility.js";
import { updateUserProfile, checkSession } from "../api/user.js";
import { UserContext } from "../components/UserContext";

function Settings() {
  const { user, setUser } = useContext(UserContext);
  const current_user = getCurrentUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [community, setCommunity] = useState("");

  const asyncRun = async () => {
    await checkSession();
  };

  useEffect(() => {
    if (!current_user) navigate("/login");
    else asyncRun();

    setUsername(current_user?.username);
    setBio(current_user?.bio);
    setWebsiteLink(current_user?.website_link);
    setCommunity(current_user?.community);

    document.title = "Settings | Kudos";
  }, []);

  const [profilePicture, setProfilePicture] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const new_user = {
      username: username,
      bio: bio,
      website_link: websiteLink,
      profile_picture_link: profilePicture,
      community: community,
    };
    generalLoading();
    await updateUserProfile(current_user, new_user).then(async (res) => {
      setUser(res);
      loginCurrentUser(res);
      navigate("/profile/" + res.username);
      return true;
    });
  };

  return (
    <div className="root-content">
      <div className="create-listing-layout">
        <h2 className="create-listing-header">Update Profile</h2>
        <h3>Username</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="sm"
            value={username}
            maxLength={30}
            rows={1}
            style={{ height: "auto" }}
            required
            placeholder="Enter username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <h3>Bio</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="lg"
            value={bio}
            maxLength={1000}
            rows={10}
            style={{ height: "auto" }}
            required
            placeholder="Ex: I'm John, a graphic designer with over 5 years of experience. I specialize in creating logos and branding that capture the essence of your brand and help you stand out in a crowded market. I've worked with a diverse range of clients, from startups to established businesses, and I pride myself on delivering work that exceeds expectations. When I'm not designing, you can find me hiking, reading, or tinkering with my vintage record player. Let's work together to take your branding to the next level."
            onChange={(event) => setBio(event.target.value)}
          />
        </div>
        <h3>Website Link</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="lg"
            value={websiteLink}
            maxLength={1000}
            rows={1}
            style={{ height: "auto" }}
            required
            placeholder="Enter Website Link"
            onChange={(event) => setWebsiteLink(event.target.value)}
          />
        </div>
        <h3>Profile Picture</h3>
        <div
          className="create-listing-input-container"
          style={{ height: "fit-content" }}
        >
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={(event) => {
              setProfilePicture(event.target.files[0]);
            }}
            required
          />
        </div>
        <h3>Community</h3>
        <select
          className="create-listing-general-container"
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
        >
          {communityList.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <button onClick={handleSubmit} className="create-listing-button">
          Submit
        </button>
      </div>
    </div>
  );
}

export default Settings;
