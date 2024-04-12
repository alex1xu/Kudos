import api from "../api/httpClient";
import Swal from "sweetalert2";
import { generalLoading, handleError } from "../utility";

export async function createNewListing(listing) {
  generalLoading();
  const data = new FormData();
  for (const key in listing)
    if (listing[key] != undefined) data.append(key, listing[key]);
  return await api
    .put(`listing/`, data, {
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

export async function editListing(listing, id) {
  generalLoading();
  const data = new FormData();
  for (const key in listing)
    if (listing[key] != undefined) data.append(key, listing[key]);
  return await api
    .put(`listing/${id}`, data, {
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

export async function getListingsByUserId(id) {
  return await api
    .get(`listing/user/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getListingById(id) {
  return await api
    .get(`listing/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getListingsList(params = {}) {
  return await api
    .put(`listing/search`, JSON.stringify(params), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getListingPresignedURL(filename) {
  return await api
    .get(`listing/images/${filename}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function updateListingStatus(listing, status) {
  generalLoading();
  return await api
    .put(`listing/${listing.id}`, JSON.stringify({ status: status }), {
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

export async function deleteListingById(id) {
  await api
    .delete(`listing/${id}`, {})
    .catch((error) => handleError(error.response));
}
