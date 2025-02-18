import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authApi.currentUser);
  const { toast } = useToast();

  const login = useCallback(
    async (payload) => {
      const loggedIn = await authApi.login(payload);
      authApi.saveUser(loggedIn);
      setUser(loggedIn);
      toast('Welcome back!', 'success');
      return loggedIn;
    },
    [toast]
  );

  const register = useCallback(
    async (payload) => {
      const created = await authApi.register(payload);
      await login(payload);
      return created;
    },
    [login]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    authApi.saveUser(null);
    setUser(null);
    toast('Signed out.', 'info');
  }, [toast]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isAdmin: user?.role === 'admin', isStaff: ['admin', 'staff'].includes(user?.role), login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
