import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';

export default function RootPage() {
  const session = getServerSession();

  if (!session) {
    redirect('/login');
  }

  switch (session.role) {
    case 'FOUNDER':
      redirect('/founder/dashboard');
    case 'PRINCIPAL':
      redirect('/principal/dashboard');
    case 'TEACHER':
      redirect('/teacher/dashboard');
    case 'STUDENT':
      redirect('/student/dashboard');
    default:
      redirect('/login');
  }
}
