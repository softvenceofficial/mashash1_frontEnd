import DashboardLayout from "@/layouts/DashboardLayout";
import HomeLayout from "@/layouts/HomeLayout";
import DashboardPage from "@/pages/Dashboard";
import HomePage from "@/pages/Home";
import NotFoundPage from "@/pages/NotFoundPage";
import { createBrowserRouter, Navigate } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/home" replace />,
      },
      {
        path: "/dashboard/home",
        element: <DashboardPage />,
      },
    ],
  },
]);

export default router;
