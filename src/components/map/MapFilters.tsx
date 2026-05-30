'use client';

import React from 'react';
import { Sparkles, Home, Landmark } from 'lucide-react';

export type CategoryFilter = 'all' | 'thorana' | 'lantern' | 'dansal';

interface MapFiltersProps {
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
}

export default function MapFilters({ activeFilter, onFilterChange }: MapFiltersProps) {
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
      icon: Landmark,
      activeClass: 'bg-orange-500 text-slate-950 font-bold border-orange-400',
      inactiveClass: 'bg-slate-900/80 text-orange-400/90 border-orange-950/30 hover:bg-orange-950/20',
    },
    {
      id: 'lantern' as CategoryFilter,
      label: 'Lanterns / කූඩු',
      icon: Sparkles,
      activeClass: 'bg-purple-500 text-slate-950 font-bold border-purple-400',
      inactiveClass: 'bg-slate-900/80 text-purple-400/90 border-purple-950/30 hover:bg-purple-950/20',
    },
    {
      id: 'dansal' as CategoryFilter,
      label: 'Dansal / දන්සල්',
      icon: Home,
      activeClass: 'bg-emerald-500 text-slate-950 font-bold border-emerald-400',
      inactiveClass: 'bg-slate-900/80 text-emerald-400/90 border-emerald-950/30 hover:bg-emerald-950/20',
    },
  ];

  return (
    <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-2 px-1">
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
  );
}
