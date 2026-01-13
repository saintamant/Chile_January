"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Expense } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Plus,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

const expenseTypes: {
  type: Expense["type"];
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  { type: "uber", label: "Uber", icon: Car, color: "text-purple-400", bgColor: "bg-purple-500" },
  { type: "food", label: "Comida", icon: UtensilsCrossed, color: "text-orange-400", bgColor: "bg-orange-500" },
  { type: "store", label: "Tienda", icon: ShoppingBag, color: "text-blue-400", bgColor: "bg-blue-500" },
  { type: "other", label: "Otro", icon: MoreHorizontal, color: "text-gray-400", bgColor: "bg-gray-500" },
];

export default function GastosPage() {
  const { expenses, addExpense, removeExpense, getAverageRate } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<Expense["type"]>("uber");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"CLP" | "USD">("CLP");
  const [description, setDescription] = useState("");
  const [storeName, setStoreName] = useState("");

  const avgRate = getAverageRate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    addExpense({
      type: selectedType,
      amount: parseFloat(amount),
      currency,
      description: description || getDefaultDescription(selectedType),
      storeName: selectedType === "store" ? storeName : undefined,
      date: new Date().toISOString().split("T")[0],
    });

    setAmount("");
    setDescription("");
    setStoreName("");
    setShowForm(false);
  };

  const getDefaultDescription = (type: Expense["type"]) => {
    switch (type) {
      case "uber":
        return "Viaje en Uber";
      case "food":
        return "Comida";
      case "store":
        return storeName || "Compra en tienda";
      default:
        return "Gasto";
    }
  };

  const getTypeInfo = (type: Expense["type"]) => {
    return expenseTypes.find((t) => t.type === type) || expenseTypes[3];
  };

  const formatAmount = (expense: Expense) => {
    if (expense.currency === "CLP") {
      return `$${expense.amount.toLocaleString()} CLP`;
    }
    return `USD ${expense.amount.toFixed(2)}`;
  };

  const getUSDEquivalent = (expense: Expense) => {
    if (expense.currency === "USD") return expense.amount;
    if (avgRate <= 0) return 0;
    return expense.amount / avgRate;
  };

  const expensesByType = expenseTypes.map((type) => ({
    ...type,
    expenses: expenses.filter((e) => e.type === type.type),
    total: expenses
      .filter((e) => e.type === type.type)
      .reduce((sum, e) => sum + getUSDEquivalent(e), 0),
  }));

  const sortedExpenses = [...expenses].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gastos</h1>
        <Button onClick={() => setShowForm(true)} size="icon" className="rounded-full">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Summary by type */}
      <div className="grid grid-cols-2 gap-3">
        {expensesByType.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.type}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("p-1.5 rounded-lg", type.bgColor)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{type.label}</span>
                </div>
                <p className="text-lg font-bold">USD {type.total.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">
                  {type.expenses.length} registros
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Expense List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Historial</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No hay gastos registrados</p>
              <p className="text-sm mt-1">Tocá + para agregar tu primer gasto</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedExpenses.map((expense) => {
                const typeInfo = getTypeInfo(expense.type);
                const Icon = typeInfo.icon;
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <div className={cn("p-2 rounded-lg", typeInfo.bgColor)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {expense.storeName || expense.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatAmount(expense)}</p>
                      {expense.currency === "CLP" && avgRate > 0 && (
                        <p className="text-xs text-muted-foreground">
                          ~USD {getUSDEquivalent(expense).toFixed(0)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                      onClick={() => removeExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Sheet */}
      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh]">
          <SheetHeader>
            <SheetTitle>Agregar gasto</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Type selector */}
            <div>
              <label className="text-sm font-medium block mb-2">Tipo</label>
              <div className="grid grid-cols-4 gap-2">
                {expenseTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.type;
                  return (
                    <button
                      key={type.type}
                      type="button"
                      onClick={() => setSelectedType(type.type)}
                      className={cn(
                        "p-3 rounded-xl flex flex-col items-center gap-1 transition-all border",
                        isSelected
                          ? `${type.bgColor} text-white border-transparent`
                          : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Store name */}
            {selectedType === "store" && (
              <div>
                <label className="text-sm font-medium block mb-1">
                  Nombre de tienda
                </label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ej: Nike, Falabella, H&M"
                />
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="text-sm font-medium block mb-1">Monto</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="text-lg font-semibold"
                  step="any"
                />
                <div className="flex rounded-lg overflow-hidden border border-border">
                  <button
                    type="button"
                    onClick={() => setCurrency("CLP")}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors",
                      currency === "CLP"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    CLP
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors",
                      currency === "USD"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Descripción (opcional)
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agregar nota..."
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg">
              Agregar gasto
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
