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
  try {
    const response = await axios.get(`/api/event/${id}`, {
      withCredentials: true,
    });
    return {
      event: response.data.event,
      liveCount: response.data.event.liveCount || 0,
    };
  } catch (error) {
    console.error("Error fetching event details:", error);
    return { error: "Failed to load event. Please try again later." };
  }
};

export const registerForEvent = async (id) => {
  try {
    const response = await axios.put(
      `https://event-lify-backend.onrender.com/api/event/${id}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    return {
      error: error.response?.data?.message ||
        "Registration failed. Please try again.",
    };
  }
};

export const deregisterFromEvent = async (id) => {
  try {
    const response = await axios.delete(
      `https://event-lify-backend.onrender.com/api/event/${id}/unregister`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Deregistration error:", error.response?.data || error.message);
    return {
      error: error.response?.data?.message ||
        "Deregistration failed. Please try again.",
    };
  }
};

export const createEvent = async (data) => {
  try {
    const response = await axios.post(
      "https://event-lify-backend.onrender.com/api/event/create",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating event:",
      error.response?.data || error.message
    );
    return {
      error:
        error.response?.data?.message || "Event creation failed. Please try again.",
    };
  }
};

export const updateEvent = async (id, data) => {
  try {
    const response = await axios.patch(
      `https://event-lify-backend.onrender.com/api/event/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Event update failed. Please try again." };
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(
      `https://event-lify-backend.onrender.com/api/event/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Event deletion failed. Please try again." };
  }
};

export const getRegisteredEvents = async () => {
  try {
    const response = await axios.get(
      "https://event-lify-backend.onrender.com/api/users/eventsRegistered",
      { withCredentials: true }
    );
    if (response.data.message === "OK") {
      return { events: response.data.events };
    } else {
      return { error: "Failed to fetch registered events." };
    }
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return { error: "Error fetching registered events." };
  }
};

