import { useState } from "react";
import { useShareBookMutation } from "@/redux/endpoints/bookApi";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";

export default function ShareModal() {
  const [searchParams] = useSearchParams();
  const bookIdStr = searchParams.get("bookId");
  const bookId = bookIdStr ? parseInt(bookIdStr, 10) : null;

  const [shareBook, { isLoading }] = useShareBookMutation();
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    if (!bookId) return;
    try {
      const res = await shareBook(bookId).unwrap();
      if (res.success) {
        // Generate the frontend URL using the token
        const frontendUrl = `${window.location.origin}/shared/${res.data.share_token}`;
        setShareLink(frontendUrl);
      }
    } catch (error) {
      console.error("Failed to generate share link", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#2F2F2F] rounded-lg">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Share Book</h2>
      
      {!shareLink ? (
        <Button onClick={handleGenerateLink} disabled={isLoading || !bookId} className="w-full">
          {isLoading ? "Generating..." : "Generate Shareable Link"}
        </Button>
      ) : (
        <div className="flex items-center gap-2 mt-4">
          <input 
            type="text" 
            readOnly 
            value={shareLink} 
            className="flex-1 p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          <Button onClick={handleCopy} variant="secondary">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </Button>
        </div>
      )}
    </div>
  );
}
