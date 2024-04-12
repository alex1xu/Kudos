import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import ReviewCard from "../components/ReviewCard";
import { getUserByUsername } from "../api/user.js";
import {
  getReviewsByRecieverId,
  getReviewsByReviewerId,
} from "../api/review.js";
import { FiThumbsUp } from "react-icons/fi";
import { MdReportGmailerrorred } from "react-icons/md";
import { getStringTime } from "../utility.js";
import { BsClock, BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";
import { AiOutlineLink } from "react-icons/ai";
import Image from "../components/Image";
import { generalError, getCurrentUser, roleMap } from "../utility.js";
import { StickyShareButtons } from "sharethis-reactjs";
import ApplicationPanel from "../components/ApplicationPanel";
import ListingPanel from "../components/ListingPanel";
import { getListingsByUserId } from "../api/listing.js";
import { getApplicationsByUserId } from "../api/application.js";

function Profile() {
  ChartJS.register(...registerables);
  const [user, setUser] = useState();
  const [reviews, setReviews] = useState();
  const [reviews2, setReviews2] = useState();
  const [listings, setListings] = useState();
  const [applications, setApplications] = useState();
  const props = useParams();
  const currentUser = getCurrentUser();
  const [username, setUsername] = useState(props.username);
  const fetchData = async () => {
    await getUserByUsername(props.username).then(async (res) => {
      if (Object.keys(res).length == 0) {
        generalError(
          "User not found",
          "Please logout and clear website cookies and caches"
        );
      } else {
        setUser(res);
        if (res?.account_type > 2) setUsername(res.username);
        await getReviewsByRecieverId(res?.id).then((reviews) => {
          setReviews(reviews);
        });
        await getReviewsByReviewerId(res?.id).then((reviews2) => {
          setReviews2(reviews2);
        });
        await getListingsByUserId(res?.id).then((listings) => {
          setListings(listings);
        });
        await getApplicationsByUserId(res?.id).then((applications) => {
          setApplications(applications);
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
    document.title = props.username + " | Kudos";
  }, []);

  const [kudos, setKudos] = useState([0, 0, 0, 0, 0, 0]);
  const [kudos2, setKudos2] = useState([0, 0, 0, 0, 0, 0]);

  const calculateAverage = (list) => {
    let sum = 0;
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      sum += (5 - i) * list[i];
      total += list[i];
    }
    if (total == 0) return 2.5;
    else return sum / total;
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
    const aggregate = [0, 0, 0, 0, 0, 0];
    reviews?.forEach((review) => {
      aggregate[review?.rating]++;
    });
    setKudos(aggregate.reverse());
  }, [reviews]);

  useEffect(() => {
    const aggregate2 = [0, 0, 0, 0, 0, 0];
    reviews2?.forEach((review2) => {
      aggregate2[review2?.rating]++;
    });
    setKudos2(aggregate2.reverse());
  }, [reviews2]);

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
          show_total: true,
          size: 48,
          top: 100,
        }}
      />
      <div className="profile-layout-top">
        <div className="profile-img-wrapper">
          <Image src={user} user></Image>
        </div>
        {user?.account_type == roleMap.STUDENT ||
        user?.account_type == roleMap.UNMAPPED ? (
          <>
            <h1 style={{ margin: 0 }}>
              {user?.first_name} {user?.last_name}
            </h1>
            <h2 style={{ textAlign: "center", margin: ".5rem" }}>
              @{user?.username}
            </h2>
          </>
        ) : user?.account_type == roleMap.CLUB ? (
          <>
            <h1 style={{ margin: 0 }}>{user?.username}</h1>
            <h2 style={{ textAlign: "center", margin: ".5rem" }}>Club</h2>
          </>
        ) : user?.account_type == roleMap.ADMIN ? (
          <>
            <h1 style={{ margin: 0 }}>{user?.username}</h1>
            <h2 style={{ textAlign: "center", margin: ".5rem" }}>
              Administration
            </h2>
          </>
        ) : (
          <>
            <h1 style={{ margin: 0 }}>{user?.username}</h1>
            <h2 style={{ textAlign: "center", margin: ".5rem" }}>
              Organization
            </h2>
          </>
        )}
        <div className="profile-bio-container">
          <div className="profile-stat-div">
            <div className="profile-stat-container">
              <FiThumbsUp className="profile-stat-icon" />
              <h3>Recieved {user?.kudos} Kudos</h3>
            </div>
            <div className="profile-stat-container">
              <BsClock className="profile-stat-icon" />
              <h3>Joined {getStringTime(user?.create_datetime)}</h3>
            </div>
            <div className="profile-stat-container">
              <MdReportGmailerrorred className="profile-stat-icon" />
              <h3>Reported {user?.reports} times</h3>
            </div>
          </div>
          {user?.website_link && (
            <div className="profile-stat-container profile-link-container">
              <AiOutlineLink className="profile-stat-icon" />
              <a href={user?.website_link}>
                <h3 style={{ color: "white" }}>Website</h3>
              </a>
            </div>
          )}
          <h4 style={{ textAlign: "center", marginTop: "2rem" }}>
            {user?.bio}
          </h4>
          {user?.id == currentUser?.id && (
            <h4
              className="edit-listing-button"
              style={{ margin: "auto", marginTop: "1rem" }}
            >
              <a href={"/settings"}>Edit Profile</a>
            </h4>
          )}
        </div>
      </div>
      <div
        className="profile-layout-top"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        {listings && listings.length > 0 ? (
          <>
            <h3>{username}'s Listings</h3>
            <div className="dashboard-listings-layout">
              {listings.map((listing) => (
                <ListingPanel listing={listing} key={listing.id} />
              ))}
            </div>
          </>
        ) : (
          <h3>This user has not posted any listings yet</h3>
        )}
      </div>
      {currentUser && currentUser?.id == user?.id && (
        <div
          className="profile-layout-top"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          {applications && applications.length > 0 ? (
            <>
              <h3>{username}'s Applications (visible only to you)</h3>
              <div className="dashboard-listings-layout">
                {applications.map((application) => (
                  <ApplicationPanel
                    application={application}
                    key={application.id}
                  />
                ))}
              </div>
            </>
          ) : (
            <h3>This user has no active applications</h3>
          )}
        </div>
      )}
      <div
        className="profile-layout-top"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        {reviews && reviews?.length > 0 ? (
          <>
            <h3>Reviews of {username}</h3>
            <div className="profile-bottom-container">
              <div className="profile-reviews-container">
                {reviews?.map((review, index) => (
                  <div key={review.id + " : " + index}>
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {[
                    ...Array(
                      Math.round(calculateAverage(kudos) + Number.EPSILON)
                    ).keys(),
                  ].map((i) => (
                    <div className="profile-heart-handshake-container" key={i}>
                      <BsSuitHeartFill
                        className="heart-handshake"
                        style={{ color: colorOrder[5 - i] }}
                      />
                    </div>
                  ))}
                  {[
                    ...Array(
                      5 - Math.round(calculateAverage(kudos) + Number.EPSILON)
                    ).keys(),
                  ].map((i) => (
                    <div className="profile-heart-handshake-container" key={i}>
                      <BsSuitHeart
                        className="heart-handshake"
                        style={{ color: colorOrder[5 - i] }}
                      />
                    </div>
                  ))}
                </div>
                <Bar
                  style={{
                    display: "grid",
                    gridColumnEnd: "span 1",
                    justifySelf: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                  data={{
                    labels: [
                      "5 Kudos",
                      "4 Kudos",
                      "3 Kudos",
                      "2 Kudos",
                      "1 Kudo",
                      "0 Kudos",
                    ],
                    datasets: [
                      {
                        label: "Reviews: ",
                        data: kudos,
                        backgroundColor: colorOrder,
                      },
                    ],
                  }}
                  options={{
                    responsive: false,
                    maintainAspectRatio: true,
                    indexAxis: "y",
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: { display: false },
                      },
                      y: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <h3>This user has not received any reviews yet</h3>
        )}
      </div>
      <div
        className="profile-layout-top"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        {reviews2 && reviews2?.length > 0 ? (
          <>
            <h3>Reviews by {username}</h3>
            <div className="profile-bottom-container">
              <div className="profile-reviews-container">
                {reviews2?.map((review2, index) => (
                  <div key={review2.id + " : " + index}>
                    <ReviewCard review={review2} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {[
                    ...Array(
                      Math.round(calculateAverage(kudos2) + Number.EPSILON)
                    ).keys(),
                  ].map((i) => (
                    <div className="profile-heart-handshake-container" key={i}>
                      <BsSuitHeartFill
                        className="heart-handshake"
                        style={{ color: colorOrder[5 - i] }}
                      />
                    </div>
                  ))}
                  {[
                    ...Array(
                      5 - Math.round(calculateAverage(kudos2) + Number.EPSILON)
                    ).keys(),
                  ].map((i) => (
                    <div className="profile-heart-handshake-container" key={i}>
                      <BsSuitHeart
                        className="heart-handshake"
                        style={{ color: colorOrder[5 - i] }}
                      />
                    </div>
                  ))}
                </div>
                <Bar
                  style={{
                    display: "grid",
                    gridColumnEnd: "span 1",
                    justifySelf: "center",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                  data={{
                    labels: [
                      "5 Kudos",
                      "4 Kudos",
                      "3 Kudos",
                      "2 Kudos",
                      "1 Kudo",
                      "0 Kudos",
                    ],
                    datasets: [
                      {
                        label: "Reviews: ",
                        data: kudos2,
                        backgroundColor: [
                          "#FFD12C",
                          "#FFD12C",
                          "#FBC629",
                          "#F8BC25",
                          "#F4B122",
                          "#F0A61E",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: false,
                    maintainAspectRatio: true,
                    indexAxis: "y",
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: { display: false },
                      },
                      y: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <h3>This user has not written any reviews yet</h3>
        )}
      </div>
    </div>
  );
}

export default Profile;
