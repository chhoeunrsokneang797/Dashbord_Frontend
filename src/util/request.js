// src/api.js
import axios from "axios";
import config from "./connection";
import { profileStore } from "../store/profileStore";

export const request = (url = "", method = "get", data = {}) => {
  const { access_token } = profileStore.getState();
  let headers = {
    "Content-Type": "application/json", // data = json
  };
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data", // data = form data
    };
  }
  if (profileStore)
    return axios({
      url: config.base_url + url,
      method,
      data,
      headers: {
        ...headers,
        Accept: "application/json",
        Authorization: "Bearer" + access_token,
      },
    })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        const response = error.response;
        if (response) {
          const status = response.status;
          const data = response.data;
          // debugger;
          let errors = {
            message: data?.message,
          };
          if (data && data.errors) {
            Object.keys(data.errors).map((key) => {
              errors[key] = {
                help: data.errors[key][0],
                validateStatus: "error",
                hasFeedback: true,
              };
            });
          }

          // This ensures a consistent return structure even without detailed errors
          return {
            status: status,
            errors: errors,
          };
        }
        // Return a consistent error object for network failures
        debugger;
        return {
          status: 500,
          errors: { general: "Network request failed" },
        };
      });
};
