import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Switch, FormControlLabel, Divider, Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import useAuthStore from '../store/useAuthStore'

export default function SettingsTab() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/logout')
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2.5,
          borderRadius: 3,
          border: '1px solid rgba(36, 84, 122, 0.16)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(243,249,255,0.98) 100%)',
          boxShadow: '0 10px 26px rgba(22, 58, 92, 0.09)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#214d74', letterSpacing: '0.01em' }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#4d6a83' }}>
          Manage your account preferences and app behavior.
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid rgba(36, 84, 122, 0.14)',
          boxShadow: '0 8px 22px rgba(21, 53, 91, 0.08)'
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#214d74', mb: 1 }}>
          Account
        </Typography>
        <Typography variant="body2" sx={{ color: '#5a7891' }}>
          Signed in as: {user?.email || 'Unknown user'}
        </Typography>

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#214d74', mb: 1 }}>
          Preferences
        </Typography>

        <FormControlLabel control={<Switch defaultChecked />} label="Show upload success notifications" />
        <FormControlLabel control={<Switch defaultChecked />} label="Auto-refresh files after changes" />
        <FormControlLabel control={<Switch />} label="Compact table layout" />

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#214d74', mb: 1 }}>
          Session
        </Typography>
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="contained"
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #176ab3 0%, #1195a0 100%)',
            boxShadow: '0 8px 18px rgba(19, 94, 151, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0f5da0 0%, #0a858e 100%)'
            }
          }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  )
}
