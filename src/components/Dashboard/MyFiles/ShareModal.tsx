import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ShareModal() {
  const shareableLink = `https/drive.com/file/example_434Dkadoijdiwdjij/view?`;

  const HandleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Share this file</h2>
      <div className="flex items-center gap-7">
        <Input
          type="text"
          className="h-12 bg-white! border-none! outline-none! focus:ring-0! text-black"
          value={shareableLink}
          readOnly
        />
        <Button onClick={() => HandleCopy(shareableLink)} variant="default" className="bg-[#818CF8]! text-2xl px-7 h-12 cursor-pointer">
          Copy link
        </Button>
      </div>
    </div>
  );
}
