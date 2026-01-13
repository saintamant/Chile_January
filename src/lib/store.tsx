"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Expense, CurrencyExchange, TripData } from "./types";

interface StoreContextType {
  expenses: Expense[];
  exchanges: CurrencyExchange[];
  addExpense: (expense: Omit<Expense, "id" | "timestamp">) => void;
  removeExpense: (id: string) => void;
  addExchange: (exchange: Omit<CurrencyExchange, "id" | "timestamp">) => void;
  removeExchange: (id: string) => void;
  getTotalSpentCLP: () => number;
  getTotalSpentUSD: () => number;
  getTotalExchangedUSD: () => number;
  getTotalExchangedCLP: () => number;
  getAverageRate: () => number;
  getExpensesByType: (type: Expense["type"]) => Expense[];
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = "viaje-chile-2026-data";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [exchanges, setExchanges] = useState<CurrencyExchange[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: TripData = JSON.parse(stored);
        setExpenses(data.expenses || []);
        setExchanges(data.exchanges || []);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (loaded) {
      const data: TripData = { expenses, exchanges };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [expenses, exchanges, loaded]);

  const addExpense = (expense: Omit<Expense, "id" | "timestamp">) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addExchange = (exchange: Omit<CurrencyExchange, "id" | "timestamp">) => {
    const newExchange: CurrencyExchange = {
      ...exchange,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setExchanges((prev) => [...prev, newExchange]);
  };

  const removeExchange = (id: string) => {
    setExchanges((prev) => prev.filter((e) => e.id !== id));
  };

  const getTotalSpentCLP = () => {
    return expenses
      .filter((e) => e.currency === "CLP")
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalSpentUSD = () => {
    return expenses
      .filter((e) => e.currency === "USD")
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalExchangedUSD = () => {
    return exchanges.reduce((sum, e) => sum + e.usdAmount, 0);
  };

  const getTotalExchangedCLP = () => {
    return exchanges.reduce((sum, e) => sum + e.clpAmount, 0);
  };

  const getAverageRate = () => {
    if (exchanges.length === 0) return 0;
    const totalUSD = getTotalExchangedUSD();
    const totalCLP = getTotalExchangedCLP();
    return totalUSD > 0 ? totalCLP / totalUSD : 0;
  };

  const getExpensesByType = (type: Expense["type"]) => {
    return expenses.filter((e) => e.type === type);
  };

  return (
    <StoreContext.Provider
      value={{
        expenses,
        exchanges,
        addExpense,
        removeExpense,
        addExchange,
        removeExchange,
        getTotalSpentCLP,
        getTotalSpentUSD,
        getTotalExchangedUSD,
        getTotalExchangedCLP,
        getAverageRate,
        getExpensesByType,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
