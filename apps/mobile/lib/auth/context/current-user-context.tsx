import { AppUserProjection } from "@/screens/auth/signup/types";
import { authClient } from "../auth-client";
import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { currentUserQueryOptions } from "../hooks/current-user-query-options";

type AuthSession = typeof authClient.$Infer.Session;
type AuthUser = AuthSession["user"];
type AuthSessionData = AuthSession["session"];

type CurrentUserStatus =
  | "loading-session"
  | "signed-out"
  | "initializing-user"
  | "ready"
  | "error";

type CurrentUserContextValue = {
  user: AppUserProjection | null;

  authUser: AuthUser | null;
  authSession: AuthSessionData | null;

  isAuthenticated: boolean;
  isReady: boolean;
  status: CurrentUserStatus;
  error: Error | null;
  retry: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const {
    data: sessionData,
    isPending: isSessionPending,
    error: sessionError,
  } = authClient.useSession();

  const authUser = sessionData?.user ?? null;
  const authSession = sessionData?.session ?? null;

  const appUserQuery = useQuery(currentUserQueryOptions(authUser?.id));

  let status: CurrentUserStatus;

  if (isSessionPending) {
    status = "loading-session";
  } else if (!authUser) {
    status = "signed-out";
  } else if (appUserQuery.isPending) {
    status = "initializing-user";
  } else if (appUserQuery.isError || !appUserQuery.data) {
    status = "error";
  } else {
    status = "ready";
  }

  const contextError: Error | null =
    appUserQuery.error instanceof Error
      ? appUserQuery.error
      : sessionError
        ? new Error(sessionError.message)
        : null;

  const value: CurrentUserContextValue = {
    user: appUserQuery.data ?? null,

    authUser,
    authSession,

    isAuthenticated: Boolean(authUser),
    isReady: status === "ready",
    status,

    error: contextError,

    retry: () => {
      void appUserQuery.refetch();
    },
  };

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  }

  return context;
}
