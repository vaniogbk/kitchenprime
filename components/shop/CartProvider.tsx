'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CartLine = { slug: string; qty: number };

const KEY = 'kp_cart';
const MAX_QTY = 99;

type CartApi = {
  lines: CartLine[];
  /** Nombre total d'articles (somme des quantités). */
  count: number;
  /** Faux tant que le localStorage n'a pas été lu — évite un écart d'hydratation. */
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is CartLine =>
          !!l && typeof (l as CartLine).slug === 'string' && Number.isFinite((l as CartLine).qty),
      )
      .map((l) => ({ slug: l.slug, qty: Math.min(MAX_QTY, Math.max(1, Math.trunc(l.qty))) }));
  } catch {
    return [];
  }
}

/**
 * Panier persisté en localStorage.
 *
 * Le panier reste volontairement côté client : il ne contient que des slugs et
 * des quantités. Les prix sont systématiquement recalculés côté serveur à la
 * création de la commande (`app/api/orders/route.ts`), donc un panier trafiqué
 * ne peut pas modifier le montant facturé.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(read());
    setReady(true);
    // Garde les onglets synchronisés.
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLines(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* quota plein ou stockage bloqué : le panier reste valable pour la session */
    }
  }, []);

  const add = useCallback(
    (slug: string, qty = 1) => {
      setLines((prev) => {
        const found = prev.find((l) => l.slug === slug);
        const next = found
          ? prev.map((l) =>
              l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
            )
          : [...prev, { slug, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const setQty = useCallback(
    (slug: string, qty: number) => {
      const q = Math.trunc(qty);
      persist(
        q <= 0
          ? lines.filter((l) => l.slug !== slug)
          : lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, q) } : l)),
      );
    },
    [lines, persist],
  );

  const remove = useCallback(
    (slug: string) => persist(lines.filter((l) => l.slug !== slug)),
    [lines, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);

  const value = useMemo<CartApi>(
    () => ({ lines, count, ready, add, setQty, remove, clear }),
    [lines, count, ready, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé à l’intérieur de <CartProvider>');
  return ctx;
}
