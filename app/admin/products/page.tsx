import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatEUR } from '@/lib/products';

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div>
      <Link href="/admin/dashboard" style={{ fontSize: 13, color: 'var(--indigo)', textDecoration: 'none' }}>
        <i className="fa-solid fa-arrow-left" /> Tableau de bord
      </Link>
      <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 24, fontWeight: 900, margin: '12px 0 18px' }}>Produits</h1>
      <div style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 16 }}>
        Les modifications passent par l'API <code>PATCH /api/admin/products</code> (slug + champs). Une interface d'édition complète peut être ajoutée ici.
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ background: 'var(--indigo-50)' }}>
            <tr style={{ textAlign: 'left', color: 'var(--ink)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              <th style={{ padding: 12 }}>Réf.</th>
              <th style={{ padding: 12 }}>Nom</th>
              <th style={{ padding: 12 }}>Catégorie</th>
              <th style={{ padding: 12 }}>Prix</th>
              <th style={{ padding: 12 }}>Ancien</th>
              <th style={{ padding: 12 }}>Badge</th>
              <th style={{ padding: 12 }}>Actif</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--indigo-50)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 11 }}>{p.ref}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: 12 }}>{p.category}</td>
                <td style={{ padding: 12, fontWeight: 700 }}>{formatEUR(p.priceCents)}</td>
                <td style={{ padding: 12, color: 'var(--mute)' }}>{p.oldPriceCents ? formatEUR(p.oldPriceCents) : '—'}</td>
                <td style={{ padding: 12 }}>{p.badgeLabel || '—'}</td>
                <td style={{ padding: 12 }}>{p.active ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
