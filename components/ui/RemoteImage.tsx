import Image from 'next/image';

/**
 * Visuel produit hébergé sur Unsplash, servi via l'optimiseur d'images Next.
 *
 * Pourquoi pas un `<img>` : l'optimiseur produit de l'AVIF/WebP, génère un
 * `srcset` adapté à la largeur réelle d'affichage et impose des dimensions,
 * ce qui supprime le décalage de mise en page (CLS) au chargement.
 *
 * Le conteneur porte déjà `aspect-ratio` + `overflow: hidden` en CSS, d'où
 * le mode `fill`.
 */
export function RemoteImage({
  imageId,
  alt,
  sizes,
  priority = false,
  quality = 72,
}: {
  imageId: string;
  /** Chaîne vide pour un visuel purement décoratif. */
  alt: string;
  /** Largeur d'affichage par point de rupture — indispensable au bon srcset. */
  sizes: string;
  /** À réserver au visuel LCP (image principale au-dessus de la ligne de flottaison). */
  priority?: boolean;
  quality?: number;
}) {
  return (
    <Image
      src={`https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=1400&q=80`}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      // Hors LCP, on laisse le navigateur décoder hors du thread principal.
      loading={priority ? undefined : 'lazy'}
    />
  );
}
