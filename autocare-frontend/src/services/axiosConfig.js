import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
});

api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);

        if (userData?.token) {
          config.headers.Authorization =
            `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error("Invalid saved user:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;