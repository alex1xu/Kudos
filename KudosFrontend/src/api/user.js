import Swal from "sweetalert2";
import api from "../api/httpClient";
import {
  forceLogout,
  generalLoading,
  handleError,
} from "../utility";

export async function createNewUser(user) {
  generalLoading();
  return await api
    .post(`user/`, JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      Swal.close();
      return response;
    })
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function loginByEmail(email) {
  return await api
    .post(`user/login/${email}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function logout() {
  return await api
    .post(`user/logout`, {})
    .catch((error) => handleError(error.response));
}

export async function checkSession() {
  return await api
    .get(`user/check`, {})
    .then((response) => {
      if (response.data["message"] == "Unauthorized") {
        forceLogout();
        return false;
      } else return true;
    })
    .catch((error) => handleError(error.response));
}

export async function getUserByUsername(username) {
  return await api
    .get(`user/username/${username}`)
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getUserById(id) {
  return await api
    .get(`user/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getUserList() {
  return await api
    .get(`user`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getVerifiedUserList() {
  return await api
    .get(`user/verified`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function updateUserKudos(user, kudos) {
  generalLoading();
  const data = new FormData();
  data.append("kudos", kudos);
  return await api
    .put(`user/${user.id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      Swal.close();
      return response;
    })
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function updateUserReports(user_id, reports) {
  generalLoading();
  const data = new FormData();
  data.append("reports", reports);
  return await api
    .put(`user/${user_id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      Swal.close();
      return response;
    })
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function updateUserProfile(user, props) {
  generalLoading();
  const data = new FormData();
  for (const key in props)
    if (props[key] != undefined) data.append(key, props[key]);
  return await api
    .put(`user/${user.id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      Swal.close();
      return response;
    })
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getUserPresignedURL(filename) {
  return await api
    .get(`user/images/${filename}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}
