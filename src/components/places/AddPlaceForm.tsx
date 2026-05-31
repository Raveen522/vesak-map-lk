'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import dynamicComponent from 'next/dynamic';
import { MapPin, Compass, ShieldAlert, Check, Maximize2, X } from 'lucide-react';
import { addPlaceAction } from '@/app/actions';
import { defaultMapConfig } from '@/lib/map/tileProvider';

// Dynamic import of Leaflet dependencies
const AddLocationMap = dynamicComponent(
  () => import('./AddLocationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <span className="text-xs">Loading Selection Map...</span>
        </div>
      </div>
    ),
  }
);

export default function AddPlaceForm() {
  const [category, setCategory] = useState<'thorana' | 'lantern' | 'dansal' | 'zone'>('lantern');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [areaName, setAreaName] = useState('');
  const [addressText, setAddressText] = useState('');
  const [latitude, setLatitude] = useState(defaultMapConfig.center[0]);
  const [longitude, setLongitude] = useState(defaultMapConfig.center[1]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeText, setTimeText] = useState('');
  const [rawTime, setRawTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatTime12Hour = (time24: string): string => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    const hours = parseInt(hoursStr, 10);
    const displayHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${displayHours}:${minutesStr} ${ampm}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawTime(val);
    setTimeText(formatTime12Hour(val));
  };
  
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Try to set current location as default coordinate on load
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => console.log("Failed to acquire user coordinate automatically.")
      );
    }
  }, []);

  const handleUseCurrentLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          alert('Could not retrieve your GPS location. Please select it manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await addPlaceAction({
        category,
        title,
        description,
        areaName,
        addressText,
        latitude,
        longitude,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        timeText: timeText || undefined,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/map');
          router.refresh();
        }, 1500);
      } else {
        setError(res.error || 'Something went wrong.');
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 scale-110 animate-bounce">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Location Pinned Successfully!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          ස්ථානය සාර්ථකව එක් කරන ලදී!
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-6 animate-pulse">
          Redirecting you to the map...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 text-slate-800 dark:text-slate-200">
      <div className="mb-4">
        <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <MapPin className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />
          <span>Pin Vesak Location / ස්ථානයක් එක් කරන්න</span>
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">
          Add a Vesak lantern display, Thorana, or Dansala to the map for the community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Map Selector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 p-3 shadow-sm dark:shadow-none">
            <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase mb-2 flex justify-between items-center">
              <span>Select Location on Map</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="flex items-center gap-1 text-[9px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                >
                  <Compass className="h-2.5 w-2.5" />
                  <span>Use GPS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMapExpanded(true)}
                  className="flex items-center gap-1 text-[9px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="h-2.5 w-2.5" />
                  <span>Expand Map</span>
                </button>
              </div>
            </h3>
            
            <div className="h-[200px] lg:h-[300px] rounded-xl overflow-hidden shadow-inner relative border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <AddLocationMap
                latitude={latitude}
                longitude={longitude}
                category={category}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-900">
                <span className="block font-semibold">Latitude</span>
                <span className="text-slate-800 dark:text-white font-mono text-[9px]">{latitude.toFixed(6)}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-900">
                <span className="block font-semibold">Longitude</span>
                <span className="text-slate-800 dark:text-white font-mono text-[9px]">{longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

      {/* Fullscreen Map Overlay */}
      {isMapExpanded && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 justify-center items-center">
          <div className="relative w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-2xl p-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800 mb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Drag the Marker / ස්ථානය තෝරන්න
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Zoom in and drag the yellow marker to position it accurately on the map.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapExpanded(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Expanded Map */}
            <div className="flex-grow w-full rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-950">
              <AddLocationMap
                latitude={latitude}
                longitude={longitude}
                category={category}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-150 dark:border-slate-800 mt-3 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
              <div className="flex gap-2 text-[10px] text-slate-500 dark:text-slate-400 w-full sm:w-auto">
                <div className="bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 flex-1 sm:flex-none">
                  <span className="font-semibold text-slate-450 dark:text-slate-500">Lat:</span> <span className="font-mono text-slate-850 dark:text-slate-200">{latitude.toFixed(6)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 flex-1 sm:flex-none">
                  <span className="font-semibold text-slate-450 dark:text-slate-500">Lng:</span> <span className="font-mono text-slate-850 dark:text-slate-200">{longitude.toFixed(6)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMapExpanded(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Confirm Location / ස්ථානය තහවුරු කරන්න</span>
              </button>
            </div>
            
          </div>
        </div>
      )}

        {/* Right Side: Form Fields */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/20 p-4 text-xs font-bold text-red-650 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 space-y-4 backdrop-blur-sm shadow-sm dark:shadow-xl">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Category / වර්ගය
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['lantern', 'thorana', 'zone', 'dansal'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition-all cursor-pointer ${
                      category === cat
                        ? cat === 'thorana'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400'
                          : cat === 'lantern'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400'
                          : cat === 'zone'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                          : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span>
                      {cat === 'thorana'
                        ? 'Thoran'
                        : cat === 'lantern'
                        ? 'Lanterns'
                        : cat === 'zone'
                        ? 'Vesak Zone'
                        : 'Dansala'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Title / නම (e.g. Mahawatta Thorana)
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name of the Thorana, Lantern cluster or food stall..."
                className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label htmlFor="desc" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Description / විස්තරය (Optional)
              </label>
              <textarea
                id="desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details, Jathaka story info, foods items being offered, directions..."
                className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Area and Address Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="area" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  City / Town / නගරය (e.g. Maharagama)
                </label>
                <input
                  id="area"
                  type="text"
                  required
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Town or area name..."
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="address" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Specific landmark / පිහිටීම (Optional)
                </label>
                <input
                  id="address"
                  type="text"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="Near temple / opposite supermarket..."
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dates & Times */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-900 pt-4">
              <div className="space-y-1.5">
                <label htmlFor="start" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Start Date / ආරම්භය
                </label>
                <input
                  id="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="end" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  End Date / අවසානය
                </label>
                <input
                  id="end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="time" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Time info / වේලාව
                </label>
                <input
                  id="time"
                  type="time"
                  value={rawTime}
                  onChange={handleTimeChange}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Notice banner */}
            <div className="rounded-xl border border-amber-100 dark:border-slate-900 bg-amber-50 dark:bg-slate-950/40 p-3 text-[10px] text-slate-600 dark:text-slate-450 flex gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
              <span>
                Community Guidelines: Please add only real Vesak-related locations. False or spam additions will be flagged and hidden by community members.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-slate-950 hover:scale-102 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 cursor-pointer"
            >
              <span>{isPending ? 'Saving Location...' : 'Pin on Map / සිතියමට එක් කරන්න'}</span>
              {!isPending && <Check className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
