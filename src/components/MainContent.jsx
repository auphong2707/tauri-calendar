// Desc:

// Import necessary modules
import { FEATURE_CONSTANT } from '../constant';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

// Import Material UI components
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

// Tauri API
import { invoke } from '@tauri-apps/api/core';


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    height: `calc(100vh - ${FEATURE_CONSTANT.BAR_HEIGHT}px)`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${FEATURE_CONSTANT.SIDEBAR_WIDTH}px`,
    marginTop: FEATURE_CONSTANT.BAR_HEIGHT,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const DayColumn = ({ day, index }) => {
  const theme = useTheme();

  const dayName = day.format("dddd");
  const date = day.format("DD/MM/YYYY");

  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    const fetchTaskList = async () => {
      const tasks = await invoke('get_task_list', { date: day.format('YYYY-MM-DD') });
      setTaskList(tasks);
    };

    fetchTaskList();
  }, [day]);
  
  const DayColumnHeader = () => (
    <Box 
      sx={{ 
        borderLeft: (index !== 0 ? 2 : 0),
        borderBottom: 2,
        borderColor: 'white',
        height: '10%', 
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Typography variant="h6" color='white'>{dayName}</Typography>
      <Typography variant="body2" color='white'>{date}</Typography>
    </Box>
  );

  const rows = Array.from({ length: 12 });
  const DayColumnBackground = () => (
    <Box
      sx={{
        borderLeft: (index !== 0 ? 2 : 0),
        borderColor: 'white',
        height: '90%',
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 0,
        position: 'absolute',
      }}
    >
      {/* Rows with lines */}
      {rows.map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            flexGrow: 1,
            backgroundColor: theme.palette.primary.light,
            borderBottom: 2,
            borderColor: 'white',
          }}
        >
        </Box>
      ))}
    </Box>
  );

  const DayColumnContent = () => (
    <Box
      sx={{
        borderLeft: (index !== 0 ? 2 : 0),
        borderColor: 'white',
        height: '90%',
        textAlign: 'center',
        backgroundColor: 'transparent',
        zIndex: 1,
        position: 'relative',
      }}
    >
      {taskList.map(task => {
        // Calculate start and end positions
        const fromTimeMinutes = dayjs(task.from_time, "HH:mm").hour() * 60 + dayjs(task.from_time, "HH:mm").minute();

        console.log(task);

        const startPosition = (fromTimeMinutes / 1440) * 100; // Start position as a percentage
        const height = (task.duration / 1440) * 100; // Height as a percentage

        return (
          <Box 
            key={task.id} 
            sx={{
              top: `${startPosition}%`,
              width: '100%',
              height: `${height}%`,
              position: 'absolute',
              backgroundColor: theme.palette.primary.main,
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottom: '1px solid white',
            }}
          >
            <Typography variant="body1" color='white'>{task.task_title}</Typography>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <DayColumnHeader />
      <DayColumnBackground />
      <DayColumnContent />
    </Box>
  );
};

DayColumn.propTypes = {
  day: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default function MainContent({ isSidebarOpen, dateViewBegin }) {
  return (
    <Main open={isSidebarOpen} >
      <Grid container columns={7} sx={{ height: '100%' }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Grid key={index} size={1} item sx={{ height: '100%' }}>
            <DayColumn day={dateViewBegin.add(index, 'day')} index={index} />
          </Grid>
        ))}
      </Grid>
    </Main>
  );
}

MainContent.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  dateViewBegin: PropTypes.object.isRequired,
}