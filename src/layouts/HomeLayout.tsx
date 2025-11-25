import { Outlet } from "react-router";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";

export default function HomeLayout() {
  return (
    <section className="min-h-screen flex flex-col bg-background">
      <Header />
      <Outlet />
      <div className="mt-auto">
        <Footer />
      </div>
    </section>
  );
}
