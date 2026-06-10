import { useTranslations } from 'next-intl';

export function TrustStrip() {
  const t = useTranslations('strip');
  const items = [
    { icon: 'fa-truck-fast', label: t('shippingLabel'), val: t('shippingVal') },
    { icon: 'fa-shield-halved', label: t('warrantyLabel'), val: t('warrantyVal') },
    { icon: 'fa-medal', label: t('resellerLabel'), val: t('resellerVal') },
    { icon: 'fa-whatsapp', label: t('directLabel'), val: t('directVal'), brand: true },
  ];

  return (
    <div className="strip">
      {items.map((it) => (
        <div className="strip-item" key={it.label}>
          <i className={`${it.brand ? 'fa-brands' : 'fa-solid'} ${it.icon}`} />
          <div>
            <div className="strip-label">{it.label}</div>
            <div className="strip-val">{it.val}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
