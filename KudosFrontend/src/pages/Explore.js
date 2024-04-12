import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListingsList } from "../api/listing.js";
import ListingPanel from "../components/ListingPanel";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { ReactComponent as NextIcon } from "../icons/right.svg";
import { ReactComponent as BackIcon } from "../icons/left.svg";
import { Tooltip } from "react-tooltip";
import makeAnimated from "react-select/animated";
import MultiSelect from "../components/MultiSelect";
import { components } from "react-select";
import { communityList } from "../utility.js";

const Explore = () => {
  const [allListings, setAllListings] = useState();
  const [listings, setListings] = useState();
  const [showRequests, setShowRequests] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [sortLatest, setSortLatest] = useState(true);
  const [selectCommunity, setSelectCommunity] = useState("Select community...");
  const [pageCount, setPageCount] = useState(1);
  const [selectedPage, setSelectedPage] = useState(0);
  const [fetching, setFetching] = useState(true);
  const listingsPerPage = 12;
  const props = useParams();

  const rePage = (list, page) => {
    return list?.slice(
      page * listingsPerPage,
      Math.min(page * listingsPerPage + listingsPerPage, list.length)
    );
  };

  const slow = async () => {
    setAllListings(null);
    setListings(null);
    setFetching(true);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const fetchData = async (params = {}) => {
    await slow()
      .then(() => {
        return getListingsList(params);
      })
      .then((res) => {
        setSelectedPage(0);
        setPageCount(Math.max(Math.ceil(res.length / listingsPerPage), 1));
        setAllListings(res);
        setListings(rePage(res, 0));
        setFetching(false);
        return res;
      });
  };

  const filterListings = async ({
    requests = showRequests,
    services = showServices,
    events = showEvents,
    latest = sortLatest,
    community = selectCommunity,
  } = {}) => {
    setShowRequests(requests);
    setShowServices(services);
    setShowEvents(events);
    setSortLatest(latest);
    setSelectCommunity(community);
    if (sortLatest != latest) {
      await slow().then(() => {
        let reverse = allListings.reverse();
        setAllListings(reverse);
        setListings(rePage(reverse, 0));
        setSelectedPage(0);
        setFetching(false);
      });
    } else {
      let params = {};
      if (requests) params["listing_type"] = 0;
      if (services) params["listing_type"] = 1;
      if (events) params["listing_type"] = 2;
      if (community) params["community"] = community;
      fetchData(params);
    }
  };

  const handlePageClick = (event) => {
    setSelectedPage(event.selected);
    setListings(rePage(allListings, event.selected));
  };

  useEffect(() => {
    if (props?.type == "requests") {
      fetchData({ listing_type: 0 });
      setShowRequests(true);
    } else if (props?.type == "offers") {
      fetchData({ listing_type: 1 });
      setShowServices(true);
    } else if (props?.type == "events") {
      fetchData({ listing_type: 2 });
      setShowEvents(true);
    } else fetchData();

    document.title = "Explore | Kudos";
  }, []);

  const communityOptions = [{ value: "Any", label: "Any Community" }];
  for (let key of communityList)
    if (key != "None")
      communityOptions.push({
        value: key,
        label: key,
      });

  return (
    <div className="root-content">
      <div className="explore-search-layout">
        <button
          className={
            "explore-search-button " +
            (sortLatest ? " selected " : " unselected ") +
            (fetching ? " disabled " : " undisabled ")
          }
          onClick={() => filterListings({ latest: !sortLatest })}
          id="sortLatestButton"
          data-tooltip-content="Sort by date posted"
        >
          <Tooltip anchorId="sortLatestButton" place="bottom" />
          {sortLatest ? (
            <BsSortDown className="listing-panel-icon" />
          ) : (
            <BsSortUp className="listing-panel-icon" />
          )}
          Sort By Latest
        </button>
        <button
          className={
            "explore-search-button " +
            (showRequests ? " selected " : " unselected ") +
            (fetching ? " disabled " : " undisabled ")
          }
          onClick={() =>
            filterListings({
              requests: !showRequests,
              services: false,
              events: false,
            })
          }
          id="requestButton"
          data-tooltip-content="Show only requests"
        >
          <Tooltip anchorId="requestButton" place="bottom" />
          Requests
        </button>
        <button
          className={
            "explore-search-button " +
            (showServices ? " selected " : " unselected ") +
            (fetching ? " disabled " : " undisabled ")
          }
          onClick={() =>
            filterListings({
              requests: false,
              services: !showServices,
              events: false,
            })
          }
          id="serviceButton"
          data-tooltip-content="Show only offers"
        >
          <Tooltip anchorId="serviceButton" place="bottom" />
          Offers
        </button>
        <button
          className={
            "explore-search-button " +
            (showEvents ? " selected " : " unselected ") +
            (fetching ? " disabled " : " undisabled ")
          }
          onClick={() =>
            filterListings({
              requests: false,
              services: false,
              events: !showEvents,
            })
          }
          id="eventButton"
          data-tooltip-content="Show only events"
        >
          <Tooltip anchorId="eventButton" place="bottom" />
          Events
        </button>
        <div className="multi-select-container">
          <MultiSelect
            options={communityOptions}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option, MultiValue, animatedComponents }}
            onChange={(selected) =>
              filterListings({ community: selected["value"] })
            }
            value={{ label: selectCommunity }}
            id="communityBox"
            data-tooltip-content="Filter by community"
          />
          <Tooltip anchorId="communityBox" place="bottom" />
        </div>
        <div
          className={
            "pagination-container " + (fetching ? " disabled " : " undisabled ")
          }
          id="pageButton"
          data-tooltip-content="Select page"
          style={{ marginTop: ".25rem" }}
        >
          <ReactPaginate
            breakLabel="..."
            onPageChange={handlePageClick}
            forcePage={selectedPage}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            disabledClassName={"disabled-page"}
            pageClassName={"item pagination-page "}
            activeClassName={"active"}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            initialPage={1}
            nextClassName={"item next "}
            previousClassName={"item previous"}
            nextLabel={<NextIcon className="max" />}
            previousLabel={<BackIcon className="max" />}
          ></ReactPaginate>
          <Tooltip anchorId="pageButton" place="bottom" />
        </div>
      </div>
      <div className="explore-body-layout">
        {listings ? (
          listings.length > 0 ? (
            listings?.map((listing) => (
              <ListingPanel key={listing.id} listing={listing} />
            ))
          ) : (
            <h3>No posts matched your request</h3>
          )
        ) : (
          [0, 1, 2].map((i) => <ListingPanel key={i} skeleton />)
        )}
      </div>
    </div>
  );
};

export default Explore;

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input type="radio" checked={props.isSelected} onChange={() => null} />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const MultiValue = (props) => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const animatedComponents = makeAnimated();
