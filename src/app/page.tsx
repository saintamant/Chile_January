"use client";

import { TRIP_INFO, PLACES } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plane,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  AlertTriangle,
  Building,
} from "lucide-react";

export default function Home() {
  const {
    getTotalSpentCLP,
    getTotalSpentUSD,
    getTotalExchangedUSD,
    getAverageRate,
  } = useStore();

  const totalSpentCLP = getTotalSpentCLP();
  const totalSpentUSD = getTotalSpentUSD();
  const exchangedUSD = getTotalExchangedUSD();
  const avgRate = getAverageRate();

  const clpToUSD = avgRate > 0 ? totalSpentCLP / avgRate : 0;
  const totalGastadoUSD = totalSpentUSD + clpToUSD;
  const disponible = TRIP_INFO.presupuesto.disponibleCompras - totalGastadoUSD;
  const percentUsed = (totalGastadoUSD / TRIP_INFO.presupuesto.disponibleCompras) * 100;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
        <CardContent className="p-4 text-white">
          <h1 className="text-xl font-bold">Viaje a Chile 2026</h1>
          <p className="text-blue-200 text-sm mt-1">
            {TRIP_INFO.fechaIda} - {TRIP_INFO.fechaVuelta.split(" ")[1]}{" "}
            {TRIP_INFO.fechaVuelta.split(" ")[2]}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              <Plane className="w-3 h-3 mr-1" />
              {TRIP_INFO.codigoReserva}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alerta importante */}
      <Card className="bg-amber-950/50 border-amber-800">
        <CardContent className="p-3 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm font-medium">
              Vuelta: Sábado 17 a las 23:00
            </p>
            <p className="text-amber-400 text-xs mt-0.5">
              El vuelo sale 01:35 del domingo, estar en aeropuerto temprano
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Presupuesto rápido */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Presupuesto para compras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Disponible inicial</span>
            <span className="font-medium">
              USD {TRIP_INFO.presupuesto.disponibleCompras}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gastado</span>
            <span className="font-medium text-red-400">
              -USD {totalGastadoUSD.toFixed(0)}
            </span>
          </div>
          <Progress value={Math.min(percentUsed, 100)} className="h-2" />
          <div className="flex justify-between items-center pt-1">
            <span className="font-medium text-sm">Restante</span>
            <span
              className={`font-bold text-lg ${
                disponible >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              USD {disponible.toFixed(0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tipo de cambio */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tipo de cambio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">USD cambiados</p>
              <p className="text-lg font-bold">${exchangedUSD.toFixed(0)}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Tasa promedio</p>
              <p className="text-lg font-bold">
                {avgRate > 0 ? avgRate.toFixed(0) : "---"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vuelos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-400" />
            Vuelos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
            <div>
              <p className="font-medium text-sm">Viernes 16 - Ida</p>
              <p className="text-muted-foreground text-sm">
                BUE → SCL • {TRIP_INFO.vueloIda.hora}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
            <div>
              <p className="font-medium text-sm">Domingo 18 - Vuelta</p>
              <p className="text-muted-foreground text-sm">
                SCL → BUE • {TRIP_INFO.vueloVuelta.hora}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alojamiento */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-400" />
            Alojamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{TRIP_INFO.alojamiento.direccion}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {TRIP_INFO.alojamiento.zona} • USD {TRIP_INFO.alojamiento.costo}
          </p>
          <Badge className="mt-2 bg-purple-600 hover:bg-purple-700">
            <Clock className="w-3 h-3 mr-1" />
            Check-in: 19:45
          </Badge>
        </CardContent>
      </Card>

      {/* Lugares de compras */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-400" />
            Lugares de compras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PLACES.filter(
            (p) => p.tipo !== "alojamiento" && p.tipo !== "aeropuerto"
          ).map((place) => (
            <div
              key={place.nombre}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-xl">{place.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{place.nombre}</p>
                <p className="text-xs text-muted-foreground">{place.horario}</p>
                {place.tiempo_uber_min && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {place.tiempo_uber_min} min en Uber
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Itinerario rápido */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Itinerario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge variant="outline" className="text-indigo-400 border-indigo-400/50 mb-2">
              Viernes 16 - Llegada
            </Badge>
            <p className="text-sm text-muted-foreground">
              Aeropuerto → Mall Parque Arauco (almuerzo + compras) → Cleto Reyes 🥊 (~$325k CLP) → Tenis & Golf ⛳ → Depto
            </p>
            <p className="text-xs text-amber-400 mt-1">⚠️ Check-in depto: 19:45</p>
          </div>
          <div>
            <Badge variant="outline" className="text-indigo-400 border-indigo-400/50 mb-2">
              Sábado 17 - Todo el día
            </Badge>
            <p className="text-sm text-muted-foreground">
              Outlets Quilicura (Easton + Arauco Premium) - ir descansado para comprar bien
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
