import { Outlet } from "react-router";
import Header from "@/components/Home/Header";
import Modals from "@/components/Modal";

export default function HomeLayout() {
  return (
    <section className="min-h-screen flex flex-col bg-background">
      <Header />
      <Outlet />
      <div className="mt-auto">
        {/* <Footer /> */}
      </div>
      <Modals />
    </section>
  );
}
