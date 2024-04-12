import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/bundle";
import App from "./App";
import { inject } from "@vercel/analytics";
import "react-tooltip/dist/react-tooltip.css";

inject();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
