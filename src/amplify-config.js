// src/amplify-config.js
import { Amplify } from "aws-amplify";

const appOrigin = window.location.origin;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_p29KLGI6E",
      userPoolClientId: "6rqv58tucti9lsmnpfrb8i9ngi",
      loginWith: {
        oauth: {
          domain: "us-east-1lisojvva4.auth.us-east-1.amazoncognito.com",
          scopes: ["openid", "email"],
          // MUST be arrays for v6:
          redirectSignIn: [`${appOrigin}/callback`],
          redirectSignOut: [`${appOrigin}/logout`],
          responseType: "code",
        },
      },
    },
  },
});

console.log('[Amplify Config] Initialization complete');
