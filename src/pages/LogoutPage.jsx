import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, CircularProgress } from '@mui/material'
import './LogoutPage.css'

export default function LogoutPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate logout process (clear user session, tokens, etc.)
    const handleLogout = async () => {
      // Add your logout API call here
      // await logoutUser()
      
      // Clear any stored session data
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
      sessionStorage.clear()

      // Redirect to landing page after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }

    handleLogout()
  }, [navigate])

  return (
    <div className="logout-page">
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ marginBottom: 3, color: '#ffffff' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Logging You Out
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Please wait while we securely log you out...
          </Typography>
        </Box>
      </Container>
    </div>
  )
}
