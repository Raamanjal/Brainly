import { useState } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

export type ContentType = "tweet" | "video" | "image" | "article" | "audio";

interface CardProps {
  contentId: string;
  title: string;
  link: string;
  type: ContentType;
  onDelete?: (contentId: string) => Promise<void>;
  readOnly?: boolean;
}

function ContentTypeIcon({ type }: { type: ContentType }) {
  const className = "size-4";
  if (type === "video") return <YoutubeIcon className={className} />;
  if (type === "tweet") return <TwitterIcon className={className} />;
  return <ImageIcon className={className} />;
}

export function Card({ contentId, title, link, type, onDelete, readOnly = false }: CardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setDeleteError(false);
    try {
      await onDelete?.(contentId);
      setConfirmDelete(false);
    } catch {
      setDeleteError(true);
    } finally {
      setIsDeleting(false);
    }
  }

  return <article className="w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex justify-between gap-3">
      <div className="flex min-w-0 items-center text-sm font-medium text-slate-800">
        <div className="shrink-0 pr-2 text-slate-500" aria-hidden="true"><ContentTypeIcon type={type} /></div>
        <span className="truncate">{title}</span>
      </div>
      {!readOnly && onDelete && <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        aria-label={`Delete ${title}`}
        title="Delete content"
        className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
      ><DeleteIcon /></button>}
    </div>

    <div className="pt-4">
      {type === "video" && <iframe className="aspect-video w-full rounded-lg" src={link.replace("watch", "embed").replace("?v=", "/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />}
      {type === "tweet" && <blockquote className="twitter-tweet"><a href={link.replace("x.com", "twitter.com")}></a></blockquote>}
      {type === "image" && <img className="aspect-video w-full rounded-lg object-cover" src={link} alt={title} />}
      {(type === "article" || type === "audio") && <a href={link} target="_blank" rel="noreferrer" className="block rounded-lg bg-slate-100 p-4 text-sm text-violet-700 hover:bg-violet-50">Open source ↗</a>}
    </div>

    {confirmDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby={`delete-title-${contentId}`}>
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
        <h2 id={`delete-title-${contentId}`} className="text-base font-semibold text-slate-900">Delete this item?</h2>
        <p className="mt-2 text-sm leading-5 text-slate-600">This will permanently remove “{title}” from your Second Brain.</p>
        {deleteError && <p className="mt-3 text-sm text-red-600">Unable to delete this item. Please try again.</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirmDelete(false)} disabled={isDeleting} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={handleDelete} disabled={isDeleting} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>}
  </article>;
}
