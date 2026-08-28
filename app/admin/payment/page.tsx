'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ProcessorName } from '@/lib/processors/types';
import { Icon, type IconName } from '@/components/ui/Icon';

type ProcessorInfo = { label: string; icon: IconName; envKeys: string[] };
type SettingsData = { active: ProcessorName; processors: Record<ProcessorName, ProcessorInfo> };

const WEBHOOK_PATHS: Record<ProcessorName, string> = {
  stripe: '/api/webhooks/stripe',
  mollie: '/api/webhooks/mollie',
  adyen: '/api/webhooks/adyen',
  sumup: '/api/webhooks/sumup',
};

const PROCESSOR_COLORS: Record<ProcessorName, string> = {
  stripe: '#635BFF',
  mollie: '#FF6640',
  adyen: '#0ABF53',
  sumup: '#1D1D1B',
};

const SETUP_GUIDES: Record<ProcessorName, { url: string; steps: string[] }> = {
  stripe: {
    url: 'https://dashboard.stripe.com',
    steps: [
      'Créez un compte sur dashboard.stripe.com',
      'Allez dans Developers → API keys → copiez Secret key',
      'Ajoutez STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY dans Vercel',
      'Dans Developers → Webhooks → Add endpoint → URL ci-dessus → event: checkout.session.completed',
      'Copiez le Signing secret → STRIPE_WEBHOOK_SECRET dans Vercel',
      'Configurez votre IBAN dans Settings → Payouts → Bank account',
    ],
  },
  mollie: {
    url: 'https://my.mollie.com',
    steps: [
      'Créez un compte sur my.mollie.com',
      'Allez dans Developers → API keys → copiez la Live API key',
      'Ajoutez MOLLIE_API_KEY dans Vercel',
      'Le webhook est automatiquement configuré par KitchenPrime',
      'Configurez votre IBAN dans Settings → Bank accounts',
    ],
  },
  adyen: {
    url: 'https://ca-live.adyen.com',
    steps: [
      'Ouvrez un compte merchant sur ca-live.adyen.com (processus KYC)',
      'Allez dans Developers → API credentials → créez une clé avec rôle Checkout Web',
      'Ajoutez ADYEN_API_KEY et ADYEN_MERCHANT_ACCOUNT dans Vercel',
      'Dans Developers → Webhooks → Standard webhook → URL ci-dessus',
      'Copiez le HMAC key → ADYEN_WEBHOOK_HMAC dans Vercel',
      'Ajoutez ADYEN_ENV=live (ou test pour sandbox) dans Vercel',
      'Configurez votre IBAN dans Finance → Bank accounts',
    ],
  },
  sumup: {
    url: 'https://me.sumup.com',
    steps: [
      'Créez un compte sur me.sumup.com',
      'Allez dans Profile → Account → API Keys → créez une clé',
      'Ajoutez SUMUP_API_KEY dans Vercel',
      'Trouvez votre Merchant code dans Profile → Account → copiez → SUMUP_MERCHANT_CODE',
      'Dans Settings → Webhooks → ajoutez l\'URL ci-dessus pour les events de paiement',
      'Configurez votre IBAN dans Finance → Payout settings',
    ],
  },
};

export default function PaymentPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [switching, setSwitching] = useState<ProcessorName | null>(null);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setData);
    setAppUrl(window.location.origin);
  }, []);

  async function activate(name: ProcessorName) {
    setSwitching(name);
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeProcessor: name }),
    });
    setData(d => d ? { ...d, active: name } : d);
    setSwitching(null);
  }

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 22, marginBottom: 18,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <div className="logo">Kitchen<span>Prime</span> Admin</div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 2 }}>
            <Link href="/admin/dashboard" style={{ color: 'var(--indigo)', textDecoration: 'none', fontWeight: 700 }}>← Dashboard</Link>
            {' '}&nbsp;·&nbsp; Processeurs de paiement
          </div>
        </div>
      </div>

      <div style={{ ...card, background: 'var(--indigo-50)', border: '1.5px solid var(--indigo)', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="bolt" style={{ color: 'var(--indigo)', fontSize: 18, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--ink)' }}>Basculement instantané.</strong> Cliquez sur « Activer » pour changer de processeur —
            toutes les nouvelles commandes card utiliseront ce processeur immédiatement, sans redéploiement.
            Les commandes en cours ne sont pas affectées.
          </div>
        </div>
      </div>

      {!data ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--mute)' }}>Chargement…</div>
      ) : (
        (Object.entries(data.processors) as [ProcessorName, ProcessorInfo][]).map(([name, info]) => {
          const isActive = data.active === name;
          const guide = SETUP_GUIDES[name];
          const color = PROCESSOR_COLORS[name];
          const webhookUrl = appUrl + WEBHOOK_PATHS[name];

          return (
            <div key={name} style={{
              ...card,
              border: isActive ? `2px solid ${color}` : '1px solid var(--line)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 20, flexShrink: 0,
                  }}>
                    <Icon name={info.icon} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {info.label}
                      {isActive && (
                        <span style={{ fontSize: 10, fontWeight: 800, background: color, color: '#fff', padding: '2px 9px', borderRadius: 20 }}>
                          ACTIF
                        </span>
                      )}
                    </div>
                    <a href={guide.url} target="_blank" rel="noopener" style={{ fontSize: 12, color: 'var(--mute)', textDecoration: 'none' }}>
                      {guide.url} <Icon name="arrow-up-right-from-square" style={{ fontSize: 10 }} />
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {!isActive && (
                    <button
                      onClick={() => activate(name)}
                      disabled={switching !== null}
                      style={{
                        background: color, color: '#fff', border: 'none', borderRadius: 8,
                        padding: '8px 18px', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                        opacity: switching !== null ? 0.6 : 1,
                      }}
                    >
                      {switching === name ? 'Activation…' : 'Activer'}
                    </button>
                  )}
                  {isActive && (
                    <span style={{ fontSize: 12, color, fontWeight: 800 }}>
                      <Icon name="circle-check" /> En service
                    </span>
                  )}
                </div>
              </div>

              {/* Webhook URL */}
              <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--indigo-50)', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                  URL Webhook à configurer chez {info.label}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--ink)', wordBreak: 'break-all' }}>
                  {appUrl ? webhookUrl : '(chargement…)'}
                </div>
              </div>

              {/* Variables d'environnement */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
                  Variables Vercel requises
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {info.envKeys.map(k => (
                    <code key={k} style={{
                      fontSize: 11, background: '#F4F4F6', color: 'var(--ink)',
                      padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace',
                    }}>{k}</code>
                  ))}
                </div>
              </div>

              {/* Guide d'activation */}
              <details style={{ marginTop: 14 }}>
                <summary style={{ fontSize: 12, color: 'var(--indigo)', fontWeight: 700, cursor: 'pointer', userSelect: 'none' }}>
                  Guide d&rsquo;activation {info.label}
                </summary>
                <ol style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.7, margin: '10px 0 0 16px', padding: 0 }}>
                  {guide.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </details>
            </div>
          );
        })
      )}
    </div>
  );
}
