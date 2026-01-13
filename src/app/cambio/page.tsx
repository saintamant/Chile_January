"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Trash2, TrendingUp, DollarSign } from "lucide-react";

export default function CambioPage() {
  const {
    exchanges,
    addExchange,
    removeExchange,
    getTotalExchangedUSD,
    getTotalExchangedCLP,
    getAverageRate,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [usdAmount, setUsdAmount] = useState("");
  const [clpAmount, setClpAmount] = useState("");

  const totalUSD = getTotalExchangedUSD();
  const totalCLP = getTotalExchangedCLP();
  const avgRate = getAverageRate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usd = parseFloat(usdAmount);
    const clp = parseFloat(clpAmount);

    if (!usd || !clp || usd <= 0 || clp <= 0) return;

    addExchange({
      usdAmount: usd,
      clpAmount: clp,
      rate: clp / usd,
      date: new Date().toISOString().split("T")[0],
    });

    setUsdAmount("");
    setClpAmount("");
    setShowForm(false);
  };

  const calculatedRate =
    usdAmount && clpAmount
      ? (parseFloat(clpAmount) / parseFloat(usdAmount)).toFixed(0)
      : "---";

  const sortedExchanges = [...exchanges].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Cambio de divisas</h1>
        <Button
          onClick={() => setShowForm(true)}
          size="icon"
          className="rounded-full bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-muted-foreground">USD cambiados</span>
            </div>
            <p className="text-2xl font-bold">${totalUSD.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Tasa promedio</span>
            </div>
            <p className="text-2xl font-bold">
              {avgRate > 0 ? avgRate.toFixed(0) : "---"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Total CLP */}
      <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-0">
        <CardContent className="p-4 text-white">
          <p className="text-sm text-emerald-200">Total en pesos chilenos</p>
          <p className="text-3xl font-bold mt-1">
            ${totalCLP.toLocaleString()} CLP
          </p>
          {totalCLP > 0 && (
            <p className="text-sm text-emerald-200 mt-2">
              Disponible para gastar en Chile
            </p>
          )}
        </CardContent>
      </Card>

      {/* Exchange History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Historial de cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedExchanges.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No hay cambios registrados</p>
              <p className="text-sm mt-1">
                Registrá cuando cambies dólares a pesos
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedExchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">USD {exchange.usdAmount}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium text-emerald-400">
                        ${exchange.clpAmount.toLocaleString()} CLP
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{exchange.date}</span>
                      <span>•</span>
                      <span>Tasa: {exchange.rate.toFixed(0)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                    onClick={() => removeExchange(exchange.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-950/30 border-blue-800/50">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-300 mb-2">Tips de cambio</h3>
          <ul className="text-sm text-blue-400 space-y-1">
            <li>• Casas de cambio del centro tienen mejor tasa</li>
            <li>• Preguntá siempre antes de cambiar</li>
            <li>• Evitá cambiar en el aeropuerto</li>
          </ul>
        </CardContent>
      </Card>

      {/* Add Exchange Sheet */}
      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh]">
          <SheetHeader>
            <SheetTitle>Registrar cambio</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* USD Amount */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Dólares (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  placeholder="100"
                  className="pl-8 text-lg font-semibold"
                  step="any"
                />
              </div>
            </div>

            {/* CLP Amount */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Pesos chilenos (CLP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={clpAmount}
                  onChange={(e) => setClpAmount(e.target.value)}
                  placeholder="95000"
                  className="pl-8 text-lg font-semibold"
                  step="any"
                />
              </div>
            </div>

            {/* Calculated Rate */}
            <Card className="bg-muted">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Tipo de cambio</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {calculatedRate}
                </p>
                <p className="text-xs text-muted-foreground">CLP por USD</p>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
            >
              Registrar cambio
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
