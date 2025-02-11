// src/components/EventCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Box } from '@mui/material';
import { CalendarToday, LocationOn, People } from '@mui/icons-material';
import dayjs from 'dayjs';
import socket from '../socket';

export default function EventCard({ event }) {
  const [liveCount, setLiveCount] = useState(event.liveCount || 0);

  const eventDateTime = dayjs(event.date)
    .hour(parseInt(event.time.split(':')[0], 10))
    .minute(parseInt(event.time.split(':')[1], 10));
  const isLive = dayjs().isAfter(eventDateTime) && dayjs().isBefore(eventDateTime.add(1, 'hour'));

  useEffect(() => {
    if (isLive) {
      socket.emit("subscribeAttendance", event._id, (data) => {
        if (data && data.eventId === event._id) {
          setLiveCount(data.attendance);
        }
      });
      const attendanceListener = (data) => {
        if (data.eventId === event._id) {
          setLiveCount(data.attendance);
        }
      };
      socket.on("attendanceUpdate", attendanceListener);
      return () => {
        socket.off("attendanceUpdate", attendanceListener);
      };
    }
  }, [event._id, isLive]);

  return (
    <Card
      sx={{
        width: 345,
        height: 550,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 220,
          width: '100%',
          objectFit: 'cover',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        image={ event.coverimage || '/heavy-encaustic-paint-background.jpg' }
        alt={event.title}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            label={event.category}
            size="small"
            sx={{ backgroundColor: '#c53030', color: 'white' }}
          />
          {isLive ? (
            <Chip
              label={`${liveCount} Live`}
              size="small"
              sx={{ backgroundColor: '#2e7d32', color: 'white' }}
            />
          ) : (
            <Chip
              label={`${event.registered_users?.length || 0} attendees`}
              size="small"
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
            />
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            minHeight: '2.4em',
          }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
            minHeight: '4.5em',
          }}
        >
          {event.description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 18, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(event.date), 'PPP')}
            </Typography>
          </Box>
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 18, color: '#666' }} />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People sx={{ fontSize: 18, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {event.registered_users?.length} attendees
            </Typography>
          </Box>
        </Box>
        <Button
          component={Link}
          to={`/events/${event._id}`}
          variant="contained"
          fullWidth
          sx={{
            mt: 'auto',
            backgroundColor: '#c53030',
            '&:hover': { backgroundColor: '#9b1c1c' },
            textTransform: 'none',
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

