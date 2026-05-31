'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tileProvider } from '@/lib/map/tileProvider';

function getSelectionIcon(category: 'thorana' | 'lantern' | 'dansal' | 'zone') {
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

  const html = `
    <div class="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 ring-4 ring-amber-500 bg-slate-950 shadow-xl scale-110" style="color: ${color};">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${svgContent}
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'coordinate-select-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
}

interface AddLocationMapProps {
  latitude: number;
  longitude: number;
  category: 'thorana' | 'lantern' | 'dansal' | 'zone';
  onChange: (lat: number, lng: number) => void;
}

export default function AddLocationMap({ latitude, longitude, category, onChange }: AddLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([latitude, longitude], 14);

    L.tileLayer(tileProvider.url, {
      attribution: tileProvider.attribution,
    }).addTo(map);

    const marker = L.marker([latitude, longitude], {
      icon: getSelectionIcon(category),
      draggable: true,
    }).addTo(map);

    // Coordinate update on drag
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange(pos.lat, pos.lng);
    });

    // Update marker and drag on click
    map.on('click', (e: L.LeafletMouseEvent) => {
      const pos = e.latlng;
      marker.setLatLng(pos);
      onChange(pos.lat, pos.lng);
    });

    markerRef.current = marker;
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync coords from parent form (e.g. Current location button)
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
        const newPos = L.latLng(latitude, longitude);
        markerRef.current.setLatLng(newPos);
        mapRef.current.setView(newPos, 14, { animate: true });
      }
    }
  }, [latitude, longitude]);

  // Sync category icon when selected category changes in form
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(getSelectionIcon(category));
    }
  }, [category]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
