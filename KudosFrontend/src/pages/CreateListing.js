import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNewListing } from "../api/listing.js";
import {
  convertToPythonDT,
  categoryMap,
  generalLoading,
  getCurrentUser,
  roleMap,
} from "../utility.js";
import PlacesAutocomplete from "react-places-autocomplete";
import { checkSession } from "../api/user.js";

function CreateListing() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(0);
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [volunteerHours, setVolunteerHours] = useState(0);
  const [coverImage, setCoverImage] = useState();
  const props = useParams();
  const current_user = getCurrentUser();

  const asyncRun = async () => {
    await checkSession();
  };

  useEffect(() => {
    if (!current_user) navigate("/login");
    else if (
      current_user.account_type != roleMap.CLUB &&
      current_user.account_type != roleMap.ORGANIZATION &&
      current_user.account_type != roleMap.ADMIN &&
      props.type === 3
    )
      navigate("/login");
    else asyncRun();

    document.title = "Create | Kudos";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const listing = {
      title: title,
      description: description,
      listing_type: props.type,
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
    await createNewListing(listing).then(() => {
      navigate("/explore");
      navigate(0);
      return true;
    });
  };

  const FAQ = () => {
    return (
      <div
        className="faq-list"
        style={{ display: "grid", gridColumn: "span 2" }}
      >
        <div>
          <details>
            <summary style={{ textAlign: "left" }}>
              What are the differences between requests, offers, and events?
            </summary>
            <p className="faq-content">
              Requests are specific needs that someone or an organization may
              have, such as tutoring for their child or assistance with an
              errand, and other users can apply to fulfill these needs. Offers,
              on the other hand, are offered by members of the community who
              wish to assist others with their skills, such as graphic design or
              pet care. Events are posted by people or organizations to
              publicize something that is open to the public, such as concerts,
              conferences, or volunteer opportunities.
            </p>
          </details>
        </div>
        <div>
          <details>
            <summary style={{ textAlign: "left" }}>
              How does the Kudos platform facilitate requests, offers, and
              events?
            </summary>
            <p className="faq-content">
              1. Firstly, a user creates a post (listing) and shares it with the
              Kudos community.<br></br>
              <br></br>
              2. Others can then apply to these posts, with applicants needing
              to write an application on why they are qualified/interested if
              the post is a request or an offer. This allows the requester to
              vet the applicants beforehand and view the applicant's past
              history on the website. If the post is an event, the application
              will be automatically approved.<br></br>
              <br></br>
              3. Once the application is approved, both parties' contact
              information (email) will be available to each other, allowing them
              to contact each other off of the Kudos platform and arrange the
              details of the listing.<br></br>
              <br></br>
              4. Finally, both parties can create a review of each other and
              rate each other on the website.
            </p>
          </details>
        </div>
        {props.type === 0 ? (
          <div>
            <details>
              <summary style={{ textAlign: "left" }}>
                How do I create an effective request post on Kudos?
              </summary>
              <p className="faq-content">
                To create an effective request post, be sure to include a clear
                and specific title and description of your needs to help others
                understand what you are looking for. Additionally, provide
                information on the time and location of the request (if
                possible), what applicants will need and what they will do, as
                well as any necessary experience or qualifications. Including an
                image can also assist in conveying your needs to potential
                applicants.
              </p>
            </details>
          </div>
        ) : props.type === 1 ? (
          <div>
            <details>
              <summary style={{ textAlign: "left" }}>
                How do I create an effective offer post on Kudos?
              </summary>
              <p className="faq-content">
                To create an effective service post, make sure to provide a
                clear and specific title and description of your services to
                help others understand what you offer. Be sure to include your{" "}
                <b>credentials and relevant experience</b>, and explain the
                specific type of service you are offering, such as the frequency
                and duration of lessons, pricing, and the curriculum you will
                cover. If possible, include an image or resume to help showcase
                your qualifications.
              </p>
            </details>
          </div>
        ) : (
          <div>
            <details>
              <summary style={{ textAlign: "left" }}>
                How do I create an effective event post on Kudos?
              </summary>
              <p className="faq-content">
                To create an effective event post, it is important to have a
                clear and specific title and description of what your event is.
                This includes the location, date, and time of the event, as well
                as what will be happening at the event. If there are any
                requirements or qualifications needed, such as minimum age or
                experience, it is important to include those as well. Including
                an image of a past event or a flyer can help potential attendees
                visualize and understand the event better.
              </p>
            </details>
          </div>
        )}
      </div>
    );
  };

  const createRequest = () => {
    return (
      <>
        <h2 className="create-listing-header">Create a Request</h2>
        {FAQ()}
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
          {categoryMap[props?.type].map((item, index) => {
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
            }) => (
              <div>
                <input
                  {...getInputProps({ placeholder: "Enter Address" })}
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
        <h2 className="create-listing-header">Create an Offer</h2>
        {FAQ()}
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
          {categoryMap[props?.type].map((item, index) => {
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
        <h2 className="create-listing-header">Create an Event</h2>
        {FAQ()}
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
          {categoryMap[props?.type].map((item, index) => {
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
        <h2 className="create-listing-header">Post an Announcement</h2>
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
        {props.type == 0 ? (
          createRequest()
        ) : props.type == 1 ? (
          createService()
        ) : props.type == 2 ? (
          createEvent()
        ) : props.type == 3 ? (
          createBroadcast()
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default CreateListing;
