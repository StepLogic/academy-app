import axios from "axios";

export const BASE_URL = "https://api.edusogno.com/api/user/";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});
