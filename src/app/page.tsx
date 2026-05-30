import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Home, Landmark, ShieldAlert, Heart } from 'lucide-react';
import { getSession } from '@/lib/auth/session';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="relative flex-1 flex flex-col justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden px-4 sm:px-6">
      {/* Background radial lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-amber-500/10 dark:bg-amber-500/10 blur-[80px]"></div>
      <div className="absolute bottom-1/4 left-1/4 h-[250px] w-[250px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[80px]"></div>

      <div className="relative mx-auto max-w-4xl py-12 text-center sm:py-20">
        {/* Project Tag */}
        <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Sri Lankan Community Project / වෙසක් සිතියම</span>
        </div>

        {/* Hero title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl font-sans leading-[1.15]">
          Discover Vesak displays <br />
          &amp; Dansal in{' '}
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-300 bg-clip-text text-transparent">
            Sri Lanka
          </span>
        </h1>
        <p className="mt-2 text-lg text-amber-600 dark:text-amber-500/70 font-semibold tracking-wider">
          වෙසක් තොරණ, කූඩු සහ දන්සල් සිතියම
        </p>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-650 dark:text-slate-350">
          Vesak Map LK is a free community-moderated map where users pin Vesak zones, lanterns, and dansal. 
          Confirm pins when you visit them to build community trust scores.
        </p>

        {/* Actions buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <Link
            href="/map"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-500 dark:via-orange-400 dark:to-amber-500 bg-[length:200%_auto] hover:bg-right px-8 py-4 text-sm font-extrabold text-white dark:text-slate-950 shadow-xl shadow-amber-500/10 transition-all hover:scale-102"
          >
            <MapPin className="h-4 w-4" />
            <span>Explore Map / සිතියම බලන්න</span>
          </Link>
          <Link
            href={session ? '/add' : '/login'}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 text-sm font-extrabold text-slate-800 dark:text-slate-200 transition-all hover:scale-102"
          >
            <span>Pin a Location / ස්ථානයක් එක් කරන්න &rarr;</span>
          </Link>
        </div>

        {/* Categories Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-650 dark:text-orange-400">
              <Landmark className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Thoran / වෙසක් තොරණ</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Find towering colorful pandols displaying Jathaka stories, glowing with thousands of light animations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Lanterns / වෙසක් කූඩු</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover beautiful local Vesak lantern zones, hanging structures, and creative lighting events.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400">
              <Home className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Dansal / දන්සල්</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Locate community food and drink stalls (rice, ice cream, drinks, noodles) offered freely by volunteers.
            </p>
          </div>
        </div>

        {/* Disclaimer / notice banner */}
        <div className="mt-12 rounded-xl border border-amber-100 dark:border-slate-900 bg-amber-50/50 dark:bg-slate-900/20 p-4 text-slate-600 dark:text-slate-400 text-xs flex items-start gap-3 text-left">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-slate-350">Community Notice:</span> This application runs fully on user contributions. Pins are not checked manually by admins. Please look at the pin&apos;s confirmation counts and trust status before planning a visit.
          </p>
        </div>

        {/* Footer info */}
        <p className="mt-16 flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-600">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by the Sri Lankan community. No advertisements.</span>
        </p>
      </div>
    </div>
  );
}
