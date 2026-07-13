import { useState } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

interface CardProps {
    contentId: string;
    title: string;
    link: string;
    type: "tweet" | "video" | "image";
    onDelete: (contentId: string) => Promise<void>;
}

function ContentTypeIcon({ type }: { type: CardProps["type"] }) {
    const className = "size-4";

    if (type === "video") return <YoutubeIcon className={className} />;
    if (type === "tweet") return <TwitterIcon className={className} />;
    return <ImageIcon className={className} />;
}

export function Card({ contentId, title, link, type, onDelete }: CardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await onDelete(contentId);
        } finally {
            setIsDeleting(false);
        }
    }

    return <article className="w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between gap-3">
                <div className="flex min-w-0 items-center text-sm font-medium text-slate-800">
                    <div className="shrink-0 text-slate-500 pr-2" aria-hidden="true">
                        <ContentTypeIcon type={type} />
                    </div>
                    <span className="truncate">{title}</span>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label={`Delete ${title}`}
                    title="Delete content"
                    className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50"
                >
                    <DeleteIcon />
                </button>
            </div>

            <div className="pt-4">
                {type === "video" && <iframe className="aspect-video w-full rounded-lg" src={link.replace("watch", "embed").replace("?v=", "/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}

                {type === "tweet" && <blockquote className="twitter-tweet">
                    <a href={link.replace("x.com", "twitter.com")}></a> 
                </blockquote>}
                {type === "image" && <img className="aspect-video w-full rounded-lg object-cover" src={link} alt={title} />}
            </div>
    </article>
}
