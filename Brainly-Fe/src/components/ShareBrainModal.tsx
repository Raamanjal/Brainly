import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CrossIcon } from "../icons/CrossIcon";
import { ShareIcon } from "../icons/ShareIcon";

interface ShareBrainModalProps {
  open: boolean;
  itemCount: number;
  onClose: () => void;
}

export function ShareBrainModal({ open, itemCount, onClose }: ShareBrainModalProps) {
  const [status, setStatus] = useState<"idle" | "sharing" | "shared" | "error">("idle");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setShareUrl("");
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  async function shareBrain() {
    setStatus("sharing");
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, { share: true }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const url = `${window.location.origin}/share/${response.data.hash}`;
      setShareUrl(url);

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        setCopied(false);
      }

      setStatus("shared");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="share-brain-title">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 id="share-brain-title" className="text-base font-semibold text-slate-900">
            {status === "shared" ? "Your Second Brain is shared" : "Share Your Second Brain"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close share dialog" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <CrossIcon />
          </button>
        </div>

        {status === "shared" ? (
          <div className="mt-5">
            <p className="text-sm leading-5 text-slate-600">{copied ? "Your public link has been copied to the clipboard." : "Your public link is ready. Copy it below to share."}</p>
            <input readOnly value={shareUrl} aria-label="Public share link" className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" onFocus={(event) => event.currentTarget.select()} />
            <button type="button" onClick={onClose} className="mt-4 w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700">Done</button>
          </div>
        ) : (
          <>
            <p className="mt-5 text-sm leading-5 text-slate-600">Share your entire collection of notes, documents, tweets, and videos with others. They&apos;ll be able to view your content in their own Second Brain.</p>
            <button type="button" onClick={shareBrain} disabled={status === "sharing"} className="mt-4 flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">
              <span className="mr-2"><ShareIcon /></span>
              {status === "sharing" ? "Creating link..." : "Share Brain"}
            </button>
            {status === "error" && <p className="mt-3 text-center text-sm text-red-600">We couldn&apos;t create the share link. Please try again.</p>}
            <p className="mt-3 text-center text-xs text-slate-500">{itemCount} {itemCount === 1 ? "item" : "items"} will be shared</p>
          </>
        )}
      </div>
    </div>
  );
}
