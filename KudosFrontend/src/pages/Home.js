import React from "react";
import { useState, useEffect } from "react";
import { getListingsList } from "../api/listing.js";
import ListingPanel from "../components/ListingPanel";
import { ReactComponent as NextIcon } from "../icons/right.svg";
import { Tooltip } from "react-tooltip";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, FreeMode } from "swiper";
import { FaHandshake, FaShapes, FaUsers } from "react-icons/fa";
import { BsAwardFill, BsPinMapFill } from "react-icons/bs";
import { getVerifiedUserList } from "../api/user.js";
import UserCard from "../components/UserCard.js";
import { FaInstagram, FaGoogle } from "react-icons/fa";

const Home = () => {
  const [requests, setRequests] = useState(
    [0, 1, 2].map((i) => <ListingPanel key={i} skeleton />)
  );
  const [services, setServices] = useState(
    [0, 1, 2].map((i) => <ListingPanel key={i} skeleton />)
  );
  const [events, setEvents] = useState(
    [0, 1, 2].map((i) => <ListingPanel key={i} skeleton />)
  );
  const [verifiedUsers, setVerifiedUsers] = useState(
    [0, 1, 2].map((i) => <UserCard key={i} skeleton />)
  );

  const fetchData = async (params = {}) => {
    await getListingsList({ listing_type: 0, cover_only: true }).then((res) => {
      let add = [];
      for (let i = 0; i < Math.min(3, res.length); i++)
        add.push(<ListingPanel listing={res[i]} key={i} />);
      while (add.length < 3)
        add.push(<ListingPanel skeleton key={add.length} />);
      setRequests(add);
    });
    await getListingsList({ listing_type: 1, cover_only: true }).then((res) => {
      let add = [];
      for (let i = 0; i < Math.min(3, res.length); i++)
        add.push(<ListingPanel listing={res[i]} key={i} />);
      while (add.length < 3)
        add.push(<ListingPanel skeleton key={add.length} />);
      setServices(add);
    });
    await getListingsList({ listing_type: 2, cover_only: true }).then((res) => {
      let add = [];
      for (let i = 0; i < Math.min(3, res.length); i++)
        add.push(<ListingPanel listing={res[i]} key={i} />);
      while (add.length < 3)
        add.push(<ListingPanel skeleton key={add.length} />);
      setEvents(add);
    });
    await getVerifiedUserList().then((res) => {
      setVerifiedUsers(shuffleArray(res));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div className="home-landing-text" style={{ zIndex: "10" }}>
          <h1
            className="home-landing-title"
            data-aos="fade-down"
            data-aos-delay="200"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            Kudos
          </h1>
          <div className="home-landing-sec">
            <h1
              div
              className="home-landing-sec-text"
              style={{ lineHeight: "1.7rem" }}
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="1000"
              data-aos-once="true"
            >
              Connecting Students with Local Service Opportunities
            </h1>
          </div>
          <div
            className="home-explain-div-button-inverse"
            style={{ marginTop: 0 }}
          >
            <a href="/login">Join Your Community</a>
          </div>
        </div>
        <Swiper
          spaceBetween={0}
          slidesPerView={"auto"}
          modules={[Autoplay, Pagination]}
          autoplay={{
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            loop: true,
            delay: 4000,
          }}
          pagination={{
            type: "bullets",
            clickable: true,
          }}
          className="home-swiper-container"
          style={{ background: "#F8F7FF" }}
        >
          <SwiperSlide>
            <div className="home-landing">
              <div className="home-map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d124923.60074186507!2d-73.72807112413152!3d40.78825286511247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1667749964709!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-service1.jpg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-event2.jpg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-service2.jpeg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-service4.jpg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-event5.jpg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-service5.jpg"}
              loading="lazy"
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-service3.jpeg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-event3.jpeg"}
            ></img>
          </SwiperSlide>
          <SwiperSlide className="home-slide">
            <img
              className="home-slide"
              src={window.location.origin + "/images/stock-service6.jpg"}
            ></img>
          </SwiperSlide>
        </Swiper>
      </div>
      <div style={{ background: "#F8F7FF" }}>
        <div className="home-explain-container">
          <div
            data-aos="fade-right"
            data-aos-delay="400"
            data-aos-duration="1200"
            data-aos-once="true"
            className="home-explain-div"
          >
            <div className="home-icon-container">
              <FaHandshake className="icon" />
            </div>
            <h2 style={{ marginTop: "1rem", textAlign: "center" }}>
              Hire With Confidence
            </h2>
            <ol className="home-bullet">
              <li className="home-bullet checkmark">Review and rate others</li>
              <li className="home-bullet checkmark">View past user history</li>
              <li className="home-bullet checkmark">
                Find verified high school students
              </li>
            </ol>
          </div>
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-duration="1200"
            data-aos-once="true"
            className="home-explain-div-inverse"
          >
            <div className="home-icon-container-inverse">
              <FaUsers className="icon" />
            </div>
            <h2 style={{ marginTop: "1rem", textAlign: "center" }}>
              Impact Your Community
            </h2>
            <ol className="home-bullet">
              <li className="home-bullet heart">
                Discover a variety of local events and volunteer opportunities
              </li>
              <li className="home-bullet heart">
                Fulfill requests from your community
              </li>
            </ol>
          </div>
          <div
            data-aos="fade-left"
            data-aos-delay="400"
            data-aos-duration="1200"
            data-aos-once="true"
            className="home-explain-div"
          >
            <div className="home-icon-container">
              <BsAwardFill className="icon" />
            </div>
            <h2 style={{ marginTop: "1rem", textAlign: "center" }}>
              Build Your Brand
            </h2>
            <ol className="home-bullet">
              <li className="home-bullet checkmark">
                Create a profile that highlights your talents and interests
              </li>
              <li className="home-bullet checkmark">
                Find new opportunities and expand your network
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="home-partners-text">
        <h2 className="home-partners-subtext">In collaboration with</h2>
        <Swiper
          slidesPerView={1}
          modules={[Autoplay]}
          direction="vertical"
          autoplay={{
            pauseOnMouseEnter: false,
            disableOnInteraction: false,
            loop: true,
            delay: 600,
          }}
          className="home-partners-swiper"
        >
          {verifiedUsers.map((user, i) => (
            <SwiperSlide key={"orgs" + i} className="home-partners-card">
              <UserCard user={user} disableTooltips={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div style={{ background: "#F8F7FF" }}>
        <div className="home-demo-wrapper">
          <h2 style={{ margin: 0 }}>
            <a href="/explore/events">
              <u>Get Involved - Explore Events</u>
            </a>
          </h2>
          <div className="home-listing-wrapper">
            <div
              className="home-demo-container"
              style={{ background: "#F8F7FF" }}
            >
              {events?.map((listing) => listing)}
            </div>
            <a href="/explore/events" className="home-demo-more-container">
              <NextIcon
                className="home-button-wrapper"
                id="moreEvent"
                data-tooltip-content="View recent events"
              />
              <Tooltip anchorId="moreEvent"></Tooltip>
            </a>
          </div>
        </div>
      </div>
      <div style={{ background: "white", position: "relative" }}>
        <div className="custom-shape-divider-top-1677016245">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
        <div className="home-demo-wrapper" style={{ isolation: "isolate" }}>
          <h2 style={{ margin: 0, zIndex: 120, position: "relative" }}>
            <a href="/explore/requests">
              <u>Offer Your Skills - Explore Requests</u>
            </a>
          </h2>
          <div className="home-listing-wrapper">
            <div
              className="home-demo-container"
              style={{ background: "white" }}
            >
              {requests?.map((listing) => listing)}
            </div>
            <a href="/explore/requests" className="home-demo-more-container">
              <NextIcon
                className="home-button-wrapper"
                id="moreRequest"
                data-tooltip-content="View recent requests"
              />
              <Tooltip anchorId="moreRequest"></Tooltip>
            </a>
          </div>
        </div>
      </div>
      <div style={{ background: "white", position: "relative" }}>
        <div className="custom-shape-divider-bottom-1677016566">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
        <div className="home-demo-wrapper" style={{ isolation: "isolate" }}>
          <h2 style={{ margin: 0, zIndex: 120, position: "relative" }}>
            <a href="/explore/offers">
              <u>Discover Talent - Explore Offers</u>
            </a>
          </h2>
          <div className="home-listing-wrapper">
            <div
              className="home-demo-container"
              style={{ background: "white" }}
            >
              {services?.map((listing) => listing)}
            </div>
            <a href="/explore/offers" className="home-demo-more-container">
              <NextIcon
                className="home-button-wrapper"
                id="moreOffer"
                data-tooltip-content="View recent offers"
              />
              <Tooltip anchorId="moreOffer"></Tooltip>
            </a>
          </div>
        </div>
      </div>
      <div style={{ background: "#F8F7FF" }}>
        <div className="home-explain-container">
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            data-aos-duration="1200"
            data-aos-once="true"
            className="home-explain-div twentyrem"
          >
            <div className="home-icon-container">
              <BsPinMapFill className="icon" />
            </div>
            <h2 style={{ marginTop: "1rem", textAlign: "center" }}>
              Local Talent Meets Local Need
            </h2>
            <p>
              Kudos was created with a
              simple idea — to make it easier for people to make a difference in
              their local community. Kudos believes in the power of community and
              its mission is to create a space where people can easily connect and
              help one another.
            </p>
          </div>
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            data-aos-duration="1200"
            data-aos-once="true"
            className="home-explain-div twentyrem"
          >
            <div className="home-icon-container">
              <FaShapes className="icon" />
            </div>
            <h2 style={{ marginTop: "1rem", textAlign: "center" }}>
              Shape the Future of Kudos
            </h2>
            <p>
              Kudos is constantly evolving, and there are many exciting
              ideas and features in the pipeline. Talented students who wish to contribute and help build the best possible
              platform are encouraged to reach out at
              support@kudosconnect.org.
            </p>
          </div>
        </div>
      </div>
      <div style={{ background: "#F8F7FF" }}>
        <div className="home-explain-container">
          <div
            data-aos="fade-down"
            data-aos-delay="200"
            data-aos-duration="1200"
            data-aos-once="true"
            className="home-explain-div-inverse"
            style={{ height: "fit-content" }}
          >
            <p style={{ textAlign: "center" }}>
              Don't wait to make a difference — become a Kudos member today
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "1rem",
              }}
            >
              <div
                className="home-explain-div-button"
                style={{ backgroundColor: "#ac2bac", color: "white" }}
              >
                <a href="/login">
                  <FaGoogle />
                </a>
              </div>
              <div className="home-explain-div-button">
                <a href="/community">FAQ</a>
              </div>
              <div
                className="home-explain-div-button"
                style={{ backgroundColor: "#ac2bac", color: "white" }}
              >
                <a href="https://www.instagram.com/kudosconnect/">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
