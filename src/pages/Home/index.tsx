import Banner from "@/components/Home/Banner";
import CreativeAiStudio from "@/components/Home/CreativeAiStudio/CreativeAiStudio";
import ImaginationLab from "@/components/Home/ImaginationLab";
import StorybookShowcase from "@/components/Home/StoryBook";

export default function HomePage() {


  return (
    <div className="bg-black">
      <Banner />
      <StorybookShowcase />
      <ImaginationLab />
      <CreativeAiStudio />
      {/* <div className="bg-black py-20 relative z-50">
        fhdjh
      </div> */}
    </div>
  );
}
