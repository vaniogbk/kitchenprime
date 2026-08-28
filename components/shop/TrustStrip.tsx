import { Icon, type IconName } from '@/components/ui/Icon';
import { useTranslations } from 'next-intl';

export function TrustStrip() {
  const t = useTranslations('strip');
  const items: Array<{ icon: IconName; label: string; val: string }> = [
    { icon: 'truck-fast', label: t('shippingLabel'), val: t('shippingVal') },
    { icon: 'shield-halved', label: t('warrantyLabel'), val: t('warrantyVal') },
    { icon: 'medal', label: t('resellerLabel'), val: t('resellerVal') },
    { icon: 'whatsapp', label: t('directLabel'), val: t('directVal') },
  ];

  return (
    <div className="strip">
      {items.map((it) => (
        <div className="strip-item" key={it.label}>
          <Icon name={it.icon} />
          <div>
            <div className="strip-label">{it.label}</div>
            <div className="strip-val">{it.val}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
