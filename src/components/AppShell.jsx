import { Alert, AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Customer', to: '/customer' },
  { label: 'Enforcer', to: '/enforcer' },
  { label: 'Owner', to: '/owner' },
]

export default function AppShell({ children }) {
  const auth = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e6eef0' }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                ParkAnywhere
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Smart lot monetization
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {auth.isAuthenticated ? (
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  {auth.email || 'Signed in'}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Not signed in
                </Typography>
              )}

              {links.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  color="primary"
                  sx={{
                    '&.active': {
                      backgroundColor: 'rgba(15,118,110,0.12)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {auth.isAuthenticated ? (
                <Button variant="outlined" onClick={auth.logout}>
                  Log out
                </Button>
              ) : (
                <Button variant="contained" onClick={auth.login}>
                  Log in
                </Button>
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {auth.authError ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {auth.authError}
          </Alert>
        ) : null}

        {!auth.isAuthenticated && !auth.canLogin ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Set VITE_COGNITO_DOMAIN and VITE_COGNITO_CLIENT_ID in .env.local to enable local login.
          </Alert>
        ) : null}

        {children}
      </Container>
    </Box>
  )
}
