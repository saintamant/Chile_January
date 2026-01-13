"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PLACES, Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Navigation, Clock, Phone } from "lucide-react";

const createCustomIcon = (emoji: string, color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${color};
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      border: 3px solid rgba(255,255,255,0.9);
    ">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

interface MapClientProps {
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
}

export function MapClient({ selectedPlace, onSelectPlace }: MapClientProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (map && selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 15, {
        duration: 1,
      });
    }
  }, [map, selectedPlace]);

  const center: [number, number] = [-33.42, -70.65];

  const openInMaps = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full"
      ref={setMap}
    >
      {/* Dark mode tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {PLACES.map((place) => (
        <Marker
          key={place.nombre}
          position={[place.lat, place.lng]}
          icon={createCustomIcon(place.emoji, place.color)}
          eventHandlers={{
            click: () => onSelectPlace(place),
          }}
        >
          <Popup className="dark-popup">
            <div className="p-1 min-w-[200px]">
              <h3 className="font-bold text-base text-gray-900">{place.nombre}</h3>
              <p className="text-gray-600 text-sm mt-1">{place.direccion}</p>

              {place.horario && (
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{place.horario}</span>
                </div>
              )}

              {place.tiempo_uber_min && (
                <p className="text-sm text-gray-500 mt-1">
                  ~{place.tiempo_uber_min} min desde depto
                </p>
              )}

              {place.telefono && (
                <a
                  href={`tel:${place.telefono}`}
                  className="flex items-center gap-1 mt-2 text-sm text-blue-600"
                >
                  <Phone className="w-3 h-3" />
                  <span>{place.telefono}</span>
                </a>
              )}

              <button
                onClick={() => openInMaps(place)}
                className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <Navigation className="w-4 h-4" />
                Cómo llegar
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
