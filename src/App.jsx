import './App.css'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import CssBaseLine from '@mui/material/CssBaseline'
import SideBar from './components/SideBar'
import Box from '@mui/material/Box';
import AppBar from './components/AppBar'
import MainContent from './components/MainContent'
import TaskModal from './components/TaskModal'

import dayjs from 'dayjs'

function App() {
  {/* State */}
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTaskID, setSelectedTaskID] = useState(null);
  const [dateViewBegin, setDateViewBegin] = useState(dayjs());

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BasicDateCalendar demo — MUI X</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Helmet>
      <CssBaseLine />

      {/* Task Modal */}
      <TaskModal selectedTaskID={selectedTaskID} handleClose={() => setSelectedTaskID(null)} />

      {/* Main Container */}
      <Box sx={{ display: 'flex' }}>
        {/* AppBar */}
        <AppBar 
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          openTaskModal={() => setSelectedTaskID(-1)}
          setTaskViewBegin={setDateViewBegin}
        />

        {/* Sidebar */}
        <SideBar 
          isSidebarOpen={isSidebarOpen} 
          closeSidebar={() => setIsSidebarOpen(false)}
          dayViewBegin={dateViewBegin}
          setDayViewBegin={setDateViewBegin}
        />

        {/* Main Content */}
        <MainContent isSidebarOpen={isSidebarOpen} dateViewBegin={dateViewBegin} setSelectedTaskID={setSelectedTaskID}/>
      </Box>
    </>
  )
}

export default App
