import { Outlet } from "react-router-dom";

export default function LoggedOutRoute() {
  // const { user, authLoading } = useAuth();

  // if (authLoading) {
    // return <LogoLoader />;
  // }

  // if (user) {
    // return <Navigate to="/dashboard" replace />;
  // }

  return <Outlet />;
}
