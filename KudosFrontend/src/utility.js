import Swal from "sweetalert2";
import { logout } from "./api/user";

export function handleError(response) {
  if (response?.status == 400) {
    erroneousForm(response?.data["message"]);
    return Promise.reject(new Error("Bad Request"));
  } else if (response?.status == 401) {
    erroneousForm(response?.data["message"]);
    return Promise.reject(new Error("Session expired — please login again"));
  } else {
    unknownError(response?.data["message"]);
    return Promise.reject(new Error("Unknown Error"));
  }
}

export function loginCurrentUser(current_user) {
  localStorage.setItem("current_user", JSON.stringify(current_user));
  return true;
}

export function getCurrentUser() {
  const current_user = localStorage.getItem("current_user");
  if (!current_user) return undefined;
  return JSON.parse(current_user);
}

export function logoutCurrentUser() {
  localStorage.removeItem("current_user");
  logout();
  return true;
}

export function convertToPythonDT(datetime) {
  if (datetime !== undefined)
    return new Date(datetime).toISOString().slice(0, 19).replace("T", " ");
  else return undefined;
}

export function convertToDisplayDT(datetime) {
  return new Date(datetime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    minute: "numeric",
    hour: "numeric",
  });
}

export const categoryMap = [
  [
    "Employment",
    "Errand",
    "Household",
    "Paid",
    "Pet care",
    "Transportation",
    "Tutoring",
    "Volunteer",
  ],
  [
    "Baby-sitting",
    "Cleaning",
    "Consulting",
    "Event planning",
    "Graphic design",
    "Handyman",
    "Lessons",
    "Marketing/advertising",
    "Pet care",
    "Transportation",
    "Video editing",
    "Web development",
    "Writing/editing",
    "Yard work",
  ],
  [
    "Concert",
    "Conference",
    "Convention",
    "Exhibition",
    "Festival",
    "Fundraiser",
    "Game Night",
    "Hackathon",
    "Lecture",
    "Meeting",
    "Meeting (Recurring)",
    "Networking Event",
    "Panel Discussion",
    "Rally",
    "Sports Game",
    "Symposium",
    "Theater Production",
    "Volunteer",
    "Workshop",
  ],
];

export const statusMap = {
  0: ["Under review", "#ff8812"],
  2: ["Accepted", "#51cf57"],
  3: ["Rejected", "#ff1c08"],
  4: ["Completed(Deprecated)", "#ff36a8"],
  5: ["Reviewed", "#9836FF"],
  6: ["Reviewed", "#9836FF"],
  7: ["Completed", "#ff36a8"],
};

export const roleMap = {
  UNMAPPED: 0,
  STUDENT: 1,
  ORGANIZATION: 2,
  ADMIN: 3,
  CLUB: 4,
};

export const communityList = [
  "None",
  "Great Neck",
  "Manhasset",
  "Roslyn",
  "Herricks",
  "Port Washington",
  "Jericho",
  "Syosset",
  "Bronx",
  "Brooklyn",
  "Queens",
  "Manhattan",
  "Staten Island",
];

function showAlert({ icon, title, text, timer, footer, onClose }) {
  Swal.close();
  let timerInterval;
  Swal.fire({
    icon,
    title,
    text,
    footer,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        if (b) b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
      if (onClose) onClose();
    },
  });
}

export function erroneousForm(message = "Missing or invalid field values") {
  showAlert({
    icon: "error",
    title: "Erroneous Form",
    text: message,
    footer: '<a href="/community">Report a bug?</a>',
    timer: 2000,
  });
}

export function unknownError(message) {
  showAlert({
    icon: "error",
    title: "Unknown Error",
    text: message,
    footer: '<a href="/community">Report this bug</a>',
    timer: 5000,
  });
}

export function forceLogout() {
  showAlert({
    icon: "error",
    title: "Session Expired",
    text: "Inactive for too long since your last login",
    timer: 2000,
    onClose: () => {
      logoutCurrentUser();
      window.location.href = escape("/login");
    },
  });
}

export function confirmDelete(res_func) {
  showAlert({
    title: "Are you sure?",
    text: "You won't be able to revert this",
    footer: '<a href="/community">Report a bug?</a>',
    confirmButtonColor: "#d33",
    confirmButtonText: "Delete permanently",
    onClose: () => {
      if (Swal.getResult().isConfirmed) res_func();
    },
  });
}

export function confirmReport(res_func) {
  showAlert({
    title: "Are you sure?",
    text: "Please use this feature responsibly, as abuse of this power may result in the deactivation of your account.",
    footer: '<a href="/community">Report a bug?</a>',
    confirmButtonColor: "#d33",
    confirmButtonText: "Report user",
    onClose: () => {
      if (Swal.getResult().isConfirmed) res_func();
    },
  });
}

export function generalSuccess(primary, secondary) {
  showAlert({
    icon: "success",
    title: primary,
    text: secondary,
    footer: '<a href="/">Provide feedback?</a>',
    timer: 2500,
  });
}

export function generalError(primary, secondary) {
  showAlert({
    icon: "error",
    title: primary,
    text: secondary,
    footer: '<a href="/">Report a bug?</a>',
    timer: 4000,
  });
}

export function generalLoading() {
  showAlert({
    title: "Loading",
    text: "Please wait while we process your request",
    footer: '<a href="/community">Report a bug?</a>',
  });
}