import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

/**
 * Rend le balisage léger des pages légales : `**gras**` et `[libellé](url)`.
 *
 * Volontairement pas de `dangerouslySetInnerHTML` : le contenu est certes
 * rédigé en interne, mais un rendu par nœuds React garantit qu'aucune chaîne
 * ne pourra jamais être interprétée comme du HTML, même après un copier-coller
 * malheureux dans un fichier de contenu.
 */
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function RichText({ children }: { children: string }) {
  const parts = children.split(TOKEN).filter((s) => s !== '');

  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) return <strong key={i}>{bold[1]}</strong>;

        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          // Lien interne → <Link> (navigation client) ; externe → <a> sécurisé.
          if (href.startsWith('/')) {
            return <Link key={i} href={href}>{label}</Link>;
          }
          const external = /^https?:/.test(href);
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {label}
            </a>
          );
        }

        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Variante renvoyant directement un nœud, pratique dans les `map`. */
export function rich(text: string): ReactNode {
  return <RichText>{text}</RichText>;
}
