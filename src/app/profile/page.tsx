import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';
import { mockDb } from '@/lib/places/mockDb';
import { Sparkles, MapPin, Calendar, Landmark, Home, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/profile');
  }

  // Fetch places pinned by this user
  let userPlaces: any[] = [];
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('places')
        .select('*')
        .eq('added_by', session.id)
        .order('created_at', { ascending: false });
      userPlaces = data || [];
    } else {
      const mockPlaces = await mockDb.getPlaces();
      userPlaces = mockPlaces.filter((p) => p.added_by === session.id);
    }
  } catch (err) {
    console.error('Error fetching user pins:', err);
  }

  const getCategoryIcon = (cat: string) => {
    if (cat === 'thorana') return <Landmark className="h-4 w-4 text-orange-605 dark:text-orange-400" />;
    if (cat === 'lantern') return <Sparkles className="h-4 w-4 text-purple-650 dark:text-purple-400" />;
    return <Home className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'thorana') return 'Thorana';
    if (cat === 'lantern') return 'Lanterns';
    return 'Dansala';
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8 text-slate-800 dark:text-slate-200">
      {/* Profile summary card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
            Community Member Profile
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{session.displayName}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-550 mt-0.5">Thank you for contributing to Vesak Map LK!</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-900 text-center shrink-0 w-full sm:w-auto">
          <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Pins Contributed</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{userPlaces.length}</span>
        </div>
      </div>

      {/* User's pins list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-amber-500" />
          <span>My Pinned Locations / මා එක් කළ ස්ථාන</span>
        </h2>

        {userPlaces.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-250 dark:border-slate-800 p-8 text-center bg-slate-50 dark:bg-slate-950/20">
            <MapPin className="mx-auto h-8 w-8 text-slate-405 dark:text-slate-700" />
            <h3 className="mt-2 font-bold text-sm text-slate-700 dark:text-slate-350">No locations added yet</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              You haven&apos;t added any Vesak locations. If you know a Thorana, lantern display, or Dansala, pin it now!
            </p>
            <Link
              href="/add"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-transform hover:scale-102 cursor-pointer"
            >
              <span>Pin first location</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPlaces.map((place) => (
              <div
                key={place.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-5 backdrop-blur-sm shadow-sm dark:shadow-md hover:border-slate-300 dark:hover:border-slate-800 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase">
                      {getCategoryIcon(place.category)}
                      <span>{getCategoryLabel(place.category)}</span>
                    </span>
                    <span className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-400">
                      {place.trust_status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="mt-2 font-bold text-slate-900 dark:text-white text-sm">{place.title}</h3>
                  <p className="mt-1 text-xs text-slate-550 dark:text-slate-450 line-clamp-2">{place.description}</p>
                  {place.area_name && (
                    <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3 w-3" />
                      <span>{place.area_name}</span>
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-900/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Added {new Date(place.created_at).toLocaleDateString()}</span>
                  </span>
                  <div className="flex gap-2">
                    <span className="text-green-600 dark:text-green-500 font-bold">{place.strong_confirm_count} ✓</span>
                    <span className="text-red-600 dark:text-red-500 font-bold">{place.report_count} ✗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
