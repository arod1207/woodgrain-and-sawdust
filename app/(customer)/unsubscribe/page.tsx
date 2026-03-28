import { fetchMutation } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ e?: string; t?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { e: email, t: token } = await searchParams

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50'>
          <XCircle className='h-8 w-8 text-red-400' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-walnut'>Invalid Link</h1>
        <p className='mb-6 max-w-sm text-charcoal-light'>
          This unsubscribe link is invalid or has already been used. If you need
          help, reply to any email from us.
        </p>
        <Link href='/' className='text-sm font-medium text-amber hover:text-amber-light'>
          Back to home
        </Link>
      </div>
    )
  }

  try {
    await fetchMutation(api.downloads.unsubscribeByEmail, { email })
  } catch {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50'>
          <XCircle className='h-8 w-8 text-red-400' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-walnut'>Something went wrong</h1>
        <p className='mb-6 max-w-sm text-charcoal-light'>
          Your request couldn&apos;t be processed. Please try again later or reply
          to any email from Woodgrain &amp; Sawdust.
        </p>
        <Link href='/' className='text-sm font-medium text-amber hover:text-amber-light'>
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
      <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage/15'>
        <CheckCircle className='h-8 w-8 text-sage' />
      </div>
      <h1 className='mb-2 text-2xl font-bold text-walnut'>You&apos;re unsubscribed</h1>
      <p className='mb-6 max-w-sm text-charcoal-light'>
        <span className='font-medium text-charcoal'>{email}</span> has been
        removed from future plan announcements. You can still download free
        plans anytime.
      </p>
      <Link
        href='/plans'
        className='rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-light'
      >
        Browse plans
      </Link>
    </div>
  )
}
