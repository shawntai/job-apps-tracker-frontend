import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Register";
import AuthPage from "./pages/AuthPage";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import Create from "./pages/Create";
import Profile from "./pages/Profile";

const router = createHashRouter([
	{
		path: "/",
		element: <AuthPage />,
	},
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/jobs/:id",
    element: <Job />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/profile",
    element: <Profile />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
