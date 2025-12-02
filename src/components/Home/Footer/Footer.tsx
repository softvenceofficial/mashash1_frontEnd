import Icon from "@/components/common/Icon";
import LinkColumn from "./LinkColumn";
import logo from "@/assets/svgs/logo.svg";
import { Separator } from "@/components/ui/separator";


// Define the structure for the navigation links
interface LinkItem {
  label: string;
  href: string;
}
// Define the structure for a column
export interface FooterColumn {
  title: string;
  links: LinkItem[];
}

export default function Footer() {
  return (
    <footer className="bg-[#202020] text-white rounded-t-xl mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 md:gap-8 lg:gap-16">
          {/* Column 1: Branding and Description */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 text-white mb-6">
              <Icon src={logo} className="size-8 text-white" />
              {/* If you have a textual brand name, place it here: <span className="text-xl font-bold">BrandName</span> */}
            </div>
            <p className="text-[#BCBCBC] text-sm max-w-sm">
              Lorem ipsum dolor sit amet consectetur. Semper leo senectus diam
              magna vel nunc. Eu et facilisis nisi consectetur malesuada eros
              justo. Egestas magna porttitor lorem mus
            </p>
          </div>

          {/* Link Columns (Quick Links, Resources, Our Service, Follow Us) */}
          <div className="col-span-2 md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {footerData.map((column) => (
              <LinkColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="">
        <Separator className=" bg-[#363636] max-w-4xl mx-auto" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-[#BCBCBC] text-xs">© 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


// Data for the footer columns
const footerData: FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "About us", href: "#about" },
      { label: "Create your own book", href: "#create" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#help" },
      { label: "Security Guide", href: "#security" },
      { label: "Supported Coins", href: "#coins" },
      { label: "API Access (if applicable)", href: "#api" },
      { label: "Developer Docs", href: "#dev-docs" },
    ],
  },
  {
    title: "Our Service",
    links: [
      { label: "Color Book", href: "#color" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookie" },
      { label: "Compliance & Security", href: "#compliance" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "Twitter (X)", href: "#twitter" },
      { label: "Telegram", href: "#telegram" },
      { label: "Discord", href: "#discord" },
      { label: "LinkedIn", href: "#linkedin" },
      { label: "GitHub", href: "#github" },
    ],
  },
];

