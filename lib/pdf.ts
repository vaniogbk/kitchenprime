import PDFDocument from 'pdfkit';
import { formatEUR } from './products';

export type ReceiptItem = {
  name: string;
  ref: string;
  qty: number;
  priceCents: number;
};

export type Receipt = {
  orderId: string;
  date: Date;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  items: ReceiptItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export function generateReceiptPdf(r: Receipt): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(22).fillColor('#1A1F5E').text('KitchenPrime', { continued: true })
       .fillColor('#B8622A').text(' SAS');
    doc.moveDown(0.2);
    doc.fontSize(9).fillColor('#8A90B0').text('Revendeur officiel Thermomix TM7 — Europe');
    doc.moveDown(1.5);

    // Order meta
    doc.fontSize(14).fillColor('#1A1F5E').text(`Facture #${r.orderId}`);
    doc.fontSize(9).fillColor('#4A5070').text(`Date : ${r.date.toLocaleDateString('fr-FR')}`);
    doc.moveDown();

    // Customer
    doc.fontSize(10).fillColor('#1A1F5E').text('Adresse de livraison', { underline: true });
    doc.fontSize(9).fillColor('#4A5070')
      .text(r.customer.name)
      .text(r.customer.address)
      .text(`${r.customer.zip} ${r.customer.city}`)
      .text(r.customer.country)
      .text(r.customer.email);
    doc.moveDown(1.5);

    // Items table
    doc.fontSize(10).fillColor('#1A1F5E').text('Produits', { underline: true });
    doc.moveDown(0.5);
    r.items.forEach((it) => {
      doc.fontSize(10).fillColor('#1A1F5E').text(`${it.name} (×${it.qty})`, { continued: true });
      doc.fillColor('#4A5070').text(`  · Réf. ${it.ref}`, { continued: true });
      doc.fillColor('#1A1F5E').text(
        formatEUR(it.priceCents * it.qty),
        { align: 'right' },
      );
    });
    doc.moveDown();

    // Totals
    doc.fontSize(10).fillColor('#4A5070')
      .text('Sous-total', { continued: true })
      .text(formatEUR(r.subtotalCents), { align: 'right' });
    doc.text('Livraison', { continued: true })
      .text(r.shippingCents === 0 ? 'Gratuite' : formatEUR(r.shippingCents), { align: 'right' });
    doc.text('TVA (20%)', { continued: true })
      .text('Incluse', { align: 'right' });
    doc.moveDown(0.3);
    doc.fontSize(13).fillColor('#1A1F5E')
      .text('Total TTC', { continued: true })
      .text(formatEUR(r.totalCents), { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(8).fillColor('#8A90B0')
      .text('Garantie 2 ans incluse · Livraison express 48h · Retour sous 14 jours', { align: 'center' });
    doc.text('© 2026 KitchenPrime SAS — Tous droits réservés.', { align: 'center' });

    doc.end();
  });
}
