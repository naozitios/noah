import { type ReactNode } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/admin/media', label: 'Media' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/media" className="font-bold text-base">
              Noah Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-sm bg-secondary font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            View Site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
