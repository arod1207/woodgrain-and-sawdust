import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Woodgrain & Sawdust',
  description:
    'Terms and conditions for using Woodgrain & Sawdust and downloading cut plans.',
}

export default function TermsOfServicePage() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
      <h1 className='font-heading text-3xl font-bold text-walnut sm:text-4xl'>
        Terms of Service
      </h1>
      <p className='mt-2 text-sm text-charcoal-light'>
        Last updated: March 26, 2026
      </p>

      <div className='mt-10 space-y-8 font-body text-charcoal leading-relaxed'>
        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Acceptance of Terms
          </h2>
          <p className='mt-2'>
            By accessing and using Woodgrain &amp; Sawdust, you agree to be
            bound by these terms. If you do not agree, please do not use this
            site.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Use of Cut Plans
          </h2>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>
              All cut plans are provided free of charge for{' '}
              <strong>personal, non-commercial use</strong>.
            </li>
            <li>
              You may not redistribute, resell, or republish the plans without
              written permission.
            </li>
            <li>
              You are welcome to share photos of your finished projects built
              from our plans.
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Disclaimer</h2>
          <p className='mt-2'>
            Woodworking involves inherent risks. Our cut plans are provided{' '}
            <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind.
            Always follow proper safety procedures when using power tools and
            equipment. Woodgrain &amp; Sawdust is not liable for any injuries,
            damages, or losses resulting from the use of our plans.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Intellectual Property
          </h2>
          <p className='mt-2'>
            All content on this site — including cut plans, images, text, and
            design — is the property of Woodgrain &amp; Sawdust and is protected
            by copyright law.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Changes to These Terms
          </h2>
          <p className='mt-2'>
            We may update these terms from time to time. Continued use of the
            site after changes constitutes acceptance of the updated terms.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Contact</h2>
          <p className='mt-2'>
            Questions about these terms? Email us at{' '}
            <a
              href='mailto:hello@woodgrainandsawdust.com'
              className='text-amber underline hover:text-amber-light'
            >
              hello@woodgrainandsawdust.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
