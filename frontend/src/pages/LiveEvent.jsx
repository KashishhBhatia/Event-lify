// src/pages/LiveEvent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Container, Button } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import socket from '../socket';
import Navbar from '../components/Navbar';

export default function LiveEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [liveUsers, setLiveUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate('/login', { replace: true });
    }
  }, [authUser, navigate]);

  // Subscribe for the current liveCount using "subscribeAttendance"
  useEffect(() => {
    socket.emit("subscribeAttendance", id, (data) => {
      if (data && data.eventId === id) {
        setLiveUsers(data.attendance);
      }
    });
  }, [id]);

  // Listen for real-time attendance updates.
  useEffect(() => {
    const attendanceListener = (data) => {
      if (data.eventId === id) {
        setLiveUsers(data.attendance);
      }
    };
    socket.on("attendanceUpdate", attendanceListener);
    return () => {
      socket.off("attendanceUpdate", attendanceListener);
    };
  }, [id]);

  const handleEnterLiveEvent = () => {
    if (!authUser) {
      navigate('/login', { replace: true });
      return;
    }
    setLoading(true);
    socket.emit("joinEventRoom", id);
    setJoined(true);
    setLoading(false);
  };

  const handleExitLiveEvent = () => {
    socket.emit("leaveEventRoom", id);
    setJoined(false);
    navigate(`/events/${id}`, { replace: true });
  };

  return (
    <>
    <Navbar/>
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4">Live Event</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Live Users: {liveUsers}
      </Typography>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {!joined ? (
        <Button variant="contained" color="primary" onClick={handleEnterLiveEvent} sx={{ mt: 4 }}>
          Enter Live Event
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={handleExitLiveEvent} sx={{ mt: 4 }}>
          Exit Live Event
        </Button>
      )}
    </Container>
    </>
  );
}
