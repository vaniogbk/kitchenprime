import type { CSSProperties } from 'react';
import { ICONS, type IconName } from './icons.generated';

export type { IconName };

type Props = {
  name: IconName;
  /** Classe additionnelle sur le wrapper `<i>`. */
  className?: string;
  style?: CSSProperties;
  /**
   * Libellé accessible. Omis (défaut) l'icône est décorative et masquée
   * aux lecteurs d'écran — c'est le cas de la quasi-totalité des icônes ici,
   * toujours accompagnées d'un texte visible.
   */
  title?: string;
};

/**
 * Icône SVG inline.
 *
 * Rendue dans un `<i>` afin de conserver telles quelles les règles CSS
 * existantes (`.strip-item i { color; font-size }`…). Le SVG hérite de la
 * couleur via `currentColor` et se dimensionne en `1em`, donc `font-size`
 * continue de piloter la taille exactement comme avec une icon-font.
 */
export function Icon({ name, className, style, title }: Props) {
  const glyph = ICONS[name];
  if (!glyph) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`<Icon> : icône inconnue « ${name} ». Ajoute-la puis relance npm run build:icons.`);
    }
    return null;
  }
  const [viewBox, d] = glyph;
  return (
    <i className={className ? `ico ${className}` : 'ico'} style={style} aria-hidden={title ? undefined : true}>
      <svg
        viewBox={viewBox}
        width="1em"
        height="1em"
        fill="currentColor"
        focusable="false"
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
      >
        {title ? <title>{title}</title> : null}
        <path d={d} />
      </svg>
    </i>
  );
}
