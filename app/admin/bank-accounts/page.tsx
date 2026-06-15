'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

type BankAccount = {
  id: string;
  label: string;
  holder: string;
  iban: string;
  bic: string | null;
  bank: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
};

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--line)',
  borderRadius: 12, padding: 20, marginBottom: 16,
};

function ibanFormat(raw: string) {
  return raw.replace(/(.{4})/g, '$1 ').trim();
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<BankAccount | null>(null);

  const [form, setForm] = useState({
    label: '', holder: 'KitchenPrime', iban: '', bic: '', bank: '', isDefault: false,
  });

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/bank-accounts');
    if (r.ok) setAccounts(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditTarget(null);
    setForm({ label: '', holder: 'KitchenPrime', iban: '', bic: '', bank: '', isDefault: accounts.length === 0 });
    setShowForm(true);
    setError(null);
  }

  function openEdit(a: BankAccount) {
    setEditTarget(a);
    setForm({ label: a.label, holder: a.holder, iban: a.iban, bic: a.bic ?? '', bank: a.bank ?? '', isDefault: a.isDefault });
    setShowForm(true);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = { ...form, iban: form.iban.replace(/\s+/g, '') };

    const url = editTarget
      ? `/api/admin/bank-accounts/${editTarget.id}`
      : '/api/admin/bank-accounts';
    const method = editTarget ? 'PATCH' : 'POST';

    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const d = await r.json();
      setError(d.error || 'Erreur serveur');
    } else {
      setShowForm(false);
      setEditTarget(null);
      await load();
    }
    setSaving(false);
  }

  async function setDefault(id: string) {
    await fetch(`/api/admin/bank-accounts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    });
    await load();
  }

  async function toggleActive(a: BankAccount) {
    await fetch(`/api/admin/bank-accounts/${a.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !a.isActive }),
    });
    await load();
  }

  async function deleteAccount(id: string) {
    if (!confirm('Supprimer ce compte bancaire ?')) return;
    await fetch(`/api/admin/bank-accounts/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <div className="logo">Kitchen<span>Prime</span> Admin</div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 2 }}>
            <Link href="/admin/dashboard" style={{ color: 'var(--indigo)', textDecoration: 'none', fontWeight: 700 }}>
              ← Dashboard
            </Link>
            {' '}&nbsp;·&nbsp; Comptes bancaires
          </div>
        </div>
        <button className="btn-buy" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nouveau compte
        </button>
      </div>

      {/* Info banner */}
      <div style={{ ...card, background: 'var(--indigo-50)', border: '1.5px solid var(--indigo)', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <i className="fa-solid fa-circle-info" style={{ color: 'var(--indigo)', fontSize: 18, marginTop: 2 }} />
          <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--ink)' }}>Le compte marqué "Défaut"</strong> est celui affiché
            aux clients lors du paiement par virement. Vous pouvez en ajouter autant que vous voulez
            (BNP, Wise, CIC, LCL…) et changer le défaut à tout moment — sans redéploiement.
          </div>
        </div>
      </div>

      {/* Formulaire add/edit */}
      {showForm && (
        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', marginBottom: 16 }}>
            {editTarget ? 'Modifier le compte' : 'Ajouter un compte bancaire'}
          </div>
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="fg">
                <label>Libellé *</label>
                <input
                  type="text" required placeholder="ex: BNP Paribas — Principal"
                  value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                />
              </div>
              <div className="fg">
                <label>Titulaire *</label>
                <input
                  type="text" required placeholder="ex: KitchenPrime"
                  value={form.holder} onChange={e => setForm(f => ({ ...f, holder: e.target.value }))}
                />
              </div>
              <div className="fg" style={{ gridColumn: 'span 2' }}>
                <label>IBAN *</label>
                <input
                  type="text" required placeholder="FR76 3000 1234 5678 9012 3456 789"
                  value={form.iban} onChange={e => setForm(f => ({ ...f, iban: e.target.value }))}
                  style={{ fontFamily: 'monospace', letterSpacing: '.05em' }}
                />
              </div>
              <div className="fg">
                <label>BIC / SWIFT</label>
                <input
                  type="text" placeholder="ex: BNPAFRPPXXX"
                  value={form.bic} onChange={e => setForm(f => ({ ...f, bic: e.target.value }))}
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              <div className="fg">
                <label>Nom de la banque</label>
                <input
                  type="text" placeholder="ex: BNP Paribas"
                  value={form.bank} onChange={e => setForm(f => ({ ...f, bank: e.target.value }))}
                />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate)', marginBottom: 14, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={form.isDefault}
                onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))}
                style={{ accentColor: 'var(--indigo)', width: 15, height: 15 }}
              />
              Définir comme compte par défaut (affiché aux clients)
            </label>
            {error && <div style={{ color: 'var(--copper-dark)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-buy" disabled={saving}>
                {saving ? 'Enregistrement…' : (editTarget ? 'Enregistrer' : 'Ajouter le compte')}
              </button>
              <button type="button" className="ck-change" onClick={() => { setShowForm(false); setEditTarget(null); }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des comptes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--mute)' }}>Chargement…</div>
      ) : accounts.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: 48, color: 'var(--mute)' }}>
          <i className="fa-solid fa-building-columns" style={{ fontSize: 36, marginBottom: 12, display: 'block', opacity: .3 }} />
          Aucun compte configuré. Ajoutez votre premier IBAN.
        </div>
      ) : (
        accounts.map(a => (
          <div key={a.id} style={{
            ...card,
            border: a.isDefault ? '2px solid var(--indigo)' : '1px solid var(--line)',
            opacity: a.isActive ? 1 : 0.55,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <i className="fa-solid fa-building-columns" style={{ color: 'var(--indigo)' }} />
                  <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>{a.label}</span>
                  {a.isDefault && (
                    <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--indigo)', color: '#fff', padding: '2px 9px', borderRadius: 20 }}>
                      DÉFAUT
                    </span>
                  )}
                  {!a.isActive && (
                    <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--copper-50)', color: 'var(--copper)', padding: '2px 9px', borderRadius: 20 }}>
                      INACTIF
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 4 }}>
                  <strong>Titulaire :</strong> {a.holder}
                  {a.bank && <> &nbsp;·&nbsp; <strong>Banque :</strong> {a.bank}</>}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, color: 'var(--ink)', fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 }}>
                  {ibanFormat(a.iban)}
                </div>
                {a.bic && (
                  <div style={{ fontSize: 12, color: 'var(--mute)', fontFamily: 'monospace' }}>BIC : {a.bic}</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
                {!a.isDefault && (
                  <button className="btn-buy" style={{ fontSize: 11, padding: '6px 12px' }} onClick={() => setDefault(a.id)}>
                    <i className="fa-solid fa-star" /> Définir défaut
                  </button>
                )}
                <button className="btn-copper" style={{ fontSize: 11, padding: '6px 12px' }} onClick={() => openEdit(a)}>
                  <i className="fa-solid fa-pen" /> Modifier
                </button>
                <button
                  style={{ fontSize: 11, padding: '6px 12px', background: 'var(--indigo-50)', color: 'var(--slate)', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => toggleActive(a)}
                >
                  {a.isActive ? <><i className="fa-solid fa-eye-slash" /> Désactiver</> : <><i className="fa-solid fa-eye" /> Activer</>}
                </button>
                <button
                  style={{ fontSize: 11, padding: '6px 12px', background: '#FEE', color: '#C00', border: '1px solid #FCC', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => deleteAccount(a.id)}
                >
                  <i className="fa-solid fa-trash" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
