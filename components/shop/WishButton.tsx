'use client';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const WL_KEY = 'kp_wishlist';

export function readWishlist(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(WL_KEY) || '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Bouton « favori » d'une carte produit.
 *
 * Îlot client minimal : la carte qui l'entoure est rendue côté serveur et
 * n'embarque aucun JavaScript. Sur le catalogue, cela évite d'hydrater
 * vingt composants complets pour deux boutons chacun.
 */
export function WishButton({
  slug,
  labelAdd,
  labelRemove,
}: {
  slug: string;
  labelAdd: string;
  labelRemove: string;
}) {
  const [wished, setWished] = useState(false);

  useEffect(() => {
    setWished(readWishlist().includes(slug));
    const sync = () => setWished(readWishlist().includes(slug));
    window.addEventListener('kp:wishlist', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('kp:wishlist', sync);
      window.removeEventListener('storage', sync);
    };
  }, [slug]);

  function toggle() {
    const list = readWishlist();
    const next = wished ? list.filter((s) => s !== slug) : [...list, slug];
    try {
      localStorage.setItem(WL_KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible : l'état reste valable pour la session */
    }
    setWished(!wished);
    // La page favoris et les autres cartes vivent dans d'autres arbres React.
    window.dispatchEvent(new CustomEvent('kp:wishlist'));
  }

  return (
    <button
      type="button"
      className={`pwish${wished ? ' on' : ''}`}
      onClick={toggle}
      aria-pressed={wished}
      aria-label={wished ? labelRemove : labelAdd}
    >
      <Icon name={wished ? 'heart' : 'heart-regular'} />
    </button>
  );
}
