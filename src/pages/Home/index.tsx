import Banner from "@/components/Home/Banner";
import CreativeAiStudio from "@/components/Home/CreativeAiStudio/CreativeAiStudio";
import ImaginationLab from "@/components/Home/ImaginationLab";
import PricingSection from "@/components/Home/PricingSection/PricingSection";
import StorybookShowcase from "@/components/Home/StoryBook";

export default function HomePage() {


  return (
    <div className="bg-black">
      <Banner />
      <StorybookShowcase />
      <ImaginationLab />
      <CreativeAiStudio />
      <PricingSection />
      {/* <div className="bg-black py-20 relative z-50">
        fhdjh
      </div> */}
    </div>
  );
}
