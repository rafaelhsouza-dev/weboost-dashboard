import React, { useEffect, useRef } from 'react';

interface MapPickerProps {
  lat: number;
  lng: number;
  radius: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, radius, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === 'undefined' || !(window as any).L) return;

    const L = (window as any).L;

    // Initialize Map only once
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);

      // Add click handler
      leafletMap.current.on('click', (e: any) => {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });
    }

    // Update marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(leafletMap.current);
    }

    // Update radius circle
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
      circleRef.current.setRadius(radius * 1000); // Radius in meters
    } else {
      circleRef.current = L.circle([lat, lng], {
        color: '#1f3ab9',
        fillColor: '#1f3ab9',
        fillOpacity: 0.2,
        radius: radius * 1000
      }).addTo(leafletMap.current);
    }

    // Center view
    leafletMap.current.setView([lat, lng]);

  }, [lat, lng, radius, onLocationChange]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 z-0">
       <div ref={mapRef} className="absolute inset-0 z-0" />
    </div>
  );
};