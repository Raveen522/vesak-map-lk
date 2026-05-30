'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tileProvider } from '@/lib/map/tileProvider';

const customSelectIcon = L.divIcon({
  html: `
    <div class="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 ring-4 ring-amber-500 bg-slate-950 text-amber-400 shadow-xl scale-110">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
    </div>
  `,
  className: 'coordinate-select-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

interface AddLocationMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export default function AddLocationMap({ latitude, longitude, onChange }: AddLocationMapProps) {
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
      icon: customSelectIcon,
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

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
