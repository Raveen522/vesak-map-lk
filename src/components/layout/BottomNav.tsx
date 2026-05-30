'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, PlusCircle, User, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Map',
      href: '/map',
      icon: Map,
    },
    {
      label: 'Add Location',
      href: '/add',
      icon: PlusCircle,
    },
    {
      label: 'My Pins',
      href: '/profile',
      icon: User,
    },
    {
      label: 'About',
      href: '/about',
      icon: Info,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[2000] block border-t border-slate-800 bg-slate-950/85 py-2 backdrop-blur-lg sm:py-3 md:shadow-lg">
      <div className="mx-auto flex max-w-md justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive 
                  ? 'text-amber-400 scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                isActive ? 'bg-amber-500/10' : 'bg-transparent'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
