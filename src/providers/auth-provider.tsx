"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import AuthModal from "@/components/auth/AuthModal";
import { setUnauthorizedHandler } from "@/lib/auth-events";
import {
  clearAuthSession,
  getAccessToken,
  getAuthSnapshot,
  getServerAuthSnapshot,
  persistAuthSession,
  subscribeAuthStore,
  type StoredAuthUser,
} from "@/lib/auth-storage";
import { toastSuccess } from "@/lib/toast";
import { logoutRequest } from "@/services/auth/auth.api";
import { authKeys } from "@/services/auth/auth.queries";
import { customerKeys } from "@/services/customer/customer.queries";
import type { AuthModalView, AuthSessionData } from "@/services/auth/auth.types";

type AuthSuccessCallback = () => void;

interface AuthContextValue {
  isAuthenticated: boolean;
  user: StoredAuthUser | null;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  requireAuth: (onAuthenticated: AuthSuccessCallback) => void;
  applySession: (session: AuthSessionData, options?: { successMessage?: string }) => void;
  logout: () => Promise<void>;
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
  const queryClient = useQueryClient();
  const authSnapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<AuthModalView>("login");
  const [pendingAction, setPendingAction] = useState<AuthSuccessCallback | null>(null);

  const isAuthenticated = Boolean(authSnapshot.token);
  const user = authSnapshot.user;

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const openAuthModal = useCallback((view: AuthModalView = "login") => {
    setModalView(view);
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void queryClient.removeQueries({ queryKey: authKeys.all });
      void queryClient.removeQueries({ queryKey: customerKeys.all });
      setModalView("login");
      setIsModalOpen(true);
    });

    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  const applySession = useCallback(
    (session: AuthSessionData, options?: { successMessage?: string }) => {
      persistAuthSession({
        accessToken: session.accessTokenObject.token,
        refreshToken: session.refreshTokenObject.token,
        user: sessionToUser(session),
      });
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

  const clearLocalSession = useCallback(() => {
    clearAuthSession();
    void queryClient.removeQueries({ queryKey: authKeys.all });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await logoutRequest();
      }
    } catch {
      // Always clear local session even if the API call fails.
    } finally {
      clearLocalSession();
      toastSuccess("با موفقیت خارج شدید.");
    }
  }, [clearLocalSession]);

  const requireAuth = useCallback((onAuthenticated: AuthSuccessCallback) => {
    if (getAccessToken()) {
      onAuthenticated();
      return;
    }
    setPendingAction(() => onAuthenticated);
    setModalView("login");
    setIsModalOpen(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      applySession,
      logout,
    }),
    [isAuthenticated, user, openAuthModal, closeAuthModal, requireAuth, applySession, logout],
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
