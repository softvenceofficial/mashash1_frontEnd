import { Button } from "@/components/ui/button";
import imagin from "@/assets/images/imagin.png";

export default function ImaginationLab() {
  return (
    <section className="container mx-auto py-20 px-5">
      <div className="flex items-center gap-10 w-full">
        <div className="w-1/2">
          <h1 className="text-5xl font-semibold mb-4 ">
            A playful studio where kids turn imagination into real books and
            cards.
          </h1>
          <p className="text-lg font-medium text-[#C4CDD5] ">
            Our platform was created to redefine the way digital books are made
            and shared. We combine powerful creation tools with a simple
            interface that inspires creativity in every user.
          </p>
          <p className="text-lg font-medium text-[#C4CDD5] my-10 ">
            We’re passionate about storytelling, design, and education — and
            we’re constantly improving to make book creation faster, smarter,
            and more enjoyable for everyone.
          </p>
          <Button className="bg-linear-to-r from-[#6366F1] via-[#E294AC] to-[#E0AD8C] text-base font-semibold px-6 h-12 rounded-[12px] cursor-pointer">
            Explore Instantly
          </Button>
        </div>
        <div className="relative w-1/2">
            <div className="h-full w-10 bg-black blur-[10px] absolute -left-4 top-0" />
            <div className="h-full w-10 bg-black blur-[10px] absolute -right-4 top-0" />
            <div className="h-10 w-full bg-black blur-[10px] absolute left-0 -top-4" />
            <div className="h-10 w-full bg-black blur-[10px] absolute left-0 -bottom-4" />
            <img src={imagin} alt="Imagination Lab" className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
