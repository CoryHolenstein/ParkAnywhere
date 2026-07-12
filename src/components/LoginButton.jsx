import { Button } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import { useAuth } from 'react-oidc-context'

export default function LoginButton({ name = 'Sign In', variant = 'contained', sx = {} }) {
  const auth = useAuth()

  const handleLogin = () => {
    auth.signinRedirect()
  }

  return (
    <Button
      variant={variant}
      size="large"
      startIcon={<LoginIcon />}
      onClick={handleLogin}
      sx={{
        padding: '12px 48px',
        fontSize: '16px',
        ...sx
      }}
    >
      {name}
    </Button>
  )
}
