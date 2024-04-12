import api from "../api/httpClient";
import Swal from "sweetalert2";
import { generalLoading, handleError } from "../utility";

export async function createNewReview(review) {
  generalLoading();
  return await api
    .post(`review/`, JSON.stringify(review), {
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

export async function getReviewsByApplicationId(id) {
  return await api
    .get(`review/application/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getReviewsByRecieverId(id) {
  return await api
    .get(`review/reciever/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getReviewsByReviewerId(id) {
  return await api
    .get(`review/reviewer/${id}`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function getReviewsList() {
  return await api
    .get(`review`, {})
    .then((response) => response.data)
    .catch((error) => handleError(error.response));
}

export async function deleteReviewById(id) {
  await api
    .delete(`review/${id}`, {})
    .catch((error) => handleError(error.response));
}
