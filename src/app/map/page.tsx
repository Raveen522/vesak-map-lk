import React, { Suspense } from 'react';
import { getPlacesAction } from '@/app/actions';
import { getSession } from '@/lib/auth/session';
import MapPageClient from '@/components/map/MapPageClient';

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const session = await getSession();
  const placesRes = await getPlacesAction();
  const initialPlaces = placesRes.success && placesRes.data ? placesRes.data : [];

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            <span className="text-sm font-semibold">Loading Map Page...</span>
          </div>
        </div>
      }
    >
      <MapPageClient initialPlaces={initialPlaces} session={session} />
    </Suspense>
  );
}
