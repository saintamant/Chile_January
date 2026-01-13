"use client";

import { useStore } from "@/lib/store";
import { TRIP_INFO } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResumenPage() {
  const {
    expenses,
    getTotalSpentCLP,
    getTotalSpentUSD,
    getTotalExchangedUSD,
    getTotalExchangedCLP,
    getAverageRate,
    getExpensesByType,
  } = useStore();

  const avgRate = getAverageRate();
  const totalSpentCLP = getTotalSpentCLP();
  const totalSpentUSD = getTotalSpentUSD();
  const exchangedUSD = getTotalExchangedUSD();
  const exchangedCLP = getTotalExchangedCLP();

  const clpToUSD = avgRate > 0 ? totalSpentCLP / avgRate : 0;
  const totalGastadoUSD = totalSpentUSD + clpToUSD;

  const presupuestoTotal = TRIP_INFO.presupuesto.total;
  const costosFijos = TRIP_INFO.presupuesto.costosFijos;
  const disponibleCompras = TRIP_INFO.presupuesto.disponibleCompras;
  const gastadoEnCompras = totalGastadoUSD;
  const restanteCompras = disponibleCompras - gastadoEnCompras;

  const costoTotalViaje = costosFijos + gastadoEnCompras;
  const restantePresupuesto = presupuestoTotal - costoTotalViaje;

  const equivalenteArgentina = gastadoEnCompras * 2;
  const ahorroEstimado = equivalenteArgentina - gastadoEnCompras;

  const clpRestante = exchangedCLP - totalSpentCLP;

  const expenseCategories = [
    {
      type: "uber" as const,
      label: "Ubers",
      icon: Car,
      bgColor: "bg-purple-500",
      budget: TRIP_INFO.presupuesto.ubers,
    },
    {
      type: "food" as const,
      label: "Comida",
      icon: UtensilsCrossed,
      bgColor: "bg-orange-500",
      budget: TRIP_INFO.presupuesto.comida,
    },
    {
      type: "store" as const,
      label: "Tiendas",
      icon: ShoppingBag,
      bgColor: "bg-blue-500",
      budget: null,
    },
    {
      type: "other" as const,
      label: "Otros",
      icon: MoreHorizontal,
      bgColor: "bg-gray-500",
      budget: null,
    },
  ];

  const getCategoryTotal = (type: "uber" | "food" | "store" | "other") => {
    const categoryExpenses = getExpensesByType(type);
    return categoryExpenses.reduce((sum, e) => {
      if (e.currency === "USD") return sum + e.amount;
      if (avgRate > 0) return sum + e.amount / avgRate;
      return sum;
    }, 0);
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-xl font-bold">Resumen del viaje</h1>

      {/* Main Budget Status */}
      <Card
        className={cn(
          "border-0",
          restantePresupuesto >= 0
            ? "bg-gradient-to-br from-emerald-600 to-emerald-800"
            : "bg-gradient-to-br from-red-600 to-red-800"
        )}
      >
        <CardContent className="p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            {restantePresupuesto >= 0 ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">
              {restantePresupuesto >= 0
                ? "Dentro del presupuesto"
                : "Excediste el presupuesto"}
            </span>
          </div>
          <p className="text-3xl font-bold">
            USD {Math.abs(restantePresupuesto).toFixed(0)}
            <span className="text-lg font-normal ml-2 opacity-80">
              {restantePresupuesto >= 0 ? "restante" : "excedido"}
            </span>
          </p>
          <p className="text-sm opacity-80 mt-2">
            De un presupuesto total de USD {presupuestoTotal}
          </p>
        </CardContent>
      </Card>

      {/* Desglose general */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            Desglose del viaje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Presupuesto total</span>
            <span className="font-semibold">USD {presupuestoTotal}</span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <span className="ml-4">- Costos fijos (vuelo, hotel, etc)</span>
            <span>-USD {costosFijos}</span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <span className="ml-4">- Gastado en compras</span>
            <span>-USD {gastadoEnCompras.toFixed(0)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="font-medium">Restante</span>
            <span
              className={cn(
                "font-bold text-lg",
                restantePresupuesto >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              USD {restantePresupuesto.toFixed(0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Presupuesto para compras */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            Presupuesto para compras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Disponible inicial</span>
            <span className="font-medium">USD {disponibleCompras}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Gastado</span>
            <span className="font-medium text-red-400">
              -USD {gastadoEnCompras.toFixed(0)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Restante para compras</span>
              <span
                className={cn(
                  "font-bold text-lg",
                  restanteCompras >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                USD {restanteCompras.toFixed(0)}
              </span>
            </div>
            <Progress
              value={Math.min((gastadoEnCompras / disponibleCompras) * 100, 100)}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground text-right">
              {((gastadoEnCompras / disponibleCompras) * 100).toFixed(0)}% usado
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gastos por categoría */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gastos por categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expenseCategories.map((cat) => {
            const total = getCategoryTotal(cat.type);
            const Icon = cat.icon;
            const overBudget = cat.budget && total > cat.budget;
            return (
              <div key={cat.type} className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", cat.bgColor)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{cat.label}</span>
                    <span
                      className={cn("font-semibold", overBudget && "text-red-400")}
                    >
                      USD {total.toFixed(0)}
                    </span>
                  </div>
                  {cat.budget && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Presupuesto: USD {cat.budget}</span>
                      <span
                        className={overBudget ? "text-red-400" : "text-emerald-400"}
                      >
                        {overBudget
                          ? `+${(total - cat.budget).toFixed(0)} excedido`
                          : `${(cat.budget - total).toFixed(0)} restante`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Tipo de cambio */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Resumen de cambio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">USD cambiados</p>
              <p className="text-xl font-bold">${exchangedUSD.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CLP obtenidos</p>
              <p className="text-xl font-bold">${exchangedCLP.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasa promedio</p>
              <p className="text-xl font-bold">
                {avgRate > 0 ? avgRate.toFixed(0) : "---"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CLP restante</p>
              <p
                className={cn(
                  "text-xl font-bold",
                  clpRestante >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                ${clpRestante.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ahorro estimado */}
      {gastadoEnCompras > 0 && (
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-800 border-0">
          <CardContent className="p-4 text-white">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ahorro estimado
            </h2>
            <p className="text-sm text-blue-200 mb-3">
              Si compraste ropa que en Argentina sale ~50% más caro:
            </p>
            <div className="bg-white/10 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Gastaste en Chile</span>
                <span className="font-medium">USD {gastadoEnCompras.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Equiv. en Argentina</span>
                <span className="font-medium">~USD {equivalenteArgentina.toFixed(0)}</span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between">
                <span className="font-medium">Ahorro estimado</span>
                <span className="text-xl font-bold">USD {ahorroEstimado.toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total de gastos</p>
              <p className="font-semibold">{expenses.length} registros</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gasto promedio</p>
              <p className="font-semibold">
                USD{" "}
                {expenses.length > 0
                  ? (totalGastadoUSD / expenses.length).toFixed(0)
                  : "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
