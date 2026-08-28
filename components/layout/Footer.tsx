import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { WA_NUMBER } from '@/lib/whatsapp';
import { Icon } from '@/components/ui/Icon';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="f-logo">Kitchen<span>Prime</span></div>
          <div className="f-tag">{t('tagline')}</div>
          <div className="f-socials">
            <a className="fsoc" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Icon name="facebook-f" />
            </a>
            <a className="fsoc" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a className="fsoc" href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <Icon name="tiktok" />
            </a>
          </div>
        </div>
        <div>
          <div className="f-col-title">{t('products')}</div>
          <div className="f-links">
            <Link className="flink" href={`/${locale}/catalogue?cat=robots`}><Icon name="blender" /> {t('robots')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=acc`}><Icon name="kitchen-set" /> {t('accessories')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=livres`}><Icon name="book-open" /> {t('books')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=packs`}><Icon name="boxes-stacked" /> {t('packs')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=maison`}><Icon name="house" /> {t('home')}</Link>
          </div>
        </div>
        <div>
          <div className="f-col-title">{t('support')}</div>
          <div className="f-links">
            <a className="flink" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> {t('whatsapp')}</a>
            <Link className="flink" href={`/${locale}/politique-retour`}><Icon name="rotate-left" /> {t('returns')}</Link>
            <Link className="flink" href={`/${locale}/contact`}><Icon name="headset" /> {t('shipping')}</Link>
            <Link className="flink" href={`/${locale}/cgv`}><Icon name="file-shield" /> {t('cgv')}</Link>
          </div>
        </div>
      </div>
      {/* Ces badges annonçaient Visa, Mastercard, Apple Pay et Klarna alors
          que la boutique n'encaisse que par virement : afficher des moyens
          qu'on n'accepte pas est une promesse commerciale qu'on ne tient pas,
          et un motif d'abandon au moment de payer. */}
      <div className="f-pay">
        <div className="f-pay-label"><Icon name="lock" /> {t('securePay')}</div>
        <div className="pmb"><Icon name="building-columns" /> {t('payTransfer')}</div>
        <div className="pmb">SEPA</div>
      </div>
      <div className="f-bot">
        <div className="f-copy">{t('copy')}</div>
        <div className="f-bot-links">
          <Link href={`/${locale}/mentions-legales`}>{t('legal')}</Link>
          <Link href={`/${locale}/cgv`}>{t('cgv')}</Link>
          <Link href={`/${locale}/politique-retour`}>{t('returns')}</Link>
          <Link href={`/${locale}/contact`}>Contact</Link>
        </div>
      </div>
    </footer>
  );
}
