import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";

export default function BannerSection() {
  const avatars = [
    "https://github.com/shadcn.png",
    "https://github.com/maxleiter.png",
    "https://github.com/evilrabbit.png",
  ];
  return (
    <section className="container mx-auto py-10 px-4 md:pt-20 md:pb-40 relative z-10">
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {avatars.map((src, index) => (
          <Avatar className="size-8">
            <AvatarImage
              src={src}
              alt={`@avatar-${index}`}
              className="rounded-full border border-white"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <p className="text-base font-normal mt-3 text-white">1,200+ reviews (4.9 of 5)</p>
      <h1 className="text-3xl md:text-4xl lg:text-[60px] xl:text-[80px] font-bold max-w-96 md:max-w-md lg:max-w-3xl leading-snug text-white">
        Make Your Own Book with Zero Effort
      </h1>
      <p className="text-base md:text-lg font-normal max-w-3xl mt-4 text-white">
        Design beautiful pages in minutes! Just choose a layout, add your ideas,
        and customize everything your way. It’s fast, fun, and super easy.
      </p>
      <div className="mt-8 flex items-center gap-6">
        <Button className="bg-linear-to-r from-[#6366F1] via-[#E294AC] to-[#E0AD8C] text-base font-semibold px-6 h-12 rounded-[12px] cursor-pointer">
          Get Started Free
        </Button>
        <Button variant={"outline"} className="bg-transparent hover:bg-linear-to-r from-[#6366F1] via-[#E294AC] to-[#E0AD8C] text-base font-semibold px-6 h-12 rounded-[12px] transition duration-500 ease-in-out text-white hover:text-white cursor-pointer">
          View Demo
        </Button>
      </div>
    </section>
  );
}
