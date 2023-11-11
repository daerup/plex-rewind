import { metaDescription } from '@/utils/constants'
import Link from 'next/link'
import Title from './title'

export const metadata = {
  title: 'Plex rewind',
  description: metaDescription,
}

export default function Page() {
  const isRewindDisabled = process.env.NEXT_PUBLIC_IS_REWIND_DISABLED === 'true'
  const isDashboardDisabled =
    process.env.NEXT_PUBLIC_IS_DASHBOARD_DISABLED === 'true'

  return (
    <div className='text-center'>
      <Title />

      {!isRewindDisabled && (
        <Link href='/rewind/totals' className='button mx-auto mb-4'>
          Get started
        </Link>
      )}

      {!isDashboardDisabled && (
        <Link
          href='/dashboard/shows'
          className={
            isRewindDisabled
              ? 'button mx-auto'
              : 'text-slate-300 hover:opacity-75'
          }
        >
          Dashboard
        </Link>
      )}
    </div>
  )
}