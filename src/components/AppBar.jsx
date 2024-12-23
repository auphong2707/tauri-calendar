// Desc:

// Import necessary modules
import { FEATURE_CONSTANT } from '../constant';
import PropTypes from 'prop-types';

// Import Material UI components
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MuiAppBar from '@mui/material/AppBar';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCirclelLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${FEATURE_CONSTANT.SIDEBAR_WIDTH}px)`,
        marginLeft: `${FEATURE_CONSTANT.SIDEBAR_WIDTH}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export default function AppBar({ isSidebarOpen, setSidebarOpen, openTaskModal, setTaskViewBegin }) {
  const theme = useTheme();
  
  return (
    <StyledAppBar position="fixed" open={isSidebarOpen} sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar sx={{ height: FEATURE_CONSTANT.BAR_HEIGHT }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            edge="start"
            sx={[
              {
                mr: 2,
              },
            ]}
          >
            <ViewSidebarIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Automatic Tasks Scheduling Calendar Application
          </Typography>

          <IconButton
            color="inherit"
            aria-label="set task view begin"
            onClick={() => setTaskViewBegin((prev) => prev.subtract(1, 'day'))}
            edge="end"
          >
            <ArrowCirclelLeftIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="set task view begin"
            onClick={() => setTaskViewBegin((prev) => prev.add(1, 'day'))}
            edge="end"
          >
            <ArrowCircleRightIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="add task"
            onClick={openTaskModal}
            edge="end"
          >
            <AddTaskIcon />
          </IconButton>

        </Toolbar>
      </StyledAppBar>
  )
}

AppBar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  openTaskModal: PropTypes.func.isRequired,
  setTaskViewBegin: PropTypes.func.isRequired,
}