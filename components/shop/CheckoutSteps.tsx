import { getTranslations } from 'next-intl/server';
import { Icon } from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';

/**
 * Fil d'étapes du parcours d'achat.
 *
 * Situer l'acheteur dans un tunnel — et lui montrer ce qui reste — est l'un
 * des leviers les plus directs contre l'abandon de panier : sans repère, on ne
 * sait pas si valider engage la dépense ou mène simplement à l'écran suivant.
 *
 * Rendu en liste ordonnée : l'ordre des étapes est une information, pas une
 * décoration, et les lecteurs d'écran l'annoncent comme telle.
 */
export async function CheckoutSteps({
  current,
  locale,
}: {
  current: 1 | 2 | 3;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'steps' });
  const steps = [t('cart'), t('details'), t('confirmation')];

  return (
    <nav className="steps" aria-label={t('label')}>
      <ol className="steps-list">
        {steps.map((label, i) => {
          const n = i + 1;
          const state = n < current ? 'done' : n === current ? 'current' : 'todo';
          return (
            <li key={label} className={`step step--${state}`}>
              <span className="step-marker" aria-hidden="true">
                {state === 'done' ? <Icon name="check" /> : n}
              </span>
              <span className="step-label">{label}</span>
              {state === 'current' && <span className="sr-only">{t('currentSuffix')}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
