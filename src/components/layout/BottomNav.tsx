'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, PlusCircle, User, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[2000] border-t border-slate-900 bg-slate-950/95 py-2.5 backdrop-blur-lg shadow-2xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-4">
        
        {/* 1. Map Button (Primary Highlight) */}
        <Link
          href="/map"
          className={`flex flex-col items-center gap-1 group transition-all ${
            pathname === '/map' ? 'scale-105' : 'hover:scale-102'
          }`}
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
            pathname === '/map'
              ? 'bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/35 scale-110'
              : 'bg-slate-900 border border-slate-800/80 text-amber-550 hover:bg-slate-800'
          }`}>
            <Map className="h-5.5 w-5.5 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] font-extrabold tracking-wide ${
            pathname === '/map' ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
          }`}>
            Explore Map
          </span>
        </Link>

        {/* 2. Add Location Button (Secondary Highlight) */}
        <Link
          href="/add"
          className={`flex flex-col items-center gap-1 group transition-all ${
            pathname === '/add' ? 'scale-105' : 'hover:scale-102'
          }`}
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
            pathname === '/add'
              ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400 scale-110 shadow-md shadow-amber-500/10'
              : 'bg-slate-900/60 border border-slate-850 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}>
            <PlusCircle className="h-5.5 w-5.5 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] font-extrabold tracking-wide ${
            pathname === '/add' ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
          }`}>
            Add Location
          </span>
        </Link>

        {/* 3. My Pins Button (Standard User profile) */}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 group transition-all ${
            pathname === '/profile' ? 'scale-105' : 'hover:scale-102'
          }`}
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
            pathname === '/profile'
              ? 'bg-slate-900 border border-slate-850 text-white shadow-md'
              : 'bg-transparent text-slate-400 group-hover:text-slate-200'
          }`}>
            <User className="h-5 w-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-wide ${
            pathname === '/profile' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
          }`}>
            My Pins
          </span>
        </Link>

        {/* 4. About Button (Standard Info) */}
        <Link
          href="/about"
          className={`flex flex-col items-center gap-1 group transition-all ${
            pathname === '/about' ? 'scale-105' : 'hover:scale-102'
          }`}
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
            pathname === '/about'
              ? 'bg-slate-900 border border-slate-850 text-white shadow-md'
              : 'bg-transparent text-slate-400 group-hover:text-slate-200'
          }`}>
            <Info className="h-5 w-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-wide ${
            pathname === '/about' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
          }`}>
            About
          </span>
        </Link>

      </div>
    </nav>
  );
}
