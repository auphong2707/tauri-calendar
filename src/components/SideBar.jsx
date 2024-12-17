// Desc:

// Import necessary modules
import { FEATURE_CONSTANT } from '../constant';
import PropTypes from 'prop-types';

// Import Material UI components
import { Divider, Drawer, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import custom components
import BasicDateCalendar from './BasicDateCalendar';
import DigitalClock from './DigitalClock';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  paddingLeft: '20px',
  height: FEATURE_CONSTANT.BAR_HEIGHT,
}));

export default function PersistentDrawer({ isSidebarOpen, closeSidebar, theme }) {

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
          backgroundColor: '#f0f0d8',
        }
      }}
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
    >
      <DrawerHeader>
        <DigitalClock />
        <IconButton onClick={closeSidebar} sx={{ marginLeft: 'auto' }}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>

      {/* Upper Section */}
      <Divider sx={{marginBottom: 2}} />

      <BasicDateCalendar />

      <Divider sx={{marginBottom: 2, marginTop: 2}}/>
    </Drawer>
  );
}

PersistentDrawer.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};