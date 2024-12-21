// Desc:

// Import necessary modules
import { FEATURE_CONSTANT } from '../constant';
import PropTypes from 'prop-types';

// Import Material UI components
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MuiAppBar from '@mui/material/AppBar';



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

export default function AppBar({ isSidebarOpen, openSidebar, openTaskModal }) {
  return (
    <StyledAppBar position="fixed" open={isSidebarOpen} sx={{ backgroundColor: 'olive'}}>
        <Toolbar sx={{ height: FEATURE_CONSTANT.BAR_HEIGHT }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openSidebar}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              isSidebarOpen && { display: 'none' },
            ]}
          >
            <ViewSidebarIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Automatic Tasks Scheduling Calendar Application
          </Typography>

          <IconButton
            color="inherit"
            aria-label="add task"
            onClick={openTaskModal}
            edge="end"
            sx={[{
              ml: 'auto',
            }]}
          >
            <AddTaskIcon />
          </IconButton>

        </Toolbar>
      </StyledAppBar>
  )
}

AppBar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  openSidebar: PropTypes.func.isRequired,
  openTaskModal: PropTypes.func.isRequired,
}