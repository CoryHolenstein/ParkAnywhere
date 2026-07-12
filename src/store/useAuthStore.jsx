import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useAuthStore = create(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as loading until hydration completes
    isIncognito: false,
    token: null,
    accessToken: null,
    refreshToken: null,

    // Set loading state
    setLoading: (loading) => set({ isLoading: loading }),

    // INCÓGNITO LOGIN
    loginIncognito: (username = "Guest User") => {
      const incognitoUser = {
        id: "",
        username,
        email: `${username.toLowerCase().replace(" ", ".")}@incognito.local`,
        isIncognito: true,
        loginTime: new Date().toISOString(),
      };

      set({
        user: incognitoUser,
        isAuthenticated: true,
        isIncognito: true,
        token: `incognito_${Math.random().toString(36).substring(2, 11)}`,
      });
    },

    // 🔥 REAL Cognito Login
    // `userData` = decoded Cognito ID token payload
    // `tokens` = { idToken, accessToken, refreshToken }
    loginCognito: (userData, tokens) => {
      console.log('[useAuthStore.loginCognito] Starting Cognito login...', {
        userDataKeys: Object.keys(userData || {}),
        tokenKeys: Object.keys(tokens || {}),
      });

      const user = {
        id: userData.sub,
        username: userData["cognito:username"] || userData.email.split("@")[0],
        email: userData.email,
        isIncognito: false,
        loginTime: new Date().toISOString(),
      };

      console.log('[useAuthStore.loginCognito] Setting user state:', {
        userId: user.id,
        username: user.username,
        email: user.email,
      });

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isIncognito: false,
        token: tokens.idToken,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
      });

      console.log('[useAuthStore.loginCognito] Cognito login complete');
    },

    // OLD login — not used anymore but kept for compatibility
    login: (email) => {
      const user = {
        id: Math.random().toString(36).substring(7),
        username: email.split("@")[0],
        email,
        isIncognito: false,
        loginTime: new Date().toISOString(),
      };

      set({
        user,
        isAuthenticated: true,
        isIncognito: false,
      });
    },

    // LOGOUT
    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isIncognito: false,
        token: null,
        accessToken: null,
        refreshToken: null,
      });
    },

    getUser: () => get().user,
    getIsAuthenticated: () => get().isAuthenticated,
    getIsLoading: () => get().isLoading,
    getIsIncognito: () => get().isIncognito,
    getToken: () => get().token,
    getAccessToken: () => get().accessToken,

    updateUser: (updates) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    },

    isGuest: () => {
      const { user } = get();
      return user?.isIncognito || false;
    },
  }))
);

export { useAuthStore };
export default useAuthStore;
