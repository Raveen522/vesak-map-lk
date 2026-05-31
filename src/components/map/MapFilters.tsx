'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { ThoranIcon, LanternIcon, ZoneIcon, DansalIcon } from '@/components/icons/CustomIcons';

export type CategoryFilter = 'all' | 'thorana' | 'lantern' | 'dansal' | 'zone';

interface MapFiltersProps {
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
}

export default function MapFilters({ activeFilter, onFilterChange }: MapFiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Show right arrow if content width is larger than viewable container and we haven't scrolled to the end
      setShowRightArrow(scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth - 8);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      // Wait a moment for layout to settle, then recheck scroll availability
      const timer = setTimeout(checkScroll, 100);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
      };
    }
  }, [activeFilter]); // Recheck when filter changes or activeFilter updates layout

  const filters = [
    {
      id: 'all' as CategoryFilter,
      label: 'All / සියල්ල',
      icon: Sparkles,
      activeClass: 'bg-amber-500 text-slate-950 font-bold border-amber-400',
      inactiveClass: 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80',
    },
    {
      id: 'thorana' as CategoryFilter,
      label: 'Thoran / තොරණ',
      icon: ThoranIcon,
      activeClass: 'bg-orange-500 text-slate-950 font-bold border-orange-400',
      inactiveClass: 'bg-slate-900/80 text-orange-400/90 border-orange-950/30 hover:bg-orange-950/20',
    },
    {
      id: 'lantern' as CategoryFilter,
      label: 'Lanterns / කූඩු',
      icon: LanternIcon,
      activeClass: 'bg-purple-500 text-slate-950 font-bold border-purple-400',
      inactiveClass: 'bg-slate-900/80 text-purple-400/90 border-purple-950/30 hover:bg-purple-950/20',
    },
    {
      id: 'zone' as CategoryFilter,
      label: 'Zones / කලාප',
      icon: ZoneIcon,
      activeClass: 'bg-blue-500 text-slate-950 font-bold border-blue-400',
      inactiveClass: 'bg-slate-900/80 text-blue-400/90 border-blue-950/30 hover:bg-blue-950/20',
    },
    {
      id: 'dansal' as CategoryFilter,
      label: 'Dansal / දන්සල්',
      icon: DansalIcon,
      activeClass: 'bg-emerald-500 text-slate-950 font-bold border-emerald-400',
      inactiveClass: 'bg-slate-900/80 text-emerald-400/90 border-emerald-950/30 hover:bg-emerald-950/20',
    },
  ];

  return (
    <div className="relative w-full flex items-center">
      <div 
        ref={scrollRef}
        className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-2 px-1"
      >
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold shadow-md transition-all active:scale-95 ${
                isActive ? filter.activeClass : filter.inactiveClass
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {showRightArrow && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-2 flex items-center justify-end w-12 bg-gradient-to-l from-white/95 dark:from-slate-950/95 via-white/80 dark:via-slate-950/80 to-transparent pr-1.5">
          <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300 stroke-[2.5]" />
        </div>
      )}
    </div>
  );
}
