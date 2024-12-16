import './App.css'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import CssBaseLine from '@mui/material/CssBaseline'
import SideBar from './components/SideBar'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box';
import AppBar from './components/AppBar'
import MainContent from './components/Main'

function App() {
  {/* Sidebar's State */}
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  {/* Theme */}
  const theme = useTheme()

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
      
      <Box sx={{ display: 'flex' }}>
        <CssBaseLine />
        {/* AppBar */}
        <AppBar isSidebarOpen={isSidebarOpen} openSidebar={() => setIsSidebarOpen(true)}/>

        {/* Sidebar */}
        <SideBar isSidebarOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} theme={theme}/>

        {/* Main Content */}
        <MainContent isSidebarOpen={isSidebarOpen}/>
      </Box>
    </>
  )
}

export default App
