import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Woodgrain & Sawdust',
  description:
    'Learn how Woodgrain & Sawdust collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
      <h1 className='font-heading text-3xl font-bold text-walnut sm:text-4xl'>
        Privacy Policy
      </h1>
      <p className='mt-2 text-sm text-charcoal-light'>
        Last updated: March 26, 2026
      </p>

      <div className='mt-10 space-y-8 font-body text-charcoal leading-relaxed'>
        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Information Collected
          </h2>
          <p className='mt-2'>
            When you download a cut plan, I ask for your <strong>name</strong>{' '}
            and <strong>email address</strong>. This is the only personal
            information collected.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            How Your Information Is Used
          </h2>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>To deliver the cut plan PDF you requested.</li>
            <li>
              To occasionally send you updates about new plans or woodworking
              tips. You can unsubscribe at any time.
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            How Your Data Is Stored
          </h2>
          <p className='mt-2'>
            Your name and email are stored securely in a database (powered by
            Convex). I do not sell, rent, or share your personal information
            with third parties.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Cookies</h2>
          <p className='mt-2'>
            This site does not use tracking cookies. Essential cookies required
            for the site to function properly may be used.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Your Rights</h2>
          <p className='mt-2'>You have the right to:</p>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>Request a copy of the personal data held about you.</li>
            <li>Request deletion of your personal data.</li>
            <li>Opt out of any marketing communications.</li>
          </ul>
          <p className='mt-2'>
            To exercise any of these rights, please reach out at the email
            address below.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Contact</h2>
          <p className='mt-2'>
            Questions about this privacy policy? Reach out at{' '}
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
