// Desc: BasicDateCalendar component that displays a calendar with the current date highlighted

// Import necessary modules
import PropTypes from 'prop-types';

// Import Material UI components
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function BasicDateCalendar({ dayViewBegin, setDayViewBegin }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar 
        showDaysOutsideCurrentMonth
        value={dayViewBegin}
        onChange={(newValue) => setDayViewBegin(newValue)}
        fixedWeekNumber={6}
        sx={{
          backgroundColor: 'white',
          borderRadius: '10px',
        }}
        timezone="system"
      />
    </LocalizationProvider>
  );
}

BasicDateCalendar.propTypes = {
  dayViewBegin: PropTypes.object.isRequired,
  setDayViewBegin: PropTypes.func.isRequired
};
