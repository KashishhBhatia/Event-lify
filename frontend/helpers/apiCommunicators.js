// src/helpers/apiCommunicators.js
import axios from "axios";

export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/signup",
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
      "http://localhost:3000/api/users/login",
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
      "http://localhost:3000/api/users/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Logout failed" };
  }
};
