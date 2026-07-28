import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'

const posts: Record<string, { title: string; date: string; tags: string[]; body: string[] }> = {
  'first-post': {
    title: '开张笔记：一个清晨',
    date: '2026.07.28',
    tags: ['日常', '开场'],
    body: [
      '这就是第一篇博客。',
      '我先留一盏灯在这里，等你推门进来。',
      '慢慢来。这里会写字、会放声音、会安静。——也会等。',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const p = posts[params.slug]
  if (!p) notFound()

  return (
    <article>
      <Link href="/blog" className="text-sm text-stone-400 flex items-center gap-1 mb-6"><ArrowLeft size={14} /> 返回博客列表</Link>

      <div className="flex items-center gap-2 text-sm text-stone-400 mb-2">
        <Calendar size={14} /> {p.date}
      </div>
      <h1 className="text-3xl font-bold mb-3">{p.title}</h1>
      <div className="mb-6">
        {p.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
      </div>

      <div className="prose prose-stone max-w-none">
        {p.body.map((para, i) => <p key={i} className="text-stone-700 leading-relaxed mb-4 text-lg">{para}</p>)}
      </div>
    </article>
  )
}