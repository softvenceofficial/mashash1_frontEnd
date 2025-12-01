import StoryCarousel from "./StoryCarousel";

export default function StorybookShowcase() {

  return (
    <section className="pt-20 pb-20 min-h-screen  relative ">
        <div className="absolute h-20 bg-black blur-2xl top-4 right-0 w-full"/>
      <div className="mx-auto w-fit mb-20 text-center relative">
        <h1 className="text-5xl font-bold max-w-4xl">Pick a moment, a feeling, or a line that keeps knocking on your mind.</h1>
        <p className="text-lg font-normal text-[#C4CDD5] mt-4">Turn any sentence into a custom image you can tweak, restyle, and make your own.</p>
      </div>
      <div className="h-full">
        <StoryCarousel />
      </div>
    </section>
  );
}
