// Desc:

// Import necessary modules
import { FEATURE_CONSTANT } from '../constant';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// Import Material UI components
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


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
  const [dayName, date] = day.split('\n');

  const DayColumnHeader = () => (
    <Box 
      sx={{ 
        borderLeft: (index !== 0 ? 1 : 0), 
        borderColor: 'white', 
        height: '10%', 
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: 'olive',
        zIndex: 0,
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
        borderLeft: (index !== 0 ? 1 : 0),
        borderColor: 'white',
        height: '90%',
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
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
            backgroundColor: '#F5F5DC',
            borderBottom: 1,
            borderTop: (rowIndex === 0 ? 1 : 0),
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
        borderLeft: (index !== 0 ? 1 : 0),
        borderColor: 'white',
        height: '90%',
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        position: 'relative',
      }}
    >
      <Typography variant="h6" color='black'>Content</Typography>
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
  day: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default function MainContent({ isSidebarOpen, dateViewBegin }) {
  return (
    <Main open={isSidebarOpen} >
      <Grid container columns={7} sx={{ height: '100%' }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Grid key={index} size={1} item sx={{ height: '100%' }}>
            <DayColumn day={dateViewBegin.add(index, 'day').format("dddd\nDD/MM/YYYY").toString()} index={index} />
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