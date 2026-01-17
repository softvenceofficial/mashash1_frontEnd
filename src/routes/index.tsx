import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import SigninForm from "@/components/Auth/SigninForm";
import SignUpForm from "@/components/Auth/SignUpForm";
import DashboardPage from "@/pages/Dashboard";
import HomePage from "@/pages/Home";
import NotFoundPage from "@/pages/NotFoundPage";
import { createBrowserRouter, Navigate } from "react-router";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import OtpVerificationForm from "@/components/Auth/OtpVerificationForm";
import ChangePasswordForm from "@/components/Auth/ChangePasswordForm";
import Congrats from "@/components/Auth/Congrats";
import MyFilePage from "@/pages/Dashboard/MyFile";
import TrashPage from "@/pages/Dashboard/Trash";
import Creator from "@/pages/Dashboard/Creator";
import DownloadPage from "@/pages/Dashboard/MyFile/DownloadPage";
import { ProtectedRoute } from "./ProtectedRoute";
import ViewProfilePage from "@/components/common/ViewProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/dashboard",
    // All dashboard routes are now protected
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        // Redirects /dashboard to /dashboard/home
        element: <Navigate to="/dashboard/home" replace />,
      },
      {
        path: "/dashboard/home",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/my-files",
        element: <MyFilePage />,
      },
      {
        path: "/dashboard/my-files/downloaded",
        element: <DownloadPage />,
      },
      {
        path: "/dashboard/trash",
        element: <TrashPage />,
      },
      {
        path: "/dashboard/view-profile",
        element: <ViewProfilePage />,
      }
    ],
  },
  {
    path: "/Creator",
    // FIX: Moved Creator inside ProtectedRoute as requested
    element: <ProtectedRoute><Creator /></ProtectedRoute>,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/signin" />,
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
      },
      {
        path: "/auth/verify-otp",
        element: <OtpVerificationForm />,
      },
      {
        path: "/auth/change-password",
        element: <ChangePasswordForm />,
      },
      {
        path: "/auth/congrats",
        element: <Congrats />,
      }
    ],
  }
]);

export default router;