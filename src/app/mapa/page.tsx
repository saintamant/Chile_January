"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PLACES, Place } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, Navigation, Clock, Phone, List } from "lucide-react";

const MapClient = dynamic(
  () => import("@/components/MapClient").then((mod) => mod.MapClient),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    ),
  }
);

export default function MapaPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showList, setShowList] = useState(false);

  const openInMaps = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] relative">
      {/* Map */}
      <MapClient
        selectedPlace={selectedPlace}
        onSelectPlace={setSelectedPlace}
      />

      {/* Toggle List Button */}
      <Button
        onClick={() => setShowList(true)}
        className="absolute top-4 right-4 z-10 shadow-lg"
        variant="secondary"
      >
        <List className="w-4 h-4 mr-2" />
        Ver lista
      </Button>

      {/* Places List Sheet */}
      <Sheet open={showList} onOpenChange={setShowList}>
        <SheetContent side="bottom" className="h-[80vh] overflow-auto">
          <SheetHeader>
            <SheetTitle>Lugares</SheetTitle>
          </SheetHeader>

          <div className="space-y-3 mt-4">
            {PLACES.map((place) => (
              <Card key={place.nombre} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-2xl p-2 rounded-full"
                      style={{ backgroundColor: place.color + "30" }}
                    >
                      {place.emoji}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{place.nombre}</h3>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        {place.direccion}
                      </p>

                      {place.horario && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{place.horario}</span>
                        </div>
                      )}

                      {place.tiempo_uber_min && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ~{place.tiempo_uber_min} min desde depto •{" "}
                          {place.distancia_km} km
                        </p>
                      )}

                      {place.telefono && (
                        <a
                          href={`tel:${place.telefono}`}
                          className="flex items-center gap-1 mt-2 text-sm text-blue-400"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{place.telefono}</span>
                        </a>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => {
                            setSelectedPlace(place);
                            setShowList(false);
                          }}
                        >
                          Ver en mapa
                        </Button>
                        <Button className="flex-1" onClick={() => openInMaps(place)}>
                          <Navigation className="w-4 h-4 mr-1" />
                          Ir
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Selected Place Card */}
      {selectedPlace && !showList && (
        <Card className="absolute bottom-4 left-4 right-4 z-10">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setSelectedPlace(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-start gap-3">
              <span className="text-2xl">{selectedPlace.emoji}</span>
              <div className="flex-1 pr-6">
                <h3 className="font-semibold">{selectedPlace.nombre}</h3>
                <p className="text-muted-foreground text-sm">
                  {selectedPlace.direccion}
                </p>
                {selectedPlace.horario && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {selectedPlace.horario}
                  </p>
                )}
              </div>
            </div>

            <Button
              className="mt-3 w-full"
              onClick={() => openInMaps(selectedPlace)}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Cómo llegar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
