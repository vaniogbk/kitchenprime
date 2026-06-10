import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminIndex() {
  const session = await getServerSession(authOptions);
  redirect(session?.user ? '/admin/dashboard' : '/admin/login');
}
