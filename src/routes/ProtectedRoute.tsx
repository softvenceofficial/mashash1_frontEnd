import useCurrentUser from "@/hooks/useCurrentUser";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) => {
  const userData = useCurrentUser();

  if (!userData?.id) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Example usage in routes file
{
  /* <ProtectedRoute roles={["ADMIN", "USER"]}>
  <DashboardLayout />
</ProtectedRoute>; */
}
