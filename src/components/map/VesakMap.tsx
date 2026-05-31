'use client';

import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tileProvider, defaultMapConfig } from '@/lib/map/tileProvider';
import { Compass } from 'lucide-react';

// Custom icons generator
function createPlaceIcon(category: 'thorana' | 'lantern' | 'dansal' | 'zone', trustStatus: string) {
  let color = '#eab308'; // Default gold
  let svgContent = '';
  
  if (category === 'thorana') {
    color = '#f97316'; // Orange
    svgContent = `
      <path d="M3 21h18" />
      <path d="M5 21V11c0-3 3-5 7-5s7 2 7 5v10" />
      <path d="M9 21v-7c0-1.5 1-2.5 3-2.5s3 1 3 2.5v7" />
      <path d="M12 2v4" />
      <path d="M10 6h4" />
      <path d="M12 6L9 9h6z" />
      <path d="M4 11h16" />
      <path d="M4 15h16" />
      <path d="M6 5L8 7" />
      <path d="M18 5l-2 2" />
      <path d="M3 9h2" />
      <path d="M19 9h2" />
      <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="13" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="17" cy="13" r="0.7" fill="currentColor" stroke="none" />
    `;
  } else if (category === 'lantern') {
    color = '#a855f7'; // Purple
    svgContent = `
      <path d="M12 3l6 4v6l-6 4-6-4V7z" />
      <path d="M12 3v14" />
      <path d="M6 7h12" />
      <path d="M6 13h12" />
      <path d="M6 7l6 6 6-6" />
      <path d="M6 13l6-6 6 6" />
      <path d="M12 17v5" />
      <path d="M10 22h4" />
      <path d="M6 13v4" />
      <path d="M5 17h2" />
      <path d="M18 13v4" />
      <path d="M17 17h2" />
      <path d="M6 7l-2 3v3" />
      <path d="M18 7l2 3v3" />
    `;
  } else if (category === 'zone') {
    color = '#3b82f6'; // Blue
    svgContent = `
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M12 4.5V9" />
      <path d="M12 15v4.5" />
      <path d="M4.5 12H9" />
      <path d="M15 12h4.5" />
      <path d="M6.7 6.7l3.18 3.18" />
      <path d="M14.12 14.12l3.18 3.18" />
      <path d="M6.7 17.3l3.18-3.18" />
      <path d="M14.12 9.88l3.18-3.18" />
      <circle cx="12" cy="2.2" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="21.8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="2.2" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="21.8" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="5" cy="5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="19" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="5" cy="19" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="5" r="0.8" fill="currentColor" stroke="none" />
    `;
  } else if (category === 'dansal') {
    color = '#10b981'; // Emerald
    svgContent = `
      <path d="M2 16h5l3-3.5L9.2 11" />
      <path d="M22 16h-5l-3-3.5l0.8-1.5" />
      <path d="M9 10h6l-.8 4.5h-4.4z" />
      <path d="M15 11h1.5c.8 0 .8 1.5 0 1.5H14" />
      <path d="M10.5 7.5c0-1.5.5-1.5.5-3" />
      <path d="M12.5 7.5c0-1.5.5-1.5.5-3" />
      <path d="M14.5 7.5c0-1.5.5-1.5.5-3" />
    `;
  }

  let trustRing = 'border-2 border-slate-900 ring-2 ring-slate-800';
  let badgeHtml = '';
  
  if (trustStatus === 'highly_confirmed') {
    trustRing = 'border-2 border-slate-950 ring-4 ring-amber-400/80';
    badgeHtml = `<div class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-slate-950 shadow-md">★</div>`;
  } else if (trustStatus === 'community_confirmed') {
    trustRing = 'border-2 border-slate-950 ring-2 ring-amber-500';
  } else if (trustStatus === 'disputed') {
    trustRing = 'border-2 border-dashed border-red-500 ring-2 ring-red-500/20';
    badgeHtml = `<div class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white shadow-md">!</div>`;
  } else if (trustStatus === 'likely_wrong') {
    trustRing = 'border border-slate-700 opacity-60 grayscale';
  }

  const html = `
    <div class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 transition-transform active:scale-95 ${trustRing}" style="color: ${color};">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${svgContent}
      </svg>
      ${badgeHtml}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

// User location marker icon
const userIcon = L.divIcon({
  html: `
    <div class="relative flex h-6 w-6 items-center justify-center">
      <div class="absolute h-full w-full animate-ping rounded-full bg-blue-500/40 opacity-75"></div>
      <div class="relative h-3.5 w-3.5 rounded-full border border-white bg-blue-500 shadow-md"></div>
    </div>
  `,
  className: 'user-location-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface VesakMapProps {
  places: any[];
  selectedPlace?: any;
  onPlaceSelect?: (place: any) => void;
}

export default function VesakMap({ places, selectedPlace, onPlaceSelect }: VesakMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const initialCenter = defaultMapConfig.center;
  const initialZoom = defaultMapConfig.zoom;

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create the map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(initialCenter, initialZoom);

    // Add OSM tile layer
    L.tileLayer(tileProvider.url, {
      attribution: tileProvider.attribution,
    }).addTo(map);

    // Create marker layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapRef.current = map;


    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userLocation);
      } else {
        userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current);
      }
    }
  }, [userLocation]);

  // Update Places Markers
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    // Clear existing markers
    markersGroupRef.current.clearLayers();

    // Re-add markers
    places.forEach((place) => {
      const icon = createPlaceIcon(place.category, place.trust_status);
      const marker = L.marker([place.latitude, place.longitude], { icon })
        .addTo(markersGroupRef.current!)
        .on('click', () => {
          if (onPlaceSelect) onPlaceSelect(place);
        });

      const getCategoryLabel = (cat: string) => {
        if (cat === 'thorana') return 'Vesak Thorana / වෙසක් තොරණ';
        if (cat === 'lantern') return 'Vesak Lantern / වෙසක් කූඩුව';
        return 'Dansala / දන්සල';
      };

      const getTrustBadgeStyleColor = (status: string) => {
        switch (status) {
          case 'highly_confirmed': return 'border-amber-500/20 text-amber-400 bg-amber-500/10';
          case 'community_confirmed': return 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10';
          case 'disputed': return 'border-red-500/20 text-red-400 bg-red-500/10';
          case 'likely_wrong': return 'border-slate-700 text-slate-450 bg-slate-800';
          default: return 'border-blue-500/20 text-blue-400 bg-blue-500/10';
        }
      };

      const popupHtml = `
        <div class="p-1 min-w-[200px] text-slate-200">
          <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            ${getCategoryLabel(place.category)}
          </span>
          <h3 class="mt-1 font-bold text-sm text-white">${place.title}</h3>
          <p class="mt-1 text-xs text-slate-400 line-clamp-2">${place.description || ''}</p>
          <div class="mt-2 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px]">
            <span class="rounded border px-1.5 py-0.5 font-semibold ${getTrustBadgeStyleColor(place.trust_status)}">
              ${place.trust_status.replace('_', ' ')}
            </span>
            <span class="font-bold text-amber-405">Click to view details</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-popup' });
    });
  }, [places, onPlaceSelect]);

  // Center Map on Selected Place
  useEffect(() => {
    if (mapRef.current && selectedPlace) {
      mapRef.current.setView([selectedPlace.latitude, selectedPlace.longitude], 15, { animate: true });
    }
  }, [selectedPlace]);

  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(loc);
        if (mapRef.current) {
          mapRef.current.setView(loc, 14, { animate: true });
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn("High accuracy geolocation failed, trying standard accuracy...", error);
        // Fallback: try locating with high accuracy set to false if it timed out or failed
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
            setUserLocation(loc);
            if (mapRef.current) {
              mapRef.current.setView(loc, 14, { animate: true });
            }
            setIsLocating(false);
          },
          (err) => {
            console.error("Standard accuracy geolocation failed:", err);
            alert("Could not get your current location. Please verify your browser location permissions.");
            setIsLocating(false);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-2xl">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Loading indicator toast */}
      {isLocating && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-amber-400 shadow-xl backdrop-blur-md">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span>Acquiring GPS location... / ස්ථානය සොයමින්...</span>
        </div>
      )}

      {/* Floating Geolocation Button */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute bottom-24 right-6 z-[400] flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-amber-400 shadow-xl backdrop-blur-md transition-all hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Find My Location"
      >
        {isLocating ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        ) : (
          <Compass className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
