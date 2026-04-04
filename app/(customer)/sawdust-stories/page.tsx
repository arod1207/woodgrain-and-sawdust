import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/src/sanity/lib/client'
import { COMMUNITY_BUILDS_QUERY } from '@/src/sanity/lib/queries'
import type { CommunityBuild } from '@/src/sanity/lib/types'
import { urlFor } from '@/src/sanity/lib/image'
import { Camera, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const revalidate = 60

export const metadata = {
  title: 'Sawdust Stories | Woodgrain & Sawdust',
  description:
    'Real builds from real woodworkers. See what folks have made using our free cut plans.',
}

const SawdustStoriesPage = async () => {
  const builds = await client.fetch<CommunityBuild[]>(COMMUNITY_BUILDS_QUERY)
  const hasBuilds = builds && builds.length > 0

  return (
    <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
      {/* Page Header */}
      <div className='mb-12'>
        <h1 className='text-3xl font-bold tracking-tight text-walnut sm:text-4xl'>
          Sawdust Stories
        </h1>
        <p className='mt-4 max-w-2xl text-lg text-charcoal-light'>
          Real builds from real woodworkers. These plans went from PDF to
          sawdust — and came out looking pretty great.
        </p>
      </div>

      {/* Gallery */}
      {hasBuilds ? (
        <div className='columns-1 gap-6 sm:columns-2 lg:columns-3'>
          {builds.map((build) => {
            const firstImage = build.images?.[0]
            if (!firstImage) return null

            const imgWidth =
              firstImage.asset?.metadata?.dimensions?.width ?? 800
            const imgHeight =
              firstImage.asset?.metadata?.dimensions?.height ?? 600

            return (
              <div key={build._id} className='mb-6 break-inside-avoid'>
                <Card className='overflow-hidden border-cream-dark bg-cream/50'>
                  <div className='relative overflow-hidden bg-cream-dark'>
                    {build.featured && (
                      <div className='absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-amber px-2 py-1 text-xs font-semibold text-white'>
                        <Star className='h-3 w-3 fill-white' />
                        Featured
                      </div>
                    )}
                    <Image
                      src={urlFor(firstImage)
                        .width(imgWidth)
                        .height(imgHeight)
                        .auto('format')
                        .url()}
                      alt={
                        firstImage.alt ??
                        `Build by ${build.builderName}`
                      }
                      width={imgWidth}
                      height={imgHeight}
                      placeholder={
                        firstImage.asset?.metadata?.lqip ? 'blur' : 'empty'
                      }
                      blurDataURL={
                        firstImage.asset?.metadata?.lqip ?? undefined
                      }
                      className='w-full object-cover transition-transform duration-300 hover:scale-105'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>

                  {build.relatedPlan && (
                    <CardContent className='px-4 py-3'>
                      <Link
                        href={`/plans/${build.relatedPlan.slug}`}
                        className='inline-block rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber hover:bg-amber/20 transition-colors'
                      >
                        {build.relatedPlan.name}
                      </Link>
                    </CardContent>
                  )}
                </Card>
              </div>
            )
          })}
        </div>
      ) : (
        <Card className='border-cream-dark bg-cream/50'>
          <CardContent className='p-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light'>
              <Camera className='h-8 w-8' />
            </div>
            <p className='text-lg font-semibold text-walnut'>
              No builds yet — be the first!
            </p>
            <p className='mt-2 text-charcoal-light'>
              Grab a{' '}
              <Link
                href='/plans'
                className='font-medium text-amber hover:underline'
              >
                free plan
              </Link>
              , build something, and send us a photo.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit CTA */}
      <div className='mt-16 rounded-2xl bg-walnut px-8 py-10 text-center'>
        <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-cream'>
          <Camera className='h-7 w-7' />
        </div>
        <h2 className='text-2xl font-bold text-cream'>
          Built something? Show it off!
        </h2>
        <p className='mx-auto mt-3 max-w-xl text-cream/80'>
          Send me a photo of your build and I&apos;ll add it here. Name,
          location, and a caption are totally optional — just a pic works too.
        </p>
        <p className='mt-5 text-sm text-cream/60'>
          Drop me a line at{' '}
          <a
            href='mailto:hello@woodgrainandsawdust.com'
            className='font-semibold text-amber underline underline-offset-2 hover:text-amber-light'
          >
            hello@woodgrainandsawdust.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default SawdustStoriesPage
