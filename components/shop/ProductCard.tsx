import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { type Product, categoryIcon, formatEUR } from '@/lib/products';
import { BCP47 } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { WishButton } from './WishButton';
import { AddToCartButton } from './AddToCartButton';

export type CardContent = { name: string; badgeLabel: string };

/**
 * Vignette produit — **composant serveur**.
 *
 * Seuls le cœur « favori » et le bouton « ajouter » sont des îlots client.
 * Auparavant la carte entière était cliente : le catalogue hydratait vingt
 * composants complets au chargement, ce qui dominait le temps de blocage du
 * thread principal.
 */
export async function ProductCard({
  product,
  content,
  locale,
  /** Vrai pour les cartes visibles d'emblée : leur visuel ne doit pas être différé. */
  eager = false,
  /**
   * Niveau du titre de la carte.
   *
   * `h2` quand la grille suit directement le `h1` de la page (catalogue,
   * favoris), `h3` quand elle est introduite par un `h2` de section
   * (« Produits populaires », « Dans la même catégorie »). Sauter un niveau
   * casse la navigation par titres des lecteurs d'écran.
   */
  headingLevel = 3,
}: {
  product: Product;
  content: CardContent;
  locale: Locale;
  eager?: boolean;
  headingLevel?: 2 | 3;
}) {
  const t = await getTranslations({ locale });
  const tCard = await getTranslations({ locale, namespace: 'card' });

  const numLocale = BCP47[locale];
  const badgeClass =
    product.badge === 'new' ? 'b-new'
    : product.badge === 'pack' ? 'b-pack'
    : product.badge === 'copper' ? 'b-copper'
    : '';

  const href = `/${locale}/produit/${product.slug}`;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  /* La carte n'est pas un <a> englobant : un lien ne peut contenir ni un
     autre lien ni un bouton. Le titre porte le lien et l'étend à toute la
     carte via ::after (`.pname-link`) ; les actions repassent au-dessus. */
  return (
    <article className="pcard">
      <div className="pcard-img">
        <RemoteImage
          imageId={product.imageId}
          alt={content.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={eager}
        />
        {product.badge && content.badgeLabel && (
          <p className={`pbadge ${badgeClass}`}>{content.badgeLabel}</p>
        )}
        <WishButton
          slug={product.slug}
          labelAdd={tCard('wish', { name: content.name })}
          labelRemove={tCard('unwish', { name: content.name })}
        />
      </div>
      <div className="pbody">
        <p className="pcat">
          <Icon name={categoryIcon(product.category)} /> {t(`categories.${product.category}`)}
        </p>
        <Heading className="pname">
          <Link href={href} className="pname-link">{content.name}</Link>
        </Heading>
        <p className="pstars">
          <Icon name="star" />
          <span>
            {product.rating.toFixed(1)}
            <span className="sr-only"> {tCard('ratingOutOf5')} </span>({product.reviewsCount})
          </span>
        </p>
        <p className="pprice-row">
          <span className="pprice">{formatEUR(product.priceCents, numLocale)}</span>
          {product.oldPriceCents && (
            <span className="pold">{formatEUR(product.oldPriceCents, numLocale)}</span>
          )}
        </p>
        <div className="pactions">
          <AddToCartButton
            slug={product.slug}
            label={t('catalog.add')}
            addedLabel={tCard('added')}
          />
        </div>
      </div>
    </article>
  );
}
