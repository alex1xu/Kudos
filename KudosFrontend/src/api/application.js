import api from "../api/httpClient";
import Swal from "sweetalert2";
import { generalLoading, handleError } from "../utility";

export async function createNewApplication(application) {
  generalLoading();
  return await api
    .post(`application/`, JSON.stringify(application), {
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

export async function getApplicationsByListingId(id) {
  return await api
    .get(`application/listing/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getApplicationsByUserId(id) {
  return await api
    .get(`application/user/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function didUserApply(applicant_id, listing_id) {
  return await api
    .get(`application/listing/user/${listing_id}/${applicant_id}`, {})
    .then((response) => response.data[0])
    .catch((error) => handleError(error.response));
}

export async function getApplicationsList() {
  return await api
    .get(`application`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function updateApplicationStatus(application, status) {
  generalLoading();
  return await api
    .put(`application/${application.id}`, JSON.stringify({ status: status }), {
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
export async function deleteApplicationById(id) {
  await api
    .delete(`application/${id}`, {})
    .catch((error) => handleError(error.response));
}
