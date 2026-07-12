import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Callback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const loginCognito = useAuthStore((s) => s.loginCognito);

  console.log('[Callback] Page mounted. Auth state:', {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    hasUser: !!auth.user,
    error: auth.error?.message,
  });

  useEffect(() => {
    console.log('[Callback] Auth state changed:', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      hasUser: !!auth.user,
      error: auth.error?.message,
    });

    if (auth.isAuthenticated && auth.user) {
      console.log("[Callback] Authenticated. Syncing Cognito → Zustand.", {
        userId: auth.user.profile?.sub,
        email: auth.user.profile?.email,
        username: auth.user.profile?.['cognito:username'],
      });

      const userData = auth.user.profile; // decoded ID token claims

      const tokens = {
        idToken: auth.user.id_token ? auth.user.id_token.substring(0, 20) + '...' : undefined,
        accessToken: auth.user.access_token ? auth.user.access_token.substring(0, 20) + '...' : undefined,
        refreshToken: auth.user.refresh_token ? auth.user.refresh_token.substring(0, 20) + '...' : undefined,
      };
      console.log('[Callback] Tokens available:', tokens);

      loginCognito(userData, {
        idToken: auth.user.id_token,
        accessToken: auth.user.access_token,
        refreshToken: auth.user.refresh_token,
      });

      console.log('[Callback] Navigating to /owner');
      navigate('/owner', { replace: true });
    } else if (auth.error) {
      console.error('[Callback] Authentication error:', {
        error: auth.error.message,
        errorCode: auth.error.code,
      });
    }
  }, [auth.isAuthenticated, auth.user, auth.error, loginCognito, navigate]);

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return <div>Completing login...</div>;
}
