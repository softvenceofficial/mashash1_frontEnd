import arrow_left from "@/assets/svgs/arrow-left.svg";
import Icon from "@/components/common/Icon";
import { useNavigate } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md cursor-pointer"
    >
      <span className="w-full h-full bg-linear-to-r from-[#4E45E4] via-[#DD9A73] to-[#946FAE] group-hover:from-[#4E45E4] group-hover:via-[#DD9A73] group-hover:to-[#946FAE] absolute"></span>
      <span className="relative px-7 py-2.5 transition-all ease-out bg-background dark:bg-black rounded-md group-hover:bg-opacity-0 duration-400 flex items-center gap-2">
        <Icon src={arrow_left} className="size-7 text-black dark:text-white" />
        <span className="relative text-black dark:text-white">Back</span>
      </span>
    </button>
  );
}
