import { useState, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export default function DigitalClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" alignItems="center">
      <AccessTimeIcon style={{ fontSize: '2rem' }} />
      <Typography variant="h4" sx={{ marginLeft: 1 }}>{time}</Typography>
    </Box>
  );
}