// src/helpers/apiCommunicators.js
import axios from "axios";

export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(
      "https://event-lify-backend.onrender.com/api/users/signup",
      { name, email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Signup failed" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      "https://event-lify-backend.onrender.com/api/users/login",
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      "https://event-lify-backend.onrender.com/api/users/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Logout failed" };
  }
};

export const getEventDetailsAPI = async (id) => {
  const response = await axios.get(`/api/event/${id}`, {
    withCredentials: true, // include cookies if needed
  });
  return {
    event: response.data.event,
    liveCount: response.data.event.liveCount || 0,
  };
};
