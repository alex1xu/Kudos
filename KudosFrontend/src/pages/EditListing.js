import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editListing, getListingById } from "../api/listing.js";
import {
  convertToPythonDT,
  categoryMap,
  generalLoading,
  getCurrentUser,
  generalError,
  roleMap,
} from "../utility.js";
import PlacesAutocomplete from "react-places-autocomplete";
import { checkSession } from "../api/user.js";
import moment from "moment";

function EditListing() {
  const navigate = useNavigate();
  const props = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(0);
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [volunteerHours, setVolunteerHours] = useState(0);
  const [coverImage, setCoverImage] = useState();
  const [listing, setListing] = useState();
  const current_user = getCurrentUser();

  const asyncRun = async () => {
    await checkSession().then(async (res) => {
      if (res) {
        await getListingById(props.id).then((res) => {
          if (res?.requester_id == current_user?.id) {
            setListing(res);
            setTitle(res?.title);
            setDescription(res?.description);
            setCategory(res?.listing_category);
            setAddress(res?.location_name);
            setStartTime(
              moment(res?.start_datetime).format("YYYY-MM-DDTkk:mm")
            );
            setEndTime(moment(res?.end_datetime).format("YYYY-MM-DDTkk:mm"));
            setPayAmount(res?.pay_amount);
            setVolunteerHours(res?.volunteer_hours);
          } else generalError("Unauthorized");
        });
      }
    });
  };

  useEffect(() => {
    if (!current_user) navigate("/login");
    else if (
      current_user.account_type != roleMap.CLUB &&
      current_user.account_type != roleMap.ORGANIZATION &&
      current_user.account_type != roleMap.ADMIN &&
      props.type == 3
    )
      navigate("/login");
    else asyncRun();

    document.title = "Edit | Kudos";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const edited_listing = {
      title: title,
      description: description,
      listing_type: listing?.listing_type,
      listing_category: category,
      location_name: address,
      pay_amount: payAmount,
      volunteer_hours: volunteerHours,
      start_datetime: convertToPythonDT(startTime),
      end_datetime: convertToPythonDT(endTime),
      cover_image: coverImage,
      requester_id: current_user.id,
    };

    generalLoading();
    await editListing(edited_listing, props.id).then((res) => {
      navigate("/listing/" + props.id);
      navigate(0);
      return true;
    });
  };

  const createRequest = () => {
    return (
      <>
        <h2 className="create-listing-header">Edit Your Request</h2>
        <h3>Title</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="sm"
            value={title}
            maxLength={150}
            rows={2}
            style={{ height: "auto" }}
            placeholder="Ex: Need someone to walk my dog while I'm at work"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <h3>Description</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            maxLength={1500}
            className="lg"
            rows={19}
            value={description}
            style={{ height: "auto" }}
            placeholder="Looking for a reliable dog walker to help me out while I'm at work. My furry friend needs some exercise during the day, and I can't always be there to take him out. He's a friendly and well-trained pup who loves to go for walks. If you're a dog lover who's available during the weekdays, please let me know! Compensation negotiable."
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <h3>Category</h3>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="create-listing-general-container"
        >
          {categoryMap[listing?.listing_type].map((item, index) => {
            return (
              <option key={index} value={index}>
                {item}
              </option>
            );
          })}
        </select>
        <h3>Request Address</h3>
        <div className="create-listing-location-container">
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={setAddress}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({ placeholder: "Enter Address" })}
                  style={{ width: "100%" }}
                ></input>
                <ul className="create-dropdown">
                  {suggestions.map((suggestion, idx) => {
                    return (
                      <li
                        {...getSuggestionItemProps(suggestion)}
                        key={idx}
                        className="create-dropdown-item"
                      >
                        {suggestion.description}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <h3>Start and End Time</h3>
        <div className="create-listing-grouped-input-container">
          <input
            type="datetime-local"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </div>
        <h3>Payment Amount ($)</h3>
        <div>
          <input
            type="number"
            min={0}
            step={1}
            max={1000}
            value={payAmount}
            onChange={(event) => setPayAmount(event.target.value)}
          />
        </div>
        <h3>Cover Image</h3>
        <input
          className="create-listing-input-container"
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(event) => {
            setCoverImage(event.target.files[0]);
          }}
        />
        <button onClick={handleSubmit} className="create-listing-button">
          Submit
        </button>
        <p style={{ color: "red", fontSize: ".7rem" }}>
          By posting a request on Kudos, you agree to make your information
          public and available on the site for other users to view and apply.{" "}
          <b>
            If someone applies to your request and you accept, they may be able
            to see your email and contact you
          </b>
          . We take reasonable measures to ensure the safety and security of our
          users, but we cannot guarantee the actions of others. Please use
          caution and good judgment when communicating with potential
          applicants.
        </p>
      </>
    );
  };

  const createService = () => {
    return (
      <>
        <h2 className="create-listing-header">Edit Your Offer</h2>
        <h3>Title</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="sm"
            value={title}
            maxLength={150}
            rows={2}
            style={{ height: "auto" }}
            placeholder="Ex: Offering graphic design services for logos and branding"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <h3>Description</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            maxLength={1500}
            className="lg"
            rows={19}
            value={description}
            style={{ height: "auto" }}
            placeholder="Looking for a standout logo or a strong brand identity? Look no further! As a seasoned graphic designer with over 5 years of experience, I can create stunning designs that make your business stand out from the rest. Whether you're a new start-up or looking to rebrand, I offer professional and customized designs that are tailored to your specific needs. Let's work together to create a visual representation of your brand that will help you succeed!"
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <h3>Category</h3>
        <select
          className="create-listing-general-container"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryMap[listing?.listing_type].map((item, index) => {
            return (
              <option key={index} value={index}>
                {item}
              </option>
            );
          })}
        </select>
        <h3>Buyer Fee ($)</h3>
        <div>
          <input
            type="number"
            min={0}
            step={1}
            max={1000}
            value={payAmount}
            onChange={(event) => setPayAmount(event.target.value)}
          />
        </div>
        <h3>Cover Image</h3>
        <input
          className="create-listing-input-container"
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(event) => {
            setCoverImage(event.target.files[0]);
          }}
        />
        <button onClick={handleSubmit} className="create-listing-button">
          Submit
        </button>
        <p style={{ color: "red", fontSize: ".7rem" }}>
          By posting an offer on Kudos, you agree to make your information
          public and available on the site for other users to view and apply.{" "}
          <b>
            If someone requests your service and you accept, they may be able to
            see your email and contact you
          </b>
          . We take reasonable measures to ensure the safety and security of our
          users, but we cannot guarantee the actions of others. Please use
          caution and good judgment when communicating with potential
          applicants.
        </p>
      </>
    );
  };

  const createEvent = () => {
    return (
      <>
        <h2 className="create-listing-header">Edit Your Event</h2>
        <h3>Title</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="sm"
            value={title}
            maxLength={150}
            rows={2}
            style={{ height: "auto" }}
            placeholder="Ex: Community clean-up event to maintain local parks"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <h3>Description</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            maxLength={1500}
            className="lg"
            rows={19}
            value={description}
            style={{ height: "auto" }}
            placeholder="Join us for a community clean-up event where we'll come together to maintain and improve our local parks. All members of the community are welcome to participate and make a difference. This event is organized by a team of experienced volunteers who have a passion for preserving the environment and creating a better community. Together, we can work towards a cleaner and greener future for everyone. Let's make our parks shine!"
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <h3>Category</h3>
        <select
          className="create-listing-general-container"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryMap[listing?.listing_type].map((item, index) => {
            return (
              <option key={index} value={index}>
                {item}
              </option>
            );
          })}
        </select>
        <h3>Event Address</h3>
        <div className="create-listing-location-container">
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={setAddress}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div style={{ position: "relative" }}>
                <input
                  {...getInputProps({ placeholder: "Enter Address" })}
                  style={{ width: "100%" }}
                ></input>
                <ul className="create-dropdown">
                  {suggestions.map((suggestion, idx) => {
                    return (
                      <li
                        {...getSuggestionItemProps(suggestion)}
                        key={idx}
                        className="create-dropdown-item"
                      >
                        {suggestion.description}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <h3>Start and End Time</h3>
        <div className="create-listing-grouped-input-container">
          <input
            type="datetime-local"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </div>
        <h3>Volunteer Hours</h3>
        <div>
          <input
            type="number"
            min={1}
            step={0.5}
            max={100}
            value={volunteerHours}
            onChange={(event) => setVolunteerHours(event.target.value)}
          />
        </div>
        <h3>Cover Image</h3>
        <input
          className="create-listing-input-container"
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(event) => {
            setCoverImage(event.target.files[0]);
          }}
        />
        <button onClick={handleSubmit} className="create-listing-button">
          Submit
        </button>
        <p style={{ color: "red", fontSize: ".7rem" }}>
          By posting an event on Kudos, you agree to make your information
          public and available on the site for other users to view and apply.{" "}
          <b>
            If someone applies to your event, they may be able to see your email
            and contact you
          </b>
          . We take reasonable measures to ensure the safety and security of our
          users, but we cannot guarantee the actions of others. Please use
          caution and good judgment when communicating with potential
          applicants.
        </p>
      </>
    );
  };

  const createBroadcast = () => {
    return (
      <>
        <h2 className="create-listing-header">Edit Your Announcement</h2>
        <h3>Title</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            className="sm"
            value={title}
            maxLength={150}
            rows={2}
            style={{ height: "auto" }}
            placeholder="Ex: We are excited to join the Kudos community!"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <h3>Description</h3>
        <div className="create-listing-input-container">
          <textarea
            type="text"
            maxLength={1500}
            className="lg"
            rows={19}
            value={description}
            style={{ height: "auto" }}
            placeholder="Be on the lookout for upcoming events."
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <button onClick={handleSubmit} className="create-listing-button">
          Submit
        </button>
      </>
    );
  };

  return (
    <div className="root-content">
      <div className="create-listing-layout">
        {listing &&
          (listing?.listing_type == 0 ? (
            createRequest()
          ) : listing?.listing_type == 1 ? (
            createService()
          ) : listing?.listing_type == 2 ? (
            createEvent()
          ) : listing?.listing_type == 3 ? (
            createBroadcast()
          ) : (
            <></>
          ))}
      </div>
    </div>
  );
}

export default EditListing;
