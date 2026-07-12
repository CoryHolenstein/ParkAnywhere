# ParkAnywhere Local Frontend

This app can run locally against your AWS resources and supports Cognito Hosted UI login on localhost.

## 1) Configure environment

Copy [.env.example](.env.example) to `.env.local` and set real values.

Required values for login:

- `VITE_COGNITO_DOMAIN`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_COGNITO_REDIRECT_URI=http://localhost:5173`
- `VITE_COGNITO_LOGOUT_URI=http://localhost:5173`

API values:

- `VITE_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/v1`
- `VITE_USE_MOCK=false`

## 2) Cognito app client settings

In Cognito User Pool App Client (Hosted UI):

- Allowed callback URLs: `http://localhost:5173`
- Allowed sign-out URLs: `http://localhost:5173`
- OAuth flow for current frontend implementation: Implicit grant
- Scopes: `openid`, `email`, `profile`

## 3) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and click Log in in the top bar.

## Notes

- Protected API calls now use the Cognito ID token stored in local storage after Hosted UI redirect.
- Existing fallback env tokens still work if provided.
- Backend lambdas still need environment variables in AWS for table names.
