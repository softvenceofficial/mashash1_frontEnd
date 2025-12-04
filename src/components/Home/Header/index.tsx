import Logo from "@/assets/svgs/logo.svg";
import { Link } from "react-router";
import useCurrentUser from "@/hooks/useCurrentUser"
import Icon from "@/components/common/Icon";

export default function Header() {
  const user = useCurrentUser();
  console.log(user);

const links = [
  { name: "Home", id: "home" },
  { name: "About us", id: "about" },
  { name: "Create your own book", id: "create-book" },
  { name: "Pricing", id: "pricing" },
  { name: "Support", id: "support" },
]

  return (
    <nav className="relative z-10 py-4 hidden md:block">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/">
            <Icon src={Logo} className="size-8 text-white" />
          </Link>

          <div className="">
            <ul className="flex items-center gap-10 text-white font-medium">
              {links.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => {
                    const element = document.getElementById(link.id)
                    element?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="text-lg font-normal cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
          </ul>
          </div>
        </div>

        { 
        user ? 
          <Link to="/dashboard" className="bg-white text-black py-3 px-10 rounded-lg text-lg font-medium">Dashboard</Link>
        :
          <ul className="flex items-center gap-4 font-semibold">
          <li >
            <Link to="/auth/signup" className="border border-white py-3 px-10 rounded-lg text-white hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">Register</Link>
          </li>
          <li  >
            <Link to="/auth/signin" className="bg-white py-3 px-10 rounded-lg text-black border border-white">Log In</Link>
          </li>
        </ul>}
      </div>
    </nav>
  );
}
