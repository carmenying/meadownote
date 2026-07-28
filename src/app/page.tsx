import Link from 'next/link'
import { Mic, BookOpen, ArrowRight } from 'lucide-react'

const recentEpisodes = [
  { slug: 'hello-meadow', title: '第一集：和山野间的风打个招呼', date: '2026.07', duration: '23:12', summary: '一个简单的开始。我想和你聊聊为什么要做这个播客，以及未来想和你分享什么。' },
]

const recentPosts = [
  { slug: 'first-post', title: '开张笔记：一个清晨', date: '2026.07.28', excerpt: '这就是第一篇博客。我先留一盏灯在这里，等你推门进来。' },
]

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>嗨，<span className="gradient-text">你好啊</span></h1>
        <p>
          这里是一个小小的角落，<br />
          有播客里的声音、博客里的字句，<br />
          也有一些关于生活、旅行、阅读的闲聊。
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/episodes" className="btn-primary flex items-center gap-2">
            <Mic size={16} /> 听播客
          </Link>
          <Link href="/blog" className="btn-primary" style={{ background: 'white', color: 'var(--fg)', border: '1px solid #efe9dc' }}>
            <span className="flex items-center gap-2"><BookOpen size={16} /> 看博客</span>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mic size={18} className="text-[#d97757]" /> 最新一集
          </h2>
          <div className="space-y-3">
            {recentEpisodes.map((ep) => (
              <Link key={ep.slug} href={`/episodes/${ep.slug}`} className="card block">
                <div className="text-xs text-stone-400">{ep.date} · {ep.duration}</div>
                <h3 className="text-base font-semibold mt-1">{ep.title}</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">{ep.summary}</p>
                <div className="text-sm text-[#d97757] mt-3 flex items-center gap-1">收听 <ArrowRight size={14} /></div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-[#d97757]" /> 最新文章
          </h2>
          <div className="space-y-3">
            {recentPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card block">
                <div className="text-xs text-stone-400">{p.date}</div>
                <h3 className="text-base font-semibold mt-1">{p.title}</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">{p.excerpt}</p>
                <div className="text-sm text-[#d97757] mt-3 flex items-center gap-1">阅读 <ArrowRight size={14} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}