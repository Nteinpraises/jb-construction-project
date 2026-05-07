import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string | null;
  image_url: string | null;
  quantity: number;
};

const KEY = "jb_cart_v1";
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export const cart = {
  get: read,
  add(item: Omit<CartItem, "quantity">, qty = 1) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.quantity += qty;
    else items.push({ ...item, quantity: qty });
    write(items);
  },
  setQty(id: string, qty: number) {
    const items = read()
      .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i))
      .filter((i) => i.quantity > 0);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => read());
  useEffect(() => {
    const fn = () => setItems(read());
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
  return { items, count, total };
}

export function formatXAF(n: number) {
  return new Intl.NumberFormat("fr-CM", { maximumFractionDigits: 0 }).format(n) + " XAF";
}
