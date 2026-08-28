'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RemoteImage } from '@/components/ui/RemoteImage';

export function PDPGallery({ imageIds, alt }: { imageIds: string[]; alt: string }) {
  const t = useTranslations('pdp');
  const [active, setActive] = useState(0);

  return (
    <div className="pdp-gallery">
      <div className="pdp-main">
        {/* Visuel LCP de la fiche produit. */}
        <RemoteImage
          imageId={imageIds[active]}
          alt={alt}
          sizes="(max-width: 900px) 100vw, 45vw"
          priority
          quality={80}
        />
      </div>
      <div className="pdp-thumbs">
        {imageIds.map((id, i) => (
          <button
            key={id}
            type="button"
            className={`pdp-thumb${i === active ? ' on' : ''}`}
            onClick={() => setActive(i)}
            aria-label={t('viewImage', { n: i + 1 })}
            aria-pressed={i === active}
          >
            <RemoteImage imageId={id} alt="" sizes="120px" quality={60} />
          </button>
        ))}
      </div>
    </div>
  );
}
