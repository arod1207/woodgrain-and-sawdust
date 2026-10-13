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
        Last updated: October 13, 2026
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
              from these plans.
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Disclaimer</h2>
          <p className='mt-2'>
            Woodworking involves inherent risks. Cut plans are provided{' '}
            <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind.
            Always follow proper safety procedures when using power tools and
            equipment. Woodgrain &amp; Sawdust is not liable for any injuries,
            damages, or losses resulting from the use of these plans.
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
            The Woodgrain &amp; Sawdust Designer
          </h2>
          <p className='mt-2'>
            These terms also cover the Designer at{' '}
            <a
              href='https://designer.woodgrainandsawdust.com'
              className='text-amber underline hover:text-amber-light'
            >
              designer.woodgrainandsawdust.com
            </a>
            . You can use it as a guest or with an optional free account. A
            Free account can keep up to 3 projects and download 3 PDFs.
          </p>
          {/* TODO(owner): add what happens if someone misuses the Designer (e.g. whether accounts can be suspended). Not covered by the facts provided. */}
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Designer Pro Subscriptions
          </h2>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>
              Pro costs <strong>$3.99/month</strong> or{' '}
              <strong>$35.88/year</strong> (USD). It&rsquo;s billed through
              Clerk Billing, and payments are processed by Stripe.
            </li>
            <li>
              Pro starts with a <strong>7-day free trial</strong>. A card is
              required to start it. Cancel any time before the 7 days end and
              you won&rsquo;t be charged.
            </li>
            <li>
              After the trial, Pro <strong>renews automatically</strong> each
              month or year until you cancel.
            </li>
            <li>
              You can cancel any time from the pricing page (&ldquo;Manage your
              subscription&rdquo;). Pro stays on until the end of the period
              you&rsquo;ve paid for.
            </li>
            <li>
              If Pro ends, you keep all your projects. Any projects beyond the
              free limit of 3 become read-only. They&rsquo;re never deleted.
            </li>
          </ul>
          {/* TODO(owner): say whether and how you'll give notice before changing Pro prices. Not covered by the facts provided. */}
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Refunds</h2>
          <p className='mt-2'>
            If you ask within <strong>14 days of your first payment</strong>{' '}
            (the first charge after your free trial), you&rsquo;ll get a full
            refund. After that, payments aren&rsquo;t refunded, but you can
            cancel any time to stop future charges. To request a refund, email{' '}
            <a
              href='mailto:hello@woodgrainandsawdust.com'
              className='text-amber underline hover:text-amber-light'
            >
              hello@woodgrainandsawdust.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Your Designs</h2>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>You own the projects you create in the Designer.</li>
            <li>
              Starter templates and the Woodgrain &amp; Sawdust plans are
              provided for you to customize for personal use.
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Designer Estimates
          </h2>
          <p className='mt-2'>
            The Designer gives planning estimates: sizes, cut lists, and
            prices. You&rsquo;re responsible for checking your measurements
            before you cut and for building safely.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Changes to These Terms
          </h2>
          <p className='mt-2'>
            These terms may be updated from time to time. Continued use of the
            site after changes constitutes acceptance of the updated terms.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Contact</h2>
          <p className='mt-2'>
            Questions about these terms? Reach out at{' '}
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
