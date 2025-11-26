import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="bg-[url('/src/assets/images/auth-bg.png')] bg-cover bg-no-repeat bg-center min-h-screen">
        <div className="container mx-auto py-10 px-4 flex items-center justify-center md:justify-start min-h-screen">
          <div className="bg-white p-4 md:p-12 w-2xl rounded-2xl ">
            <Outlet />
          </div>
        </div>
    </div>
  );
}
