'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, User, LogOut, Sun, Moon } from 'lucide-react';
import { UserSession } from '@/lib/auth/session';

interface AppHeaderProps {
  session: UserSession | null;
  onLogout?: () => void;
}

export default function AppHeader({ session, onLogout }: AppHeaderProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-[2000] w-full border-b border-slate-200 dark:border-amber-500/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-102">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <img src="/logo.svg" alt="Vesak Map LK Logo" className="h-10 w-10 object-contain drop-shadow-md" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Vesak Map <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">LK</span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-amber-600 dark:text-amber-500/80 uppercase">
              වෙසක් සිතියම
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-slate-800 dark:text-amber-400 transition-colors hover:bg-slate-200/80 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-white"
            title="Toggle Theme / තේමාව වෙනස් කරන්න"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white sm:flex"
              >
                <User className="h-3.5 w-3.5 text-amber-505 dark:text-amber-400" />
                <span>{session.displayName}</span>
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 dark:border-red-500/10 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-950/40"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/15 transition-all hover:from-amber-400 hover:to-amber-500 hover:scale-102"
            >
              <User className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
