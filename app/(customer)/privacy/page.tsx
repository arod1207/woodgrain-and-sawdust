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
        Last updated: October 13, 2026
      </p>

      <div className='mt-10 space-y-8 font-body text-charcoal leading-relaxed'>
        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Information Collected
          </h2>
          <p className='mt-2'>
            When you download a cut plan, I ask for your <strong>name</strong>{' '}
            and <strong>email address</strong>. That&rsquo;s the only personal
            information collected for plan downloads. If you use the Designer,
            see the Designer sections below.
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
            Convex). I do not sell or rent your personal information. It&rsquo;s
            only shared with the services that run the site (like hosting,
            sign-in, the database, and payments), and only so they can do that
            job.
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
          <h2 className='text-xl font-semibold text-walnut'>
            The Woodgrain &amp; Sawdust Designer
          </h2>
          <p className='mt-2'>
            The Designer at{' '}
            <a
              href='https://designer.woodgrainandsawdust.com'
              className='text-amber underline hover:text-amber-light'
            >
              designer.woodgrainandsawdust.com
            </a>{' '}
            lets you plan a build and get a cut list and shopping list. The
            sections below explain what it collects and why.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Designer Accounts
          </h2>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>
              An account is optional. You can use the Designer as a guest, and
              your project is saved only in your own browser.
            </li>
            <li>
              Accounts are handled by Clerk (clerk.com). You can sign up with
              your email or with Google. I receive your{' '}
              <strong>name</strong> and <strong>email address</strong>, and if
              you use Google, your <strong>profile picture</strong> too.
            </li>
            <li>
              The same account works on woodgrainandsawdust.com and the
              Designer.
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            What the Designer Stores
          </h2>
          <p className='mt-2'>
            If you have an account, these are stored in Convex (convex.dev),
            the database the Designer runs on:
          </p>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>
              Your projects: the boards, sizes, joints, project names, and a
              small picture (thumbnail) of each project.
            </li>
            <li>
              Your settings: preferred units, any prices you type in for the
              shopping list, and your &ldquo;My Lumber&rdquo; saved board
              sizes.
            </li>
            <li>
              Your plan (Free or Pro) and how many PDF downloads you&rsquo;ve
              used (Free accounts get 3).
            </li>
          </ul>
          <p className='mt-2'>
            I don&rsquo;t sell your personal data or use it for advertising.
          </p>
          {/* TODO(owner): say how long Designer data is kept, e.g. after an account is deleted or after Pro ends. Not covered by the facts provided. */}
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Payments for Designer Pro
          </h2>
          <p className='mt-2'>
            Pro subscriptions are billed through Clerk Billing, and payments
            are processed by Stripe. I never see or store your card number.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Services the Designer Uses
          </h2>
          <p className='mt-2'>
            To run the Designer, your information is handled by these services
            on my behalf:
          </p>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>
              <strong>Netlify</strong> hosts the site.
            </li>
            <li>
              <strong>Clerk</strong> handles sign-in (and{' '}
              <strong>Google</strong>, if you choose to sign in with Google).
            </li>
            <li>
              <strong>Convex</strong> stores your projects and settings.
            </li>
            <li>
              <strong>Stripe</strong>, through Clerk Billing, processes Pro
              payments.
            </li>
          </ul>
          <p className='mt-2'>
            Shopping-list starting prices come from public Home Depot product
            listings, fetched once a week through SerpApi. None of your data is
            sent to them. Prices are estimates, and you can change them.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Browser Storage in the Designer
          </h2>
          <p className='mt-2'>
            The Designer uses your browser&rsquo;s local storage to save guest
            projects and a few preferences, like your units, Advanced mode, and
            whether you&rsquo;ve dismissed the getting-started tour and the
            controls help. Clerk uses cookies to keep you signed in.
          </p>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>
            Your Designer Data
          </h2>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>You can delete your projects yourself in the Designer.</li>
            <li>
              To delete your account and its data, email{' '}
              <a
                href='mailto:hello@woodgrainandsawdust.com'
                className='text-amber underline hover:text-amber-light'
              >
                hello@woodgrainandsawdust.com
              </a>
              .
            </li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-walnut'>Children</h2>
          <p className='mt-2'>
            The Designer isn&rsquo;t directed at children under 13.
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
