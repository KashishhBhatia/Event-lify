// src/pages/Events.jsx
import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { Container, Grid2, TextField, Box, Button, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['All', 'Technology', 'Music', 'Sports', 'Art', 'Food'];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://event-lify-backend.onrender.com/api/event', { withCredentials: true });
        // Assuming the backend responds with { events: [...] }
        setAllEvents(response.data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on search term and selected category.
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Use current time dynamically
  const now = dayjs();

  // Helper: Combine ISO date and time string into one dayjs object.
  const getEventDateTime = (event) => {
    const datePart = dayjs(event.date); // event.date is ISO string
    const [hourStr, minuteStr] = event.time.split(':');
    return datePart.hour(parseInt(hourStr)).minute(parseInt(minuteStr));
  };

  // Categorize events assuming each event lasts 1 hour.
  const liveEvents = filteredEvents.filter(event => {
    const eventDateTime = getEventDateTime(event);
    // Event is live if current time is at or after start and before start + 1 hour.
    return !now.isBefore(eventDateTime) && now.isBefore(eventDateTime.add(1, 'hour'));
  });
  
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDateTime = getEventDateTime(event);
    // Upcoming if current time is before event start.
    return now.isBefore(eventDateTime);
  });

  return (
    <>
    <Navbar/>
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: {
        xs: 'none',
        sm: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/events-bg.jpg")'
      },
      backgroundColor: { xs: 'transparent', sm: 'inherit' },
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Hero Section with Search */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 4, md: 6 },
            pt: { xs: 2, md: 4 },
            pb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              color: '#CE3B3B',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Discover Your Events
          </Typography>

          {/* Search and Filter Container */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              p: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'gray', mr: 1 }} />,
                sx: {
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#ce3b3b',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ce3b3b !important',
                  },
                }
              }}
              sx={{ mb: 2 }}
            />
            
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
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
        </Box>

        {/* Content Sections with Updated Styling */}
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          p: { xs: 2, md: 4 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          {/* Loading & Error States */}
          {loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Loading events...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </Box>
          )}

          {/* Live Events Section */}
          {!loading && !error && liveEvents.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 3, 
                textAlign: 'center',
                color: '#ce3b3b'
              }}>
                🔥 Live Events
              </Typography>
              <Grid2 container spacing={3} justifyContent="center">
                {liveEvents.map(event => (
                  <Grid2 item xs={12} sm={6} md={4} key={event._id || event.id}>
                    <EventCard event={event} />
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          )}

          {/* Upcoming Events Section */}
          {!loading && !error && upcomingEvents.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 3, 
                textAlign: 'center',
                color: '#ce3b3b'
              }}>
                🚀 Upcoming Events
              </Typography>
              <Grid2 container spacing={3} justifyContent="center">
                {upcomingEvents.map(event => (
                  <Grid2 item xs={12} sm={6} md={4} key={event._id || event.id}>
                    <EventCard event={event} />
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          )}

          {/* No Events Message */}
          {!loading && !error && filteredEvents.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No events found matching your criteria.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </div>
    </>
  );
}
