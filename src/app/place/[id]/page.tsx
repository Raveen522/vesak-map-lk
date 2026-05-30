import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';
import { mockDb } from '@/lib/places/mockDb';
import { MapPin, Calendar, Clock, Navigation, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = await params;
  let place: any = null;

  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('places')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      place = data;
    } else {
      place = await mockDb.getPlaceById(id);
    }
  } catch (err) {
    console.error('Error fetching place:', err);
  }

  if (!place || place.trust_status === 'hidden_by_community') {
    notFound();
  }

  const getCategoryLabel = (cat: string) => {
    if (cat === 'thorana') return 'Vesak Thorana / වෙසක් තොරණ';
    if (cat === 'lantern') return 'Vesak Lantern / වෙසක් කූඩුව';
    return 'Dansala / දන්සල';
  };

  const getCategoryColor = (cat: string) => {
    if (cat === 'thorana') return 'text-orange-655 dark:text-orange-400 border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-950/20';
    if (cat === 'lantern') return 'text-purple-650 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-950/20';
    return 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20';
  };

  const getTrustBadgeStyle = (status: string) => {
    switch (status) {
      case 'highly_confirmed':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-250 dark:border-amber-500/20';
      case 'community_confirmed':
        return 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-250 dark:border-yellow-500/20';
      case 'disputed':
        return 'bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 border-red-200 dark:border-red-500/20';
      case 'likely_wrong':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-205 dark:border-slate-700';
      default:
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 text-slate-850 dark:text-slate-200">
      <Link
        href="/map"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Map / සිතියමට යන්න</span>
      </Link>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-xl space-y-6">
        <div>
          <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(place.category)}`}>
            {getCategoryLabel(place.category)}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">{place.title}</h1>
          {place.area_name && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>{place.area_name}</span>
            </p>
          )}
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-between border-t border-b border-slate-200 dark:border-slate-900 py-4">
          <div className="text-xs">
            <span className="block font-semibold text-slate-700 dark:text-slate-350">
              {place.strong_confirm_count} strong confirmations
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Updated in real-time by community.
            </span>
          </div>
          <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${getTrustBadgeStyle(place.trust_status)}`}>
            {place.trust_status.replace('_', ' ')}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-4">
          {place.description && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">
                Description / විස්තරය
              </span>
              <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-300">{place.description}</p>
            </div>
          )}

          {place.address_text && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">
                Address / ලිපිනය
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{place.address_text}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            {(place.start_date || place.end_date) && (
              <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 p-3 border border-slate-200 dark:border-slate-900">
                <Calendar className="mt-0.5 h-4 w-4 text-amber-505 dark:text-amber-500" />
                <div>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Dates</span>
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                    {place.start_date || 'N/A'} to {place.end_date || 'N/A'}
                  </span>
                </div>
              </div>
            )}
            {place.time_text && (
              <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 p-3 border border-slate-200 dark:border-slate-900">
                <Clock className="mt-0.5 h-4 w-4 text-amber-505 dark:text-amber-500" />
                <div>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Time</span>
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">{place.time_text}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to actions */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/10 hover:scale-102 cursor-pointer"
          >
            <Navigation className="h-4 w-4" />
            <span>Navigate on Google Maps</span>
          </a>
          <Link
            href={`/map?place=${place.id}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span>View on Vesak Map LK</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
