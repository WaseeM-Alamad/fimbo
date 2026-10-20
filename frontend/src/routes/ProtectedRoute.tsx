import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // const { user, authLoading, isLoggedIn } = useAuth();

  // if ((!user && !authLoading) || !isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <main>
      <Outlet />
    </main>
  );
}
