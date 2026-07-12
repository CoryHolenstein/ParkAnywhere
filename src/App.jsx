import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import LandingPage from './pages/LandingPage'
import MainApp from './pages/MainApp'
import LogoutPage from './pages/LogoutPage'
import Callback from './pages/Callback'
import ProtectedRoute from './routes/ProtectedRoute'
import useHydrateAuth from './hooks/useHydrateAuth'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

// Inner component that uses router hooks
function AppRoutes() {
  useHydrateAuth();

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected pages */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
