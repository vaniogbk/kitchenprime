import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatEUR } from '@/lib/products';

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 200,
  });

  return (
    <div>
      <Link href="/admin/dashboard" style={{ fontSize: 13, color: 'var(--indigo)', textDecoration: 'none' }}>
        <i className="fa-solid fa-arrow-left" /> Tableau de bord
      </Link>
      <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 24, fontWeight: 900, margin: '12px 0 18px' }}>Commandes</h1>
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ background: 'var(--indigo-50)' }}>
            <tr style={{ textAlign: 'left', color: 'var(--ink)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              <th style={{ padding: 12 }}>ID</th>
              <th style={{ padding: 12 }}>Client</th>
              <th style={{ padding: 12 }}>Articles</th>
              <th style={{ padding: 12 }}>Statut</th>
              <th style={{ padding: 12 }}>Mode</th>
              <th style={{ padding: 12 }}>Total</th>
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12 }}>Facture</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: '1px solid var(--indigo-50)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 11 }}>{o.id.slice(0, 8)}…</td>
                <td style={{ padding: 12 }}>
                  {o.customerName}
                  <div style={{ fontSize: 11, color: 'var(--mute)' }}>{o.customerEmail}</div>
                  <div style={{ fontSize: 11, color: 'var(--mute)' }}>{o.shippingCity}, {o.shippingCountry}</div>
                </td>
                <td style={{ padding: 12 }}>{o.items.length}</td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 5,
                    background: o.status === 'paid' ? '#D7F0E5' : o.status === 'pending' ? 'var(--copper-50)' : 'var(--indigo-50)',
                    color: o.status === 'paid' ? '#0E7268' : o.status === 'pending' ? 'var(--copper-dark)' : 'var(--indigo-dark)',
                  }}>{o.status}</span>
                </td>
                <td style={{ padding: 12 }}>{o.paymentMethod}</td>
                <td style={{ padding: 12, fontWeight: 700 }}>{formatEUR(o.totalCents)}</td>
                <td style={{ padding: 12, color: 'var(--mute)', fontSize: 12 }}>{o.createdAt.toLocaleDateString('fr-FR')}</td>
                <td style={{ padding: 12 }}>
                  <a href={`/api/orders/${o.id}/receipt`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--indigo)', fontSize: 12 }}>
                    <i className="fa-solid fa-file-pdf" /> PDF
                  </a>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: 'var(--mute)' }}>Aucune commande.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
