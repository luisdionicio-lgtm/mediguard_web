import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Hook centralizado de autenticación.
 * Fuente de verdad: localStorage (vía authService).
 *
 * @returns {{ user, isAuthenticated, isAdmin, login, googleLogin, logout, refreshToken }}
 */
export function useAuth() {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  const _sync = useCallback(() => {
    setUser(authService.getCurrentUser());
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    _sync();
    return data;
  }, [_sync]);

  const googleLogin = useCallback(async (credential) => {
    const data = await authService.googleLogin(credential);
    _sync();
    return data;
  }, [_sync]);

  const logout = useCallback(async () => {
    await authService.logout();
    _sync();
  }, [_sync]);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return null;
    try {
      const data = await authService.refresh(refresh);
      _sync();
      return data;
    } catch {
      await logout();
      return null;
    }
  }, [_sync, logout]);

  return {
    user,
    isAuthenticated,
    isAdmin: authService.isAdmin(),
    login,
    googleLogin,
    logout,
    refreshToken,
  };
}
