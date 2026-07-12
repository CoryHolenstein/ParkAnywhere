import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from 'react-oidc-context'
import './amplify-config.js'

const appOrigin = window.location.origin

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_lisoJVVA4",
  client_id: "6rqv58tucti9lsmnpfrb8i9ngi",
  redirect_uri: `${appOrigin}/callback`,
  post_logout_redirect_uri: `${appOrigin}/logout`,
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById('root')).render(

    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>

)
