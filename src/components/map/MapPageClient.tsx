'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapFilters, { CategoryFilter } from './MapFilters';
import PlaceDetail from '@/components/places/PlaceDetail';
import { UserSession } from '@/lib/auth/session';
import { confirmPlaceAction, reportPlaceAction, getPlacesAction, deletePlaceAction } from '@/app/actions';
import { Sparkles, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Dynamic import Leaflet map component to prevent SSR errors
const VesakMap = dynamic(() => import('@/components/map/VesakMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <span className="text-sm font-semibold">Loading Map...</span>
      </div>
    </div>
  ),
});

interface MapPageClientProps {
  initialPlaces: any[];
  session: UserSession | null;
}

export default function MapPageClient({ initialPlaces, session }: MapPageClientProps) {
  const [places, setPlaces] = useState<any[]>(initialPlaces);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const searchParams = useSearchParams();
  const placeIdParam = searchParams.get('place');

  // Sync selected place from search parameter (shareable URL)
  useEffect(() => {
    if (placeIdParam && places.length > 0) {
      const matched = places.find((p) => p.id === placeIdParam);
      if (matched) {
        setSelectedPlace(matched);
      }
    }
  }, [placeIdParam, places]);

  // Fetch user location client-side to calculate distances
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Geolocation permission denied/unavailable.");
        }
      );
    }
  }, []);

  // Refresh places function
  const refreshPlaces = async () => {
    const res = await getPlacesAction();
    if (res.success && res.data) {
      setPlaces(res.data);
      // Update selected place if it was open
      if (selectedPlace) {
        const updated = res.data.find((p) => p.id === selectedPlace.id);
        if (updated) {
          setSelectedPlace(updated);
        }
      }
    }
  };

  const handleConfirm = async (placeId: string, type: string) => {
    let lat: number | undefined;
    let lng: number | undefined;
    
    if (userLocation) {
      lat = userLocation[0];
      lng = userLocation[1];
    }

    const res = await confirmPlaceAction(placeId, type as any, lat, lng);
    if (res.success) {
      await refreshPlaces();
      return { success: true };
    } else {
      alert(res.error || 'Failed to submit confirmation.');
      return { success: false, error: res.error };
    }
  };

  const handleReport = async (placeId: string, reason: string, note: string) => {
    const res = await reportPlaceAction(placeId, reason as any, note);
    if (res.success) {
      await refreshPlaces();
      return { success: true };
    } else {
      alert(res.error || 'Failed to submit report.');
      return { success: false, error: res.error };
    }
  };

  const handleDelete = async (placeId: string) => {
    const res = await deletePlaceAction(placeId);
    if (res.success) {
      setSelectedPlace(null);
      await refreshPlaces();
      return { success: true };
    } else {
      alert(res.error || 'Failed to delete pin.');
      return { success: false, error: res.error };
    }
  };

  // Filter places based on active chip
  const filteredPlaces = places.filter((place) => {
    if (activeFilter === 'all') return true;
    return place.category === activeFilter;
  });

  return (
    <div className="relative flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem-3.5rem)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shrink-0 z-10">
        <div className="mb-4">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <span>Discover Locations</span>
          </h1>
          <p className="text-xs text-slate-650 dark:text-slate-400 mt-1">
            Browse Vesak zones, lantern displays, and free food (dansal) pinned by the community.
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-4">
          <MapFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Selected place details panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedPlace ? (
            <div className="h-full border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-100/50 dark:bg-slate-905/10">
              <PlaceDetail
                place={selectedPlace}
                userLocation={userLocation}
                session={session}
                onClose={() => setSelectedPlace(null)}
                onConfirm={handleConfirm}
                onReport={handleReport}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl bg-slate-100/30 dark:bg-slate-950/20">
              <MapPin className="h-10 w-10 text-slate-400 dark:text-slate-700 animate-bounce" />
              <h3 className="mt-3 font-bold text-sm text-slate-700 dark:text-slate-350">Select a Location</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-[200px]">
                Click on any map marker or list item to view details, navigate, or confirm its existence.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Map Area (Fullscreen on mobile, sidebar layout on desktop) */}
      <div className="flex-grow w-full relative h-full min-h-[300px] md:h-full">
        {/* Render Map First in DOM Stack */}
        <VesakMap 
          places={filteredPlaces} 
          selectedPlace={selectedPlace} 
          onPlaceSelect={setSelectedPlace} 
        />

        {/* Floating Filters on Mobile (Rendered after map, z-1000) */}
        <div className="absolute top-4 left-4 right-4 z-[1000] md:hidden bg-white/90 dark:bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <MapFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Mobile Slide-up Bottom Sheet (Rendered after map, z-1000) */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] md:hidden h-[65vh] max-h-[75vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden animate-slide-up">
            <PlaceDetail
              place={selectedPlace}
              userLocation={userLocation}
              session={session}
              onClose={() => setSelectedPlace(null)}
              onConfirm={handleConfirm}
              onReport={handleReport}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
