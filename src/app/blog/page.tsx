import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'

const posts = [
  { slug: 'first-post', title: '开张笔记：一个清晨', date: '2026.07.28', excerpt: '这就是第一篇博客。我先留一盏灯在这里，等你推门进来。', tags: ['日常', '开场'] },
]

export default function BlogPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">博客 · Blog</h1>
        <p className="text-stone-500 mt-2">写字是另一种声音。</p>
      </header>

      <div className="space-y-4">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card block">
            <div className="text-xs text-stone-400">{p.date}</div>
            <h2 className="text-xl font-semibold mt-1">{p.title}</h2>
            <p className="text-stone-500 mt-2 leading-relaxed">{p.excerpt}</p>
            <div className="mt-3">
              {p.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
            </div>
            <div className="text-sm text-[#d97757] mt-4 flex items-center gap-1">阅读 <ArrowRight size={14} /></div>
          </Link>
        ))}
      </div>
    </>
  )
}