import Link from 'next/link'
import { Mic, ArrowRight } from 'lucide-react'

const episodes = [
  { slug: 'hello-meadow', title: '第一集：和山野间的风打个招呼', date: '2026.07', duration: '23:12', summary: '一个简单的开始。我会告诉你为什么要做这个播客，以及未来想分享什么。', tags: ['开场', '随感'] },
]

export default function EpisodesPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">播客 · Episodes</h1>
        <p className="text-stone-500 mt-2">声音里的故事，慢慢讲。</p>
      </header>

      <div className="space-y-4">
        {episodes.map((ep) => (
          <Link key={ep.slug} href={`/episodes/${ep.slug}`} className="card block">
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1"><Mic size={12} /> {ep.duration}</span>
              <span>{ep.date}</span>
            </div>
            <h2 className="text-xl font-semibold mt-2">{ep.title}</h2>
            <p className="text-stone-500 mt-2 leading-relaxed">{ep.summary}</p>
            <div className="mt-3">
              {ep.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
            </div>
            <div className="text-sm text-[#d97757] mt-4 flex items-center gap-1">收听 <ArrowRight size={14} /></div>
          </Link>
        ))}
      </div>
    </>
  )
}