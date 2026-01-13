export interface Expense {
  id: string;
  type: 'uber' | 'food' | 'store' | 'other';
  amount: number;
  currency: 'CLP' | 'USD';
  description: string;
  storeName?: string;
  date: string;
  timestamp: number;
}

export interface CurrencyExchange {
  id: string;
  usdAmount: number;
  clpAmount: number;
  rate: number;
  date: string;
  timestamp: number;
}

export interface TripData {
  expenses: Expense[];
  exchanges: CurrencyExchange[];
}

export interface Place {
  nombre: string;
  tipo: string;
  direccion: string;
  lat: number;
  lng: number;
  color: string;
  emoji: string;
  horario?: string;
  distancia_km?: number;
  tiempo_uber_min?: string;
  telefono?: string;
}

export const TRIP_INFO = {
  viajero: "Juan Cruz Saint Amant",
  origen: "Buenos Aires, Argentina",
  destino: "Santiago de Chile",
  fechaIda: "Viernes 16 de Enero 2026",
  fechaVuelta: "Domingo 18 de Enero 2026",
  codigoReserva: "YXKJBJ",
  alojamiento: {
    direccion: "Argomedo 382, Departamento 502",
    zona: "Santiago Centro",
    costo: 49,
  },
  presupuesto: {
    total: 1500,
    pasaje: 329,
    hospedaje: 49,
    comida: 60,
    ubers: 100,
    costosFijos: 538,
    disponibleCompras: 962,
  },
  vueloIda: {
    hora: "09:35",
    llegada: "~12:00",
  },
  vueloVuelta: {
    hora: "01:35",
    notaImportante: "Estar en aeropuerto ~23:00 del SÁBADO 17",
  },
};

export const PLACES: Place[] = [
  {
    nombre: "Departamento",
    tipo: "alojamiento",
    direccion: "Argomedo 382, Depto 502, Santiago",
    lat: -33.4489,
    lng: -70.6483,
    color: "#E53935",
    emoji: "🏨",
  },
  {
    nombre: "Mall Parque Arauco",
    tipo: "mall",
    direccion: "Av. Presidente Kennedy 5413, Las Condes",
    lat: -33.4012,
    lng: -70.5754,
    color: "#1E88E5",
    emoji: "🛍️",
    horario: "L-S 10:00-21:00, D 11:00-21:00",
    distancia_km: 12,
    tiempo_uber_min: "25-35",
  },
  {
    nombre: "Tenis & Golf",
    tipo: "tienda",
    direccion: "Av. Vitacura 5728, Vitacura",
    lat: -33.398,
    lng: -70.596,
    color: "#4CAF50",
    emoji: "⛳",
    horario: "L-S 10:00-20:00",
    distancia_km: 10,
    tiempo_uber_min: "5-10",
    telefono: "+56 2 2493 0640",
  },
  {
    nombre: "Cleto Reyes Chile",
    tipo: "tienda",
    direccion: "Las Tranqueras, Las Condes",
    lat: -33.3987716,
    lng: -70.5547705,
    color: "#D32F2F",
    emoji: "🥊",
    horario: "L-S 10:00-19:00",
    distancia_km: 11,
    tiempo_uber_min: "5-10",
    telefono: "+56 9 7967 1699",
  },
  {
    nombre: "Easton Outlet Mall",
    tipo: "outlet",
    direccion: "Av. Frei Montalva 9709, Quilicura",
    lat: -33.3614,
    lng: -70.6847,
    color: "#43A047",
    emoji: "👟",
    horario: "L-D 10:00-20:00",
    distancia_km: 14,
    tiempo_uber_min: "25-30",
    telefono: "+56 2 2733 5550",
  },
  {
    nombre: "Arauco Premium Outlet",
    tipo: "outlet",
    direccion: "Av. San Ignacio 500, Quilicura",
    lat: -33.365,
    lng: -70.689,
    color: "#66BB6A",
    emoji: "🏷️",
    horario: "L-S 10:00-20:00, D 11:00-20:00",
    distancia_km: 13,
    tiempo_uber_min: "25-30",
  },
  {
    nombre: "Aeropuerto SCL",
    tipo: "aeropuerto",
    direccion: "Aeropuerto Internacional Arturo Merino Benítez",
    lat: -33.393,
    lng: -70.7858,
    color: "#9C27B0",
    emoji: "✈️",
  },
];
