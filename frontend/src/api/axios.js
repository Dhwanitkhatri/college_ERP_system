import axios from "axios";
const api = axios.create({
  baseURL: "http://10.229.250.20:5000/",
  withCreddentials: false,
});
export default api;
