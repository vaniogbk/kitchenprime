import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="f-logo">
            Kitchen<span>Prime</span>
          </div>
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
            <a className="flink" href="#"><i className="fa-solid fa-blender" /> {t('robots')}</a>
            <a className="flink" href="#"><i className="fa-solid fa-kitchen-set" /> {t('accessories')}</a>
            <a className="flink" href="#"><i className="fa-solid fa-book-open" /> {t('books')}</a>
            <a className="flink" href="#"><i className="fa-solid fa-boxes-stacked" /> {t('packs')}</a>
          </div>
        </div>
        <div>
          <div className="f-col-title">{t('support')}</div>
          <div className="f-links">
            <a className="flink" href="#"><i className="fa-brands fa-whatsapp" /> {t('whatsapp')}</a>
            <a className="flink" href="#"><i className="fa-solid fa-truck-fast" /> {t('shipping')}</a>
            <a className="flink" href="#"><i className="fa-solid fa-rotate-left" /> {t('returns')}</a>
            <a className="flink" href="#"><i className="fa-solid fa-file-shield" /> {t('cgv')}</a>
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
          <a href="#">{t('legal')}</a>
          <a href="#">{t('privacy')}</a>
          <a href="#">{t('cgv')}</a>
        </div>
      </div>
    </footer>
  );
}
