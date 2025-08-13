// src/api.js
import axios from "axios";
import config from "./connection";

export const request = (url = "", method = "get", data = {}) => {
  return axios({
    url: config.base_url + url,
    method,
    data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};
