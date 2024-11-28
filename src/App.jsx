import './App.css'
import { Helmet } from 'react-helmet'
import CssBaseLine from '@mui/material/CssBaseline'
import BasicDateCalendar from './BasicDateCalendar'

function App() {
  return (
    <>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
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
