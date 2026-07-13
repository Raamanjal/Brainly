import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
  Youtube = "video",
  Twitter = "tweet",
  Image = "image",
}

const contentTypes = [
  { value: ContentType.Youtube, label: "YouTube" },
  { value: ContentType.Twitter, label: "Twitter / X" },
  { value: ContentType.Image, label: "Image" },
];

export function CreateContentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function addContent() {
    const title = titleRef.current?.value.trim() ?? "";
    const link = linkRef.current?.value.trim() ?? "";

    if (!title || !link) {
      setError("Please add both a title and a link.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(`${BACKEND_URL}/api/v1/content`, { link, title, type }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onClose();
    } catch {
      setError("Unable to add content. Check the link and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="add-content-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-700">Second Brain</p>
            <h2 id="add-content-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Add content</h2>
            <p className="mt-1 text-sm text-slate-500">Save a useful link to revisit later.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close add content dialog" className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <CrossIcon />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input ref={titleRef} placeholder="e.g. Learn TypeScript" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Link</span>
            <input ref={linkRef} type="url" placeholder="https://..." className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Content type</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {contentTypes.map((contentType) => <button
                key={contentType.value}
                type="button"
                aria-pressed={type === contentType.value}
                onClick={() => setType(contentType.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${type === contentType.value ? "border-violet-600 bg-violet-600 text-white shadow-sm" : "border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100"}`}
              >
                {contentType.label}
              </button>)}
            </div>
          </fieldset>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={addContent} disabled={isSubmitting} className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Adding..." : "Add content"}</button>
        </div>
      </div>
    </div>
  );
}
