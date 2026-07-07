import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import CustomerPage from './pages/CustomerPage'
import EnforcerPage from './pages/EnforcerPage'
import OwnerPage from './pages/OwnerPage'
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
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
