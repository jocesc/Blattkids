import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import IntranetLayout from '@/components/intranet/IntranetLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <IntranetLayout displayName={session.displayName}>
      {children}
    </IntranetLayout>
  )
}
