// src/pages/EditEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/Navbar";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["Technology", "Music", "Sports", "Art", "Food"];

  useEffect(() => {
    // Fetch the event details using GET /api/event/:id
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/event/${id}`, {
          withCredentials: true,
        });
        if (response.data.message === "OK") {
          const event = response.data.event;
          // Check if the current user is the creator
          if (
            !authUser ||
            !event.creator ||
            String(event.creator) !== String(authUser._id)
          ) {
            // Not authorized: redirect to /my-events (or display an error message)
            navigate(`/events/${id}`, { replace: true });
            return;
          }
          // Pre-fill the form with event data.
          setFormData({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? dayjs(event.date).format("YYYY-MM-DD") : "",
            time: event.time || "",
            location: event.location || "",
            category: event.category || "",
          });
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Error fetching event data.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if authUser is available.
    if (authUser) {
      fetchEvent();
    }
  }, [id, authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time and ensure the event is in the future.
    const eventDateTime = dayjs(`${formData.date} ${formData.time}`);
    if (!eventDateTime.isAfter(dayjs())) {
      alert("Please select a future date and time for the event.");
      return;
    }

    try {
      // Send a PATCH request to update the event.
      const response = await axios.patch(
        `http://localhost:3000/api/event/${id}`,
        formData,
        { withCredentials: true }
      );
      console.log("Event updated:", response.data);
      navigate("/my-events", { replace: true });
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response ? error.response.data : error.message
      );
      setError("Error updating event. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={dayjs().format("YYYY-MM-DD")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  required
                  min={
                    formData.date === dayjs().format("YYYY-MM-DD")
                      ? dayjs().format("HH:mm")
                      : undefined
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-1">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
