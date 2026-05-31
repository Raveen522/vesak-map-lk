import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, ShieldAlert, Heart, Plus } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { ThoranIcon, LanternIcon, ZoneIcon, DansalIcon } from '@/components/icons/CustomIcons';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="relative flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Hero Header Section */}
      <div className="relative w-full border-b border-slate-100 dark:border-slate-900/40 overflow-hidden">
        {/* Background radial lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-amber-500/10 dark:bg-amber-500/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 h-[200px] w-[200px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[80px] pointer-events-none"></div>

        {/* Hero Background image artwork overlay with fading gradient mask */}
        <div className="absolute inset-0 z-0 opacity-15 dark:opacity-25 pointer-events-none select-none">
          <img 
            src="/vesak_night_bg.png" 
            alt="Vesak night background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient mask to blend background cleanly with solid page color */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50 dark:via-slate-950/30 dark:to-slate-950"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          {/* Project Tag */}
          <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Sri Lankan Community Project / වෙසක් සිතියම</span>
          </div>

          {/* Hero title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl font-sans leading-[1.15]">
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 text-sm font-extrabold text-slate-800 dark:text-slate-200 shadow-md dark:shadow-none transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Pin a Location / ස්ථානයක් එක් කරන්න</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Page Content Body */}
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16 text-center">
        {/* Categories Highlights Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-650 dark:text-orange-400">
              <ThoranIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base">Thoran / වෙසක් තොරණ</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Find towering colorful pandols displaying Jathaka stories, glowing with thousands of light animations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400">
              <ZoneIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base">Zones / වෙසක් කලාප</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore major streets, decorations, and carnival-like Buddhist celebration zones designated in towns.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400">
              <LanternIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base">Lanterns / වෙසක් කූඩු</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover beautiful local Vesak lantern zones, hanging structures, and creative lighting events.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400">
              <DansalIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base">Dansal / දන්සල්</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Locate community food and drink stalls (rice, ice cream, drinks, noodles) offered freely by volunteers.
            </p>
          </div>
        </div>

        {/* Community Contribution CTA section */}
        <div className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/5 dark:to-orange-500/5 p-6 backdrop-blur-sm text-center shadow-sm">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Plus className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            Add a New Place / අලුත් ස්ථානයක් එක් කරන්න
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
            Know a Vesak Thoran, Lantern exhibition, or a Dansala not listed on the map? Add it to help others find it!
            <span className="block mt-1 text-[11px] sm:text-xs text-amber-600 dark:text-amber-500/80 font-medium">
              ඔබ දන්නා වෙසක් තොරණක්, කූඩු ප්‍රදර්ශනයක් හෝ දන්සලක් සිතියමට එක් කර අනෙක් අයටත් දැකබලා ගැනීමට උදවු වන්න.
            </span>
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href={session ? '/add' : '/login'}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white dark:text-slate-950 shadow-md transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Share Location / ස්ථානය බෙදාගන්න</span>
            </Link>
          </div>
        </div>

        {/* Disclaimer / notice banner */}
        <div className="mt-8 rounded-xl border border-amber-100 dark:border-slate-900 bg-amber-50/50 dark:bg-slate-900/20 p-4 text-slate-600 dark:text-slate-400 text-xs flex items-start gap-3 text-left">
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
