'use client';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useCart } from '@/components/shop/CartProvider';

/**
 * Bouton « ajouter au panier » d'une carte produit.
 *
 * Second îlot client de la carte, avec `WishButton` : tout le reste de la
 * vignette (visuel, titre, prix, note) est rendu côté serveur.
 */
export function AddToCartButton({
  slug,
  label,
  addedLabel,
}: {
  slug: string;
  label: string;
  addedLabel: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function onClick() {
    add(slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button type="button" className="pbtn-buy" onClick={onClick}>
      <Icon name={added ? 'check' : 'cart-plus'} /> {added ? addedLabel : label}
    </button>
  );
}
