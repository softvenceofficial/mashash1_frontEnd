import Banner from "@/components/Home/Banner";
import CreativeAiStudio from "@/components/Home/CreativeAiStudio/CreativeAiStudio";
import DashboardSliders from "@/components/Home/DashboardSliders/DashboardSliders";
import Footer from "@/components/Home/Footer/Footer";
import ImaginationLab from "@/components/Home/ImaginationLab";
import ImmigrationAutoDesignSection from "@/components/Home/ImmigrationAutoDesign/ImmigrationAutoDesignSection";
import PricingSection from "@/components/Home/PricingSection/PricingSection";
import StorybookShowcase from "@/components/Home/StoryBook";
import SnowEffect from "@/components/Home/SnowEffect";

export default function HomePage() {

  return (
    <div className="relative min-h-screen bg-black">
      
      <SnowEffect />

      <div className="relative z-10">
        <Banner />
        <StorybookShowcase />
        <ImaginationLab />
        <DashboardSliders />
        <ImmigrationAutoDesignSection />
        <CreativeAiStudio />
        <PricingSection />
        <Footer />
      </div>
      
    </div>
  );
}
