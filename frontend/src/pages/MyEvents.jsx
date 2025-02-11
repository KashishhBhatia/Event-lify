// src/pages/MyEvents.jsx
import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { Container, Grid2, TextField, Box, Button, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import Navbar from '../components/Navbar';

const MyEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { authUser } = useAuth();

  // State for registered events fetched from the API
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registeredLoading, setRegisteredLoading] = useState(false);
  const [registeredError, setRegisteredError] = useState(null);

  // Use current time dynamically
  const now = dayjs();

  // Helper to combine the ISO date and time string into a single dayjs object.
  const getEventDateTime = (event) => {
    const [hourStr, minuteStr] = event.time.split(':');
    // Parse the ISO date and set hour and minute accordingly.
    return dayjs(event.date).hour(parseInt(hourStr, 10)).minute(parseInt(minuteStr, 10));
  };

  // Fetch registered events for the authenticated user
  useEffect(() => {
    if (authUser) {
      const fetchRegisteredEvents = async () => {
        setRegisteredLoading(true);
        try {
          const response = await axios.get('https://event-lify-backend.onrender.com/api/users/eventsRegistered', {
            withCredentials: true,
          });
          if (response.data.message === 'OK') {
            setRegisteredEvents(response.data.events);
          } else {
            setRegisteredError('Failed to fetch registered events.');
          }
        } catch (error) {
          console.error('Error fetching registered events:', error);
          setRegisteredError('Error fetching registered events.');
        } finally {
          setRegisteredLoading(false);
        }
      };
      fetchRegisteredEvents();
    }
  }, [authUser]);

  // Filter registered events based on search term and category.
  const filteredRegisteredEvents = registeredEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorize events (assuming each event lasts 1 hour) using proper date–time formatting.
  const liveRegistered = filteredRegisteredEvents.filter(event => {
    const eventDateTime = getEventDateTime(event);
    // Event is live if now is at or after start and before start + 1 hour.
    return !now.isBefore(eventDateTime) && now.isBefore(eventDateTime.add(1, 'hour'));
  });
  
  const upcomingRegistered = filteredRegisteredEvents.filter(event => {
    const eventDateTime = getEventDateTime(event);
    // Upcoming if current time is before event start.
    return now.isBefore(eventDateTime);
  });
  
  const pastRegistered = filteredRegisteredEvents.filter(event => {
    const eventDateTime = getEventDateTime(event);
    // Past if current time is at or after event start + 1 hour.
    return !now.isBefore(eventDateTime.add(1, 'hour'));
  });

  const categories = ['All', 'Technology', 'Music', 'Sports', 'Art', 'Food'];

  return (
    <>
    <Navbar/>
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: { xs: 3, md: 4 }, fontWeight: 'bold', textAlign: 'center' }}
        >
          My Registered Events
        </Typography>

        {/* Search Field and Category Filters */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ color: 'gray', mr: 1 }} /> }}
            sx={{ maxWidth: { xs: '100%', sm: '300px' } }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, justifyContent: 'center' }}>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: selectedCategory === cat ? '#ce3b3b' : 'transparent',
                  borderColor: '#ce3b3b',
                  color: selectedCategory === cat ? 'white' : '#ce3b3b',
                  '&:hover': {
                    backgroundColor: selectedCategory === cat ? '#b03232' : 'rgba(206, 59, 59, 0.1)',
                    borderColor: '#ce3b3b',
                  },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Registered Events Sections */}
        {authUser ? (
          registeredLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6">Loading your registered events...</Typography>
            </Box>
          ) : (
            <>
              {liveRegistered.length > 0 && (
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                    🔥 Live Registered Events
                  </Typography>
                  <Grid2 container spacing={3} justifyContent="center">
                    {liveRegistered.map(event => (
                      <Grid2 item xs={12} sm={6} md={4} key={event._id}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              )}
              {upcomingRegistered.length > 0 && (
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                    🚀 Upcoming Registered Events
                  </Typography>
                  <Grid2 container spacing={3} justifyContent="center">
                    {upcomingRegistered.map(event => (
                      <Grid2 item xs={12} sm={6} md={4} key={event._id}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              )}
              {pastRegistered.length > 0 && (
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                    ⏳ Past Registered Events
                  </Typography>
                  <Grid2 container spacing={3} justifyContent="center">
                    {pastRegistered.map(event => (
                      <Grid2 item xs={12} sm={6} md={4} key={event._id}>
                        <EventCard event={event} />
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              )}
              {filteredRegisteredEvents.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    You haven't registered for any events matching your criteria.
                  </Typography>
                </Box>
              )}
            </>
          )
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Please log in to see your registered events.
            </Typography>
          </Box>
        )}

        {registeredError && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="error">
              {registeredError}
            </Typography>
          </Box>
        )}
      </Container>
    </div>
    </>
  );
};

export default MyEvents;
