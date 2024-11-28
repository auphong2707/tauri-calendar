import { Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import BasicDateCalendar from '../../BasicDateCalendar'; // Assuming you have a BasicDateCalendar component
import TaskList from '../../TaskList'; // Assuming you have a TaskList component

import { useSelector, useDispatch } from 'react-redux'
import { closeSidebar } from './sidebarToggleSlice';


export default function PersistentDrawer() {

  const isOpen = useSelector((state) => state.sidebarToggle.value);
  const dispatch = useDispatch();

  return (
    <Drawer
    sx={{
      width: 350,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: 350,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f0f0d8',
      }
    }}
    variant="persistent"
    anchor="left"
    open={isOpen}
    >
      {/* Sidebar Close Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: 'olive',
        borderRadius: '0px 0px 10px 10px',
        color: 'white',
      }}>
        <Typography 
          fontSize={'2rem'} 
          style={{
            paddingLeft: '20px',
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          Sidebar
        </Typography>
        
        <div style={{paddingTop: '2px'}}>
          <IconButton onClick={() => dispatch(closeSidebar())}>
            <CloseIcon style={{ color: 'white' }}/>
          </IconButton>
        </div>
      </div>

      {/* Upper Section */}
      <div className="sidebar-component">
        <BasicDateCalendar />
      </div>

      {/* Lower Section */}
      <div className="sidebar-component">
        <TaskList />
      </div>
    </Drawer>
  );
}
