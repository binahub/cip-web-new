"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AuthModal from "@/components/auth/AuthModal";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  persistAuthSession,
  type StoredAuthUser,
} from "@/lib/auth-storage";
import { toastSuccess } from "@/lib/toast";
import type { AuthModalView, AuthSessionData } from "@/services/auth/auth.types";

type AuthSuccessCallback = () => void;

interface AuthContextValue {
  isAuthenticated: boolean;
  user: StoredAuthUser | null;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  requireAuth: (onAuthenticated: AuthSuccessCallback) => void;
  applySession: (session: AuthSessionData, options?: { successMessage?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionToUser(session: AuthSessionData): StoredAuthUser {
  return {
    firstName: session.customerLoginObject.firstName,
    lastName: session.customerLoginObject.lastName,
    username: session.customerLoginObject.username,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<AuthModalView>("login");
  const [pendingAction, setPendingAction] = useState<AuthSuccessCallback | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getStoredUser();
    setIsAuthenticated(Boolean(token));
    setUser(storedUser);
    setHydrated(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const openAuthModal = useCallback((view: AuthModalView = "login") => {
    setModalView(view);
    setIsModalOpen(true);
  }, []);

  const applySession = useCallback(
    (session: AuthSessionData, options?: { successMessage?: string }) => {
      const nextUser = sessionToUser(session);
      persistAuthSession({
        accessToken: session.accessTokenObject.token,
        refreshToken: session.refreshTokenObject.token,
        user: nextUser,
      });
      setUser(nextUser);
      setIsAuthenticated(true);
      setIsModalOpen(false);

      if (options?.successMessage) {
        toastSuccess(options.successMessage);
      }

      const action = pendingAction;
      setPendingAction(null);
      action?.();
    },
    [pendingAction],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const requireAuth = useCallback(
    (onAuthenticated: AuthSuccessCallback) => {
      if (getAccessToken()) {
        onAuthenticated();
        return;
      }
      setPendingAction(() => onAuthenticated);
      setModalView("login");
      setIsModalOpen(true);
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: hydrated ? isAuthenticated : false,
      user,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      applySession,
      logout,
    }),
    [
      hydrated,
      isAuthenticated,
      user,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      applySession,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={isModalOpen}
        view={modalView}
        onViewChange={setModalView}
        onClose={closeAuthModal}
        onAuthenticated={applySession}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
