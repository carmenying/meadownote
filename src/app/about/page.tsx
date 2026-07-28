export default function AboutPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">关于 · About</h1>
      </header>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d97757] to-[#a8554a] flex items-center justify-center text-white text-4xl">
            🌿
          </div>
          <div>
            <h2 className="text-xl font-semibold">Meadow Note</h2>
            <p className="text-sm text-stone-500 mt-1">meadownote.bot.cd</p>
          </div>
        </div>

        <div className="space-y-4 text-stone-700 leading-relaxed">
          <p>
            很高兴你来到了这里。这里是一个声音和文字的小小栖息地，
            没有什么规矩，也没有什么主题——只是分享一些生活中的片段。
          </p>
          <p>
            我会在这里放播客、写字、放或许偶尔的视频。
            只要不打扰内心已经长出来的那片草地，都是这片牧场欢迎的内容。
          </p>
          <p>
            如果你也有想分享的声音或文字，欢迎你给我写信——
            在 <a href="/contact" className="text-[#d97757] underline-offset-2 hover:underline">联系页</a> 留下你的问候。
          </p>
        </div>
      </div>
    </>
  )
}