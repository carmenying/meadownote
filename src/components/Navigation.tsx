'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, BookOpen, User, Mail, Home } from 'lucide-react'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/episodes', label: '播客', icon: Mic },
  { href: '/blog', label: '博客', icon: BookOpen },
  { href: '/about', label: '关于', icon: User },
  { href: '/contact', label: '联系', icon: Mail },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f3]/85 backdrop-blur-md border-b border-[#efe9dc]">
      <nav className="layout-container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-bold text-lg gradient-text">Meadow Note</span>
        </Link>
        <ul className="flex items-center gap-5 list-none m-0 p-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link flex items-center gap-1.5 ${active ? 'active' : ''}`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}