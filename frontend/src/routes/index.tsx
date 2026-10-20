import { createBrowserRouter } from "react-router-dom";
import LanguageProvider from "../components/LanguageProvider";
import ProtectedRoute from "./ProtectedRoute";
import LoggedOutRoute from "./LoggedOutRoute";
import NotFound from "../components/NotFound/NotFound";
import UnProtectedRoute from "./UnprotectedRoute";
import { loggedOutPaths, ProtectedPaths, unProtectedPaths } from "./paths";
import { MenuProvider } from "../context/FloatingMenuContext";
import { ModalProvider } from "../context/ModalContext";
import { TooltipProvider } from "../context/TooltipContext";

const router = createBrowserRouter([
  {
    path: "/:lang?",
    element: (
      <>
        <TooltipProvider>
          <ModalProvider>
            <MenuProvider>
              <LanguageProvider />
            </MenuProvider>
          </ModalProvider>
        </TooltipProvider>
      </>
    ),
    children: [
      {
        element: <UnProtectedRoute />,
        children: unProtectedPaths,
      },

      {
        element: <LoggedOutRoute />,
        children: loggedOutPaths,
      },
      {
        element: <ProtectedRoute />,
        children: ProtectedPaths,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
