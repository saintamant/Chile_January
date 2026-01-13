"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Receipt, ArrowLeftRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/mapa", icon: Map, label: "Mapa" },
  { href: "/gastos", icon: Receipt, label: "Gastos" },
  { href: "/cambio", icon: ArrowLeftRight, label: "Cambio" },
  { href: "/resumen", icon: BarChart3, label: "Resumen" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
