import Icon from "@/components/common/Icon";
import download from "@/assets/svgs/download.svg";
import RecentWork from "@/components/Dashboard/MyFiles/RecentWork";
import PreviousWork from "@/components/Dashboard/MyFiles/PreviousWork";


export default function MyFilePage() {
  return (
    <div>
        <div className="mb-12">
            <Icon src={download} className="w-64 h-56 text-gray-500" />
            <p className="text-lg font-medium mt-1">Downloaded</p>
        </div>
        <RecentWork />
        <PreviousWork />
    </div>
  )
}
