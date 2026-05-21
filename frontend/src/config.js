// API Base URL Configuration
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000"
  : "https://online-learning-platform-aqix.onrender.com";

export { BASE_URL };
                