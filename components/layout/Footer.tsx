import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

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
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a className="fsoc" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a className="fsoc" href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <i className="fa-brands fa-tiktok" />
            </a>
          </div>
        </div>
        <div>
          <div className="f-col-title">{t('products')}</div>
          <div className="f-links">
            <Link className="flink" href={`/${locale}/catalogue?cat=robots`}><i className="fa-solid fa-blender" /> {t('robots')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=acc`}><i className="fa-solid fa-kitchen-set" /> {t('accessories')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=livres`}><i className="fa-solid fa-book-open" /> {t('books')}</Link>
            <Link className="flink" href={`/${locale}/catalogue?cat=packs`}><i className="fa-solid fa-boxes-stacked" /> {t('packs')}</Link>
          </div>
        </div>
        <div>
          <div className="f-col-title">{t('support')}</div>
          <div className="f-links">
            <a className="flink" href="https://wa.me/33756976502" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp" /> {t('whatsapp')}</a>
            <Link className="flink" href={`/${locale}/politique-retour`}><i className="fa-solid fa-rotate-left" /> {t('returns')}</Link>
            <Link className="flink" href={`/${locale}/contact`}><i className="fa-solid fa-headset" /> {t('shipping')}</Link>
            <Link className="flink" href={`/${locale}/cgv`}><i className="fa-solid fa-file-shield" /> {t('cgv')}</Link>
          </div>
        </div>
      </div>
      <div className="f-pay">
        <div className="f-pay-label"><i className="fa-solid fa-lock" /> {t('securePay')}</div>
        <div className="pmb"><i className="fa-brands fa-cc-visa" /> Visa</div>
        <div className="pmb"><i className="fa-brands fa-cc-mastercard" /> Mastercard</div>
        <div className="pmb"><i className="fa-brands fa-apple-pay" /> Apple Pay</div>
        <div className="pmb"><i className="fa-solid fa-building-columns" /> SEPA</div>
        <div className="pmb">Klarna</div>
        <div className="pmb"><i className="fa-solid fa-globe" /> Wise</div>
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
