import App from "../App";
import Login from "../pages/Login/Login";

// Unprotected
export const unProtectedPaths = [
  {
    index: true,
    element: <App />,
  },
];

// Protected
export const ProtectedPaths = [
  // {
  //   path: "dashboard",
  //   element: <Dashboard />,
  // },
  // {
  //   path: "forms",
  //   children: [
  //     { index: true, element: <FormsList /> },
  //     { path: ":formId/builder", element: <FormBuilder /> },
  //     // { path: "template", element: <FormTemplate /> },
  //   ],
  // },
];

// logged out
export const loggedOutPaths = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "login/forgot-password",
    element: <Login />,
  },
];
