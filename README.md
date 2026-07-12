<<<<<<< HEAD
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
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# FileStorage" 
>>>>>>> master
