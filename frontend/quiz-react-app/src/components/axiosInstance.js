import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
    }
  });

  export default axiosInstance;