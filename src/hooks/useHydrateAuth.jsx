// src/hooks/useHydrateAuth.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import useAuthStore from "../store/useAuthStore";

export default function useHydrateAuth() {
  const hydrated = useRef(false);
  const location = useLocation();
  const auth = useAuth();
  const loginCognito = useAuthStore((s) => s.loginCognito);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    // Skip hydration on callback page - let the OAuth flow handle auth
    if (location.pathname === '/callback') {
      console.log('[useHydrateAuth] On callback page, skipping hydration');
      return;
    }

    if (auth.isLoading) {
      return;
    }

    console.log('[useHydrateAuth] Starting OIDC auth hydration...', {
      isAuthenticated: auth.isAuthenticated,
      hasUser: !!auth.user,
    });

    if (auth.isAuthenticated && auth.user) {
      loginCognito(auth.user.profile, {
        idToken: auth.user.id_token,
        accessToken: auth.user.access_token,
        refreshToken: auth.user.refresh_token,
      });
      console.log('[useHydrateAuth] Successfully hydrated auth from OIDC context');
      return;
    }

    setLoading(false);
  }, [auth.isLoading, auth.isAuthenticated, auth.user, loginCognito, setLoading, location.pathname]);
}
