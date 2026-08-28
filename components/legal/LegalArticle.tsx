import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';
import { RichText } from './RichText';
import type { Block, LegalPage } from '@/content/legal/types';

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === 'p') return <p key={i}><RichText>{b.text}</RichText></p>;
        if (b.t === 'ul') {
          return (
            <ul key={i}>
              {b.items.map((it, j) => <li key={j}><RichText>{it}</RichText></li>)}
            </ul>
          );
        }
        return (
          <ol key={i}>
            {b.items.map((it, j) => <li key={j}><RichText>{it}</RichText></li>)}
          </ol>
        );
      })}
    </>
  );
}

/** Gabarit commun aux pages CGV, mentions légales et politique de retour. */
export function LegalArticle({
  page,
  icon,
  locale,
  children,
}: {
  page: LegalPage;
  icon: IconName;
  locale: string;
  /** Contenu spécifique inséré avant les sections (cartes contact, horaires…). */
  children?: React.ReactNode;
}) {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <p className="legal-eyebrow"><Icon name={icon} /> {page.eyebrow}</p>
        <h1 className="legal-title">{page.title}</h1>
        {page.subtitle && <p className="legal-subtitle">{page.subtitle}</p>}
      </div>
      <div className="legal-body">
        {page.highlight && (
          <div className="legal-highlight">
            <Icon name="shield-halved" />
            <div>
              <strong>{page.highlight.strong}</strong><br />
              {page.highlight.text}
            </div>
          </div>
        )}

        {children}

        {page.sections.map((s) => (
          <section className="legal-section" key={s.h}>
            <h2>{s.h}</h2>
            <Blocks blocks={s.blocks} />
          </section>
        ))}

        <div className="legal-back">
          <Link href={`/${locale}`} className="btn-buy">
            <Icon name="arrow-left" /> {page.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
