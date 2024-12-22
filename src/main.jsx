import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#808000',
      dark: '#5a5a00',
      light: '#F5F5DC',
    },
    background: {
      default: '',
      paper: 'white',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </StrictMode>
  </ThemeProvider>
)
