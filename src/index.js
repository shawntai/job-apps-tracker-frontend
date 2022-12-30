import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Register";
import AuthPage from "./pages/AuthPage";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import Create from "./pages/Create";

const router = createBrowserRouter([
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
    path: "create",
    element: <Create />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
