import { client } from '@/src/sanity/lib/client'
import {
  CUT_PLANS_QUERY,
  CUT_PLANS_BY_CATEGORY_QUERY,
  CATEGORIES_QUERY,
} from '@/src/sanity/lib/queries'
import type {
  CutPlanCard as CutPlanCardType,
  Category,
} from '@/src/sanity/lib/types'
import CutPlanCard from '@/components/customer/CutPlanCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileText, ExternalLink, Camera } from 'lucide-react'

export const revalidate = 60

interface PlansPageProps {
  searchParams: Promise<{ category?: string }>
}

const PlansPage = async ({ searchParams }: PlansPageProps) => {
  const { category } = await searchParams

  const [plans, categories] = await Promise.all([
    category
      ? client.fetch<CutPlanCardType[]>(CUT_PLANS_BY_CATEGORY_QUERY, {
          category,
        })
      : client.fetch<CutPlanCardType[]>(CUT_PLANS_QUERY),
    client.fetch<Category[]>(CATEGORIES_QUERY),
  ])

  const sortedPlans = plans
    ? [
        ...plans.filter((p) => !p.comingSoon),
        ...plans.filter((p) => p.comingSoon),
      ]
    : []
  const hasPlans = sortedPlans.length > 0

  return (
    <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
      {/* Page Header */}
      <div className='mb-12'>
        <h1 className='text-3xl font-bold tracking-tight text-walnut sm:text-4xl'>
          Cut Plans
        </h1>
        <p className='mt-4 max-w-2xl text-lg text-charcoal-light'>
          Detailed PDF cut plans for woodworking projects of all skill levels.
          All plans are free to download.
        </p>
      </div>

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <div className='mb-8'>
          <div className='flex flex-wrap items-center gap-3 pb-6'>
            <span className='text-sm font-medium text-charcoal'>
              Filter by:
            </span>
            <Button
              size='sm'
              className={`rounded-full ${!category ? 'bg-amber text-white hover:bg-amber-light' : 'border border-cream-dark text-charcoal-light hover:border-amber hover:text-amber'}`}
              variant={!category ? 'default' : 'outline'}
              asChild
            >
              <Link href='/plans'>All</Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat._id}
                variant='outline'
                size='sm'
                className={`rounded-full ${category === cat.slug ? 'bg-amber text-white border-amber hover:bg-amber-light' : 'border-cream-dark text-charcoal-light hover:border-amber hover:text-amber'}`}
                asChild
              >
                <Link href={`/plans?category=${cat.slug}`}>{cat.name}</Link>
              </Button>
            ))}
          </div>
          <Separator className='bg-cream-dark' />
        </div>
      )}

      {/* Plans Grid */}
      {hasPlans ? (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {sortedPlans.map((plan) => (
            <CutPlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      ) : category ? (
        <Card className='border-cream-dark bg-cream/50'>
          <CardContent className='p-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light'>
              <FileText className='h-8 w-8' />
            </div>
            <CardTitle className='mb-2 text-walnut'>
              No Plans in This Category
            </CardTitle>
            <CardDescription className='mb-4'>
              Try browsing all plans or selecting a different category.
            </CardDescription>
            <Button className='bg-amber' asChild>
              <Link href='/plans'>View All Plans</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className='border-amber/30 bg-amber/5'>
          <CardContent className='p-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 text-amber'>
              <FileText className='h-8 w-8' />
            </div>
            <CardTitle className='mb-2 text-walnut'>No Plans Yet</CardTitle>
            <CardDescription className='mb-4'>
              Cut plans will appear here once added via Sanity Studio.
            </CardDescription>
            <Button className='bg-amber' asChild>
              <Link href='/studio'>
                Open Sanity Studio
                <ExternalLink className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Show Us Your Build */}
      <div className='mt-16 rounded-2xl bg-walnut px-8 py-10 text-center'>
        <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-cream'>
          <Camera className='h-7 w-7' />
        </div>
        <h2 className='text-2xl font-bold text-cream'>
          Built something from a plan?
        </h2>
        <p className='mt-3 text-cream/80 max-w-xl mx-auto'>
          Send me a picture of your build — I&apos;d love to show it off on the
          site! There&apos;s nothing better than seeing these plans come to life
          in someone&apos;s shop.
        </p>
        <p className='mt-5 text-sm text-cream/60'>
          Drop me a line at{' '}
          <a
            href='mailto:hello@woodgrainandsawdust.com'
            className='font-semibold text-amber hover:text-amber-light underline underline-offset-2'
          >
            hello@woodgrainandsawdust.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default PlansPage
