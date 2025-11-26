import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomeLayout from "@/layouts/HomeLayout";
import SigninForm from "@/components/Auth/SigninForm";
import SignUpForm from "@/components/Auth/SignUpForm";
import DashboardPage from "@/pages/Dashboard";
import HomePage from "@/pages/Home";
import NotFoundPage from "@/pages/NotFoundPage";
import { createBrowserRouter, Navigate } from "react-router";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";

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
      {
        path: "/dashboard/my-files",
        element: <div>My file</div>,
      },
      {
        path: "/dashboard/trash",
        element: <div>Trash</div>,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/signin" replace />,
      },
      {
        path: "/auth/signin",
        element: <SigninForm />,
      },
      {
        path: "/auth/signup",
        element: <SignUpForm />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPasswordForm />,
      }
    ],
  }
]);

export default router;
