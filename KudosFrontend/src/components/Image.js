import React, { useState, useEffect } from "react";
import { getListingPresignedURL } from "../api/listing.js";
import { getUserPresignedURL } from "../api/user.js";

function Image(props) {
  const [imageLink, setImageLink] = useState("");
  const fetchData = async () => {
    if (props.listing && props.src?.picture_link)
      await getListingPresignedURL(props.src?.picture_link).then((res) => {
        setImageLink(res["message"]);
      });
    else if (props.user && props.src?.profile_picture_setting) {
      await getUserPresignedURL(props.src?.profile_picture_link).then((res) => {
        setImageLink(res["message"]);
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [props.src]);

  const [imgLoaded, setImgLoaded] = useState(false);
  function handleImgLoad() {
    setImgLoaded(true);
  }

  if (props.listing)
    return props.unlimited ? (
      <div
        className={
          (!imageLink && "filler skeleton") + " image-unlimited-container"
        }
      >
        <img src={imageLink} className="image-unlimited-container"></img>
      </div>
    ) : props.large ? (
      <div
        className="filler skeleton"
        style={{ width: "100%", height: "25rem" }}
      >
        <img src={imageLink}></img>
      </div>
    ) : (
      <div className="filler skeleton">
        <img src={imageLink}></img>
      </div>
    );
  else if (props.user)
    return props.src?.profile_picture_setting ? (
      <img
        src={imageLink}
        referrerPolicy="no-referrer"
        className="profile-img skeleton"
      ></img>
    ) : (
      <img
        src={props.src?.profile_picture_link}
        referrerPolicy="no-referrer"
        className={
          "profile-img " +
          (!imgLoaded && props.src?.profile_picture_link
            ? "skeleton"
            : "white-background")
        }
        onLoad={handleImgLoad}
      ></img>
    );
}

export default Image;
