import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mic, Clock, Calendar } from 'lucide-react'

const episodes: Record<string, { title: string; date: string; duration: string; tags: string[]; body: string[]; audio?: string }> = {
  'hello-meadow': {
    title: '第一集：和山野间的风打个招呼',
    date: '2026.07',
    duration: '23:12',
    tags: ['开场', '随感'],
    body: [
      '一个简单的开始。',
      '我想在这里慢悠悠地和你聊聊——关于生活的留意，关于旅行中的片段，也关于那些被遗忘的小事。',
      '欢迎你来。慢慢听，慢慢看。',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(episodes).map((slug) => ({ slug }))
}

export default function EpisodePage({ params }: { params: { slug: string } }) {
  const ep = episodes[params.slug]
  if (!ep) notFound()

  return (
    <article>
      <Link href="/episodes" className="text-sm text-stone-400 flex items-center gap-1 mb-6"><ArrowLeft size={14} /> 返回播客列表</Link>

      <div className="flex items-center gap-3 text-sm text-stone-400 mb-2">
        <span className="flex items-center gap-1"><Mic size={14} /> {ep.duration}</span>
        <span className="flex items-center gap-1"><Calendar size={14} /> {ep.date}</span>
      </div>

      <h1 className="text-3xl font-bold mb-3">{ep.title}</h1>
      <div className="mb-6">
        {ep.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
      </div>

      <div className="card mb-8" style={{ background: '#f5efe3' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#d97757] flex items-center justify-center text-white">
            <Mic size={20} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-stone-500">音频即将上线</div>
            <div className="h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#d97757] rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-stone max-w-none">
        {ep.body.map((p, i) => <p key={i} className="text-stone-700 leading-relaxed mb-4 text-lg">{p}</p>)}
      </div>
    </article>
  )
}