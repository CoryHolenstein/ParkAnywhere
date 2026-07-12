<<<<<<< HEAD
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppShell from './components/AppShell'
=======
import { BrowserRouter, Link as RouterLink, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Box, Button, CssBaseline, Stack, ThemeProvider, Typography, createTheme } from '@mui/material'
>>>>>>> master
import LandingPage from './pages/LandingPage'
import CustomerPage from './pages/CustomerPage'
import EnforcerPage from './pages/EnforcerPage'
import OwnerPage from './pages/OwnerPage'
<<<<<<< HEAD
import { appTheme } from './app/theme'

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/customer/:lotId" element={<CustomerPage />} />
            <Route path="/enforcer" element={<EnforcerPage />} />
            <Route path="/owner" element={<OwnerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
=======
import LogoutPage from './pages/LogoutPage'
import Callback from './pages/Callback'
import useHydrateAuth from './hooks/useHydrateAuth'
import { useAuth } from 'react-oidc-context'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f8f89',
    },
    secondary: {
      main: '#0b3d4a',
    },
    background: {
      default: '#f0f3f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
  },
})

const navigationItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/customer', label: 'Customer' },
  { to: '/enforcer', label: 'Enforcer' },
  { to: '/owner', label: 'Owner' },
]

function TopNav() {
  const auth = useAuth()

  return (
    <Box className="top-nav-wrap">
      <Stack className="top-nav" direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" className="top-nav-brand">
            ParkAnywhere
          </Typography>
          <Typography className="top-nav-subtitle">Smart lot monetization</Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" className="top-nav-links-wrap">
          <Typography className="top-nav-status">
            {auth.isAuthenticated ? 'Signed in' : 'Not signed in'}
          </Typography>

          <Stack direction="row" spacing={0.5} className="top-nav-links">
            {navigationItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.end}
                className="top-nav-link"
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Button
            component={RouterLink}
            to="/callback"
            variant="contained"
            onClick={(event) => {
              event.preventDefault()
              auth.signinRedirect()
            }}
            className="top-nav-login"
          >
            Log in
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

// Inner component that uses router hooks
function AppRoutes() {
  useHydrateAuth()
  const location = useLocation()
  const hideNav = location.pathname === '/callback' || location.pathname === '/logout'

  return (
    <>
      {hideNav ? null : <TopNav />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/customer/:lotId" element={<CustomerPage />} />
        <Route path="/enforcer" element={<EnforcerPage />} />
        <Route path="/owner" element={<OwnerPage />} />

        {/* Legacy auth routes kept for Cognito flow compatibility */}
        <Route path="/callback" element={<Callback />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/app" element={<OwnerPage />} />

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
>>>>>>> master
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
