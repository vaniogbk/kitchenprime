'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { waOrderUrl } from '@/lib/whatsapp';
import { type Locale } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { RemoteImage } from '@/components/ui/RemoteImage';

const HERO_IMAGES = [
  'photo-1556909114-f6e7ad7d3136',
  'photo-1585515320310-259814833e62',
  'photo-1591189863430-ab87e120f312',
  'photo-1565299624946-b28f40a0ae38',
];

/** Amplitude maximale de l'inclinaison, en degrés. */
const TILT = 9;

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('hero');
  const tWa = useTranslations('wa');
  const [active, setActive] = useState(0);
  // Deux refs : la scène capte le pointeur et porte la perspective, l'étage
  // reçoit la rotation. Transformer la scène elle-même annulerait sa
  // perspective et aplatirait la 3D.
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /**
   * Parallaxe 3D au pointeur.
   *
   * L'inclinaison est écrite directement sur le nœud DOM plutôt que dans un
   * état React : à 60 images/s, un setState par mouvement de souris
   * déclencherait un rendu React par frame. Ici le navigateur ne fait que
   * recomposer une transformation — travail GPU, aucun recalcul de mise en
   * page.
   */
  useEffect(() => {
    const el = sceneRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;

    // Respecte le réglage système « réduire les animations ».
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    // Sur écran tactile, il n'y a pas de survol : l'effet resterait figé.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    // Mesuré une fois par déplacement du pointeur, pas à chaque image :
    // getBoundingClientRect() dans une boucle rAF force un recalcul de mise
    // en page à chaque frame.
    let rect: DOMRect | null = null;

    function render() {
      // Interpolation : la carte rattrape le pointeur au lieu de le suivre
      // sèchement, ce qui donne l'inertie d'un objet physique.
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      // Écriture directe de `transform` plutôt que de variables CSS : changer
      // une custom property invalide le style de tout le sous-arbre, alors
      // qu'une transformation reste au niveau du compositeur.
      stage!.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

      // La boucle s'arrête d'elle-même une fois la position stabilisée : rien
      // ne tourne en fond quand le visiteur ne survole pas la scène.
      if (Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(render);
    }

    function start() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(render);
    }

    function onEnter() {
      rect = el!.getBoundingClientRect();
    }

    function onMove(e: PointerEvent) {
      const r = rect ?? (rect = el!.getBoundingClientRect());
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      targetY = px * TILT * 2;
      targetX = -py * TILT * 2;
      start();
    }

    function onLeave() {
      targetX = 0;
      targetY = 0;
      rect = null;
      start();
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section className="hero hero--3d" aria-labelledby="hero-title">
      {/* Halos d'ambiance, purement décoratifs. */}
      <div className="hero-aura" aria-hidden="true">
        <span className="hero-orb hero-orb--indigo" />
        <span className="hero-orb hero-orb--copper" />
      </div>

      <div className="hero-copy">
        <p className="hero-eyebrow">
          <Icon name="crown" /> {t('eyebrow')}
        </p>
        <h1 className="hero-h1" id="hero-title">
          {t('titlePre')}<br />
          {t('titleHighlightPre')}<span>{t('titleHighlight')}</span>
        </h1>
        <p className="hero-p">{t('desc')}</p>
        <div className="hero-btns">
          <Link href={`/${locale}/produit/thermomix-tm7`} className="btn-buy">
            <Icon name="bag-shopping" /> {t('cta1')}
          </Link>
          <a
            href={waOrderUrl('Thermomix TM7', tWa.raw('msg') as string)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <Icon name="whatsapp" style={{ fontSize: 15 }} /> {t('cta2')}
          </a>
        </div>
        <div className="hero-trust">
          <div className="htrust"><Icon name="shield-halved" /> {t('trust1')}</div>
          <div className="htrust"><Icon name="truck-fast" /> {t('trust2')}</div>
          <div className="htrust"><Icon name="rotate-left" /> {t('trust3')}</div>
        </div>
      </div>

      <div className="hero-scene" ref={sceneRef}>
        <div className="hero-stage" ref={stageRef}>
          <div className="hero-gallery">
            <div className="hero-main">
              {/* Visuel LCP de l'accueil : chargé en priorité, sans lazy-loading. */}
              <RemoteImage
                imageId={HERO_IMAGES[active]}
                alt={t('imageAlt')}
                sizes="(max-width: 900px) 100vw, 45vw"
                priority
                quality={80}
              />
              <span className="hero-shine" aria-hidden="true" />
              <p className="hero-badge">{t('badge')}</p>
            </div>
            <div className="hero-thumbs">
              {HERO_IMAGES.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  className={`hthumb${i === active ? ' on' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={t('viewImage', { n: i + 1 })}
                  aria-pressed={i === active}
                >
                  <RemoteImage imageId={id} alt="" sizes="120px" quality={60} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
