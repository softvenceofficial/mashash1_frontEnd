import Header from "../Header";
import banner1 from "@/assets/images/banner1.png";
import BannerSection from "./BannerSection";

export default function Banner() {
  return (
    <section className="min-h-full relative flex flex-col py-8 px-5 backdrop-blur-[50px]">
      <div className="absolute blur-3xl inset-0 bg-linear-to-t from-[#786d7a] to-transparent" />
      <div
        className={`h-full w-full bg-cover bg-position-[center_30%] rounded-[30px] overflow-hidden relative `}
        style={{ backgroundImage: `url(${banner1})` }}
      >
        <Header />
        <BannerSection />
        <div className="absolute inset-0 bg-linear-to-t from-[#000000] to-transparent rounded-[30px] overflow-hidden" />
      </div>
    </section>
  );
}
