import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'

export default function SupportTab() {
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
          Support
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#4d6a83' }}>
          Need help? Use one of the options below and we will get you unstuck quickly.
        </Typography>
      </Paper>

      <Stack spacing={2}>
        <Paper sx={{ p: 2.2, borderRadius: 3, border: '1px solid rgba(36, 84, 122, 0.14)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#214d74', mb: 0.5 }}>
            Documentation
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a7891', mb: 1.5 }}>
            Browse setup guides and common troubleshooting steps.
          </Typography>
          <Button startIcon={<MenuBookOutlinedIcon />} variant="contained" sx={{ borderRadius: 999, textTransform: 'none' }}>
            Open Docs
          </Button>
        </Paper>

        <Paper sx={{ p: 2.2, borderRadius: 3, border: '1px solid rgba(36, 84, 122, 0.14)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#214d74', mb: 0.5 }}>
            Contact Support
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a7891', mb: 1.5 }}>
            Reach out for account, billing, or access issues.
          </Typography>
          <Button startIcon={<EmailOutlinedIcon />} variant="contained" sx={{ borderRadius: 999, textTransform: 'none' }}>
            Email Support
          </Button>
        </Paper>

        <Paper sx={{ p: 2.2, borderRadius: 3, border: '1px solid rgba(36, 84, 122, 0.14)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#214d74', mb: 0.5 }}>
            Report a Bug
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a7891', mb: 1.5 }}>
            Share what happened and steps to reproduce.
          </Typography>
          <Button startIcon={<BugReportOutlinedIcon />} variant="outlined" sx={{ borderRadius: 999, textTransform: 'none' }}>
            Submit Report
          </Button>
        </Paper>
      </Stack>
    </Box>
  )
}
