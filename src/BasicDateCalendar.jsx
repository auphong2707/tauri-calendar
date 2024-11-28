import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function BasicDateCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar 
        showDaysOutsideCurrentMonth 
        fixedWeekNumber={6}
        sx={{
          backgroundColor: 'white',
          borderRadius: '10px',
        }}
      />
    </LocalizationProvider>
  );
}
