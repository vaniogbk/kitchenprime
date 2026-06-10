import nodemailer from 'nodemailer';

let transporterCache: nodemailer.Transporter | null = null;

function transporter() {
  if (transporterCache) return transporterCache;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials missing (SMTP_HOST/USER/PASS)');
  }

  transporterCache = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporterCache;
}

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  attachments?: nodemailer.SendMailOptions['attachments'];
}) {
  const from = process.env.SMTP_FROM || 'KitchenPrime <noreply@kitchenprime.com>';
  await transporter().sendMail({
    from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    attachments: args.attachments,
  });
}
