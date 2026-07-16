import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card, type Tag } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Sidebar } from "../components/Sidebar"
import { useContent } from "../hooks/useContent"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { LogoutIcon } from "../icons/LogoutIcon"
import { ShareBrainModal } from "../components/ShareBrainModal"

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const {contents, refresh} = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  function logout() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  async function deleteContent(contentId: string) {
    await axios.delete(`${BACKEND_URL}/api/v1/content/${contentId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });
    refresh();
  }

  return <div className="min-h-screen bg-slate-50">
    <Sidebar />
    <main className="min-h-screen ml-56 px-7 py-8 md:px-10">
      <CreateContentModal open={modalOpen} onClose={() => {
        setModalOpen(false);
      }} />
      <ShareBrainModal open={shareModalOpen} itemCount={contents.length} onClose={() => setShareModalOpen(false)} />
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Your personal library</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">All Notes</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShareModalOpen(true)} variant="secondary" text="Share brain" startIcon={<ShareIcon />}></Button>
        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
          <button
            type="button"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <LogoutIcon />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-5">
        {contents.map(({_id, type, link, title, tags}: { _id: string; type: "tweet" | "video" | "image" | "article" | "audio"; link: string; title: string; tags: Tag[] }) => <Card
            key={_id}
            contentId={_id}
            type={type}
            link={link}
            title={title}
            tags={tags}
            onDelete={deleteContent}
        />)}
      </div>
    </main>
  </div>
}
