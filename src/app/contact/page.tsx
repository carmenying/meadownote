import { Mail, MessageCircle, Github, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">联系 · Contact</h1>
        <p className="text-stone-500 mt-2">想说什么都可以，慢慢说。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="mailto:hello@meadownote.bot.cd" className="card block hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#d97757]/10 flex items-center justify-center mb-3">
            <Mail size={20} className="text-[#d97757]" />
          </div>
          <h3 className="font-semibold">Email</h3>
          <p className="text-sm text-stone-500 mt-1">hello@meadownote.bot.cd</p>
          <p className="text-xs text-stone-400 mt-3">最稳定，回信慢但一定回。</p>
        </a>

        <div className="card">
          <div className="w-10 h-10 rounded-xl bg-[#d97757]/10 flex items-center justify-center mb-3">
            <MessageCircle size={20} className="text-[#d97757]" />
          </div>
          <h3 className="font-semibold">微信</h3>
          <p className="text-sm text-stone-500 mt-1">可添加：meadownote</p>
          <p className="text-xs text-stone-400 mt-3">验证请备注"播客"。</p>
        </div>

        <a href="https://t.me/meadownote" className="card block hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#d97757]/10 flex items-center justify-center mb-3">
            <Send size={20} className="text-[#d97757]" />
          </div>
          <h3 className="font-semibold">Telegram</h3>
          <p className="text-sm text-stone-500 mt-1">@meadownote</p>
          <p className="text-xs text-stone-400 mt-3">需要梯子。</p>
        </a>

        <a href="https://github.com/carmenying" className="card block hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#d97757]/10 flex items-center justify-center mb-3">
            <Github size={20} className="text-[#d97757]" />
          </div>
          <h3 className="font-semibold">GitHub</h3>
          <p className="text-sm text-stone-500 mt-1">github.com/carmenying</p>
          <p className="text-xs text-stone-400 mt-3">偶尔会在这里写一些代码。</p>
        </a>
      </div>

      <div className="card mt-4">
        <p className="text-stone-500 text-sm leading-relaxed">
          这一页很安静，但不会冷淡——你写来的每一句话，都会被小心收下。
        </p>
      </div>
    </>
  )
}