import { useState } from "react";
import { useShareBookMutation } from "@/redux/endpoints/bookApi";
import { toast } from "sonner";

interface ShareModalProps {
  bookId: number;
  onClose?: () => void;
}

export const ShareModal = ({ bookId, onClose }: ShareModalProps) => {
  const [shareBook, { isLoading }] = useShareBookMutation();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    try {
      const response = await shareBook(bookId).unwrap();
      setShareUrl(response.data.share_url);
      toast.success("Share link generated successfully!");
    } catch (error) {
      toast.error("Failed to generate share link");
      console.error(error);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy link");
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Share Book</h3>

        {!shareUrl ? (
          <button
            onClick={handleGenerateLink}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {isLoading ? "Generating..." : "Generate Share Link"}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Share this link with others to let them view your book.
            </p>
          </div>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
