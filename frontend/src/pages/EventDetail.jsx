// src/pages/EventDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import dayjs from 'dayjs';
import socket from '../socket';
import Navbar from '../components/Navbar';
import {
  getEventDetailsAPI,
  registerForEvent,
  deregisterFromEvent,
} from '../../helpers/apiCommunicators';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [liveCount, setLiveCount] = useState(0);

  const fetchEventDetails = async () => {
    setLoading(true);
    const result = await getEventDetailsAPI(id);
    if (result.error) {
      setError(result.error);
    } else {
      setEvent(result.event);
      setLiveCount(result.liveCount);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (authUser) {
      fetchEventDetails();
    }
  }, [authUser]);

  useEffect(() => {
    fetchEventDetails();
  }, [location.key]);

  // Subscribe for current live count without joining.
  useEffect(() => {
    socket.emit("subscribeAttendance", id, (data) => {
      if (data && data.eventId === id) {
        setLiveCount(data.attendance);
      }
    });
  }, [id]);

  useEffect(() => {
    const attendanceListener = (data) => {
      if (data.eventId === id) {
        setLiveCount(data.attendance);
      }
    };
    socket.on("attendanceUpdate", attendanceListener);
    return () => {
      socket.off("attendanceUpdate", attendanceListener);
    };
  }, [id]);

  // Safely check if the user is registered.
  const isRegistered =
    authUser &&
    event &&
    Array.isArray(event.registered_users) &&
    event.registered_users.filter((regId) => regId != null)
      .some((regId) => String(regId) === String(authUser._id));

  // Safely check if the user is the creator.
  const isCreator =
    authUser &&
    event &&
    authUser._id &&
    event.creator &&
    event.creator.toString() === authUser._id.toString();

  // Compute event date & time.
  const eventDateTime = event
    ? dayjs(event.date)
        .hour(parseInt(event.time.split(':')[0], 10))
        .minute(parseInt(event.time.split(':')[1], 10))
    : null;

  const isLiveEvent = eventDateTime
    ? dayjs().isAfter(eventDateTime) && dayjs().isBefore(eventDateTime.add(1, 'hour'))
    : false;

  const isPastEvent = eventDateTime
    ? dayjs().isAfter(eventDateTime.add(1, 'hour'))
    : false;

  const handleRegister = async () => {
    if (!authUser) {
      navigate('/login', { replace: true });
      return;
    }
    setRegisterLoading(true);
    setRegisterError(null);
    const result = await registerForEvent(id);
    if (result.error) {
      setRegisterError(result.error);
    } else if (result.message === "OK") {
      await fetchEventDetails();
    } else {
      setRegisterError(result.message);
    }
    setRegisterLoading(false);
  };

  const handleDeregister = async () => {
    if (!authUser) {
      navigate('/login', { replace: true });
      return;
    }
    setRegisterLoading(true);
    setRegisterError(null);
    const result = await deregisterFromEvent(id);
    if (result.error) {
      setRegisterError(result.error);
    } else if (result.message === "OK") {
      await fetchEventDetails();
    } else {
      setRegisterError(result.message);
    }
    setRegisterLoading(false);
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">Loading event...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">No event found.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            width: '100%',
            height: { xs: 200, md: 300 },
            backgroundImage: `url(${event.coverimage || '/esse-chua-cdiIVIJkYc4-unsplash.jpg' || event.image})`,
            backgroundSize: 'fit',
            backgroundPosition: 'center',
            borderRadius: 2,
            mb: 4,
          }}
        />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {event.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {event.date} at {event.time}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category: {event.category}
          </Typography>
          {isLiveEvent && (
            <Typography variant="body2" color="success.main">
              Live Users: {liveCount}
            </Typography>
          )}
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {event.location}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {isPastEvent ? (
            <Typography variant="h6" color="text.secondary">
              This event has passed.
            </Typography>
          ) : isCreator ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/events/${id}/edit`)}
              sx={{
                mt: 'auto',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              Manage Event
            </Button>
          ) : isLiveEvent ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/events/${id}/live`)}
              sx={{
                mt: 'auto',
                backgroundColor: '#2e7d32',
                '&:hover': { backgroundColor: '#1b5e20' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              Join Live
            </Button>
          ) : isRegistered ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleDeregister}
              disabled={registerLoading}
              sx={{
                mt: 'auto',
                backgroundColor: '#c53030',
                '&:hover': { backgroundColor: '#9b1c1c' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              {registerLoading ? 'Processing...' : 'Unregister from Event'}
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              disabled={registerLoading}
              sx={{
                mt: 'auto',
                backgroundColor: '#c53030',
                '&:hover': { backgroundColor: '#9b1c1c' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              {registerLoading ? 'Processing...' : 'Register for Event'}
            </Button>
          )}
          {registerError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {registerError}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}

