import './App.css'
import { Helmet } from 'react-helmet'
import CssBaseLine from '@mui/material/CssBaseline'
import BasicDateCalendar from './BasicDateCalendar'

function App() {
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

      <div className='container'>
        {/* Sidebar Section */}
        <div className='sidebar'>
            
          
          {/* Top Section */}
          <div className='sidebar-calendar'>
            <div className='sidebar-calendar-header'>
              <h2>Calendar</h2>
            </div>
            <BasicDateCalendar/>
          </div>


          {/* Bottom Section */}

        </div>
        {/* Main Section */}
        <div className='main-content'>
          Main Content Goes Here
        </div>
      </div>
    </>
  )
}

export default App
