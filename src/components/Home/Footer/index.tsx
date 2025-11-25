import Logo from "@/assets/react.svg?react";
import googlePlay from "@/assets/images/googlePlay.png";
import appStore from "@/assets/images/appStore.png";
import Map from "@/assets/svgs/map.svg?react";
import Call from "@/assets/svgs/call.svg?react";
import Facebook from "@/assets/svgs/facebook2.svg?react";
import Twitter from "@/assets/svgs/twitter.svg?react";
import SnapChat from "@/assets/svgs/snapchat.svg?react";
import LinkedIn from "@/assets/svgs/linkedin.svg?react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-success/5 to-primary/5 py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row flex-wrap justify-between gap-10">
        {/* Logo + App Links */}
        <div className="flex flex-col items-center  gap-10 flex-1 min-w-[200px]">
          <Logo className="size-32 text-primary" />
          <div className="flex gap-2">
            <img src={googlePlay} alt="Google Play" className="h-10" />
            <img src={appStore} alt="App Store" className="h-10" />
          </div>
        </div>

        {/* Quick Click */}
        <div className="flex flex-col gap-4 flex-1 min-w-[150px] text-center md:text-left">
          <h3 className="font-semibold text-xl">Quick Click</h3>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Service
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-4 flex-1 min-w-[150px] text-center md:text-left">
          <h3 className="font-semibold text-xl">Support</h3>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Address + Contact + Social */}
        <div className="flex flex-col gap-4 flex-1 min-w-[250px]">
          <h3 className="font-semibold text-xl">Address</h3>
          <div className="flex items-start gap-4">
            <Map className="size-5 mt-1" />
            <div>
              <h4 className="font-medium text-lg">The React App</h4>
              <span className="text-muted-foreground text-sm">
                Level 12, 100 Mount Street, North Sydney, NSW 2060 Australia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Call className="size-5" />
            <span className="text-muted-foreground">+61 3 8376 6284</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Social Media</h3>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Facebook className="size-8 hover:opacity-80 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Twitter className="size-8 hover:opacity-80 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <SnapChat className="size-8 hover:opacity-80 transition text-primary" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <LinkedIn className="size-8 hover:opacity-80 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
