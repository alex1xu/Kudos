import React from "react";
import { statusMap } from "../utility.js";

function StatusCard(props) {
  return (
    <div className="status-card-container">
      <div
        className="status-card-symbol"
        style={{ backgroundColor: statusMap[props.status][1] }}
      ></div>
      <div className="status-card-text">
        <h4>
          <b>{statusMap[props.status][0]}</b>
        </h4>
      </div>
    </div>
  );
}

export default StatusCard;
