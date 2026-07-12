import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
=======
import { AuthProvider } from 'react-oidc-context'
import './amplify-config.js'

const appOrigin = window.location.origin

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GQqqlB8VP",
  client_id: "2u7en4ffrss7vdhgi2vdqp7e8m",
  redirect_uri: `${appOrigin}/callback`,
  post_logout_redirect_uri: `${appOrigin}/logout`,
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById('root')).render(

    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>

>>>>>>> master
)
