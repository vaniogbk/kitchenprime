import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatEUR } from '@/lib/products';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const [orderCount, paidCount, pendingCount, recent] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'paid' } }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { items: true },
    }),
  ]);

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid var(--line)',
    borderRadius: 12, padding: 18,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <div className="logo">Kitchen<span>Prime</span> Admin</div>
          <div style={{ fontSize: 12, color: 'var(--mute)' }}>Connecté · {session.user.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/orders" className="btn-buy"><i className="fa-solid fa-receipt" /> Commandes</Link>
          <Link href="/admin/products" className="btn-copper"><i className="fa-solid fa-box" /> Produits</Link>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <div style={card}>
          <div style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Commandes totales</div>
          <div className="pdp-price" style={{ fontSize: 28 }}>{orderCount}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Payées</div>
          <div className="pdp-price" style={{ fontSize: 28, color: '#0E7268' }}>{paidCount}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>En attente</div>
          <div className="pdp-price" style={{ fontSize: 28, color: 'var(--copper)' }}>{pendingCount}</div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: 14 }}>Commandes récentes</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--mute)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              <th style={{ padding: '8px 6px' }}>ID</th>
              <th style={{ padding: '8px 6px' }}>Client</th>
              <th style={{ padding: '8px 6px' }}>Statut</th>
              <th style={{ padding: '8px 6px' }}>Total</th>
              <th style={{ padding: '8px 6px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} style={{ borderTop: '1px solid var(--indigo-50)' }}>
                <td style={{ padding: '8px 6px', fontFamily: 'monospace', fontSize: 11 }}>{o.id.slice(0, 8)}…</td>
                <td style={{ padding: '8px 6px' }}>{o.customerName}<div style={{ fontSize: 11, color: 'var(--mute)' }}>{o.customerEmail}</div></td>
                <td style={{ padding: '8px 6px' }}>{o.status}</td>
                <td style={{ padding: '8px 6px', fontWeight: 700 }}>{formatEUR(o.totalCents)}</td>
                <td style={{ padding: '8px 6px', color: 'var(--mute)' }}>{o.createdAt.toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: 'var(--mute)' }}>Aucune commande pour l'instant.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
