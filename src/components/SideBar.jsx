// Desc:

// Import necessary modules
import { FEATURE_CONSTANT } from '../constant';
import PropTypes from 'prop-types';

// Import Material UI components
import { Divider, Drawer } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Import custom components
import BasicDateCalendar from './BasicDateCalendar';
import DigitalClock from './DigitalClock';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  paddingLeft: '15px',
  height: FEATURE_CONSTANT.BAR_HEIGHT,
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0px 4px 0px 3 rgba(0, 0, 0, 0.7)',
}));

export default function PersistentDrawer({ isSidebarOpen, dayViewBegin, setDayViewBegin }) {
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: FEATURE_CONSTANT.SIDEBAR_WIDTH,
        flexShrink: 0,
        rowGap: '0.5rem',
        '& .MuiDrawer-paper': {
          width: FEATURE_CONSTANT.SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.primary.light,
          borderRight: '2px solid ' + theme.palette.primary.dark,
        }
      }}
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
    >
      <DrawerHeader>
        <DigitalClock />
      </DrawerHeader>

      {/* Upper Section */}
      <Divider sx={{marginBottom: 2}} />

      <BasicDateCalendar dayViewBegin={dayViewBegin} setDayViewBegin={setDayViewBegin}/>

      <Divider sx={{marginBottom: 2, marginTop: 2}}/>
    </Drawer>
  );
}

PersistentDrawer.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  dayViewBegin: PropTypes.object.isRequired,
  setDayViewBegin: PropTypes.func.isRequired
};