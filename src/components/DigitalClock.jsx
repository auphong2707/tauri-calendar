// Desc: Digital clock component that displays the current time in 24-hour format

// Importing necessary modules
import { useState, useEffect } from 'react';

// Importing Material-UI components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import { useTheme } from '@mui/material/styles';


export default function DigitalClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));
  // const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" alignItems="center" sx={{ borderRadius: '10px', padding: '3px 20px 3px 20px' }}>
      <Typography variant="h4" color='white' sx={{ marginLeft: 1 }}>- {time} -</Typography>
    </Box>
  );
}