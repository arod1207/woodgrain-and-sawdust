import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { generateDownloadToken } from '@/lib/download-tokens'
import {
  sendDownloadConfirmation,
  sendSubscriberNotification,
} from '@/lib/resend'
import { generateUnsubscribeToken } from '@/lib/unsubscribe-token'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_CONVEX_URL',
  )
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 10 lead submissions per IP per 10 minutes.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 10
const EVICTION_INTERVAL_MS = 5 * 60 * 1000
const rateLimitLog = new Map<string, number[]>()
let lastEviction = Date.now()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - RATE_LIMIT_WINDOW_MS

  if (now - lastEviction > EVICTION_INTERVAL_MS) {
    for (const [key, timestamps] of rateLimitLog) {
      const active = timestamps.filter((t) => t > cutoff)
      if (active.length === 0) {
        rateLimitLog.delete(key)
      } else {
        rateLimitLog.set(key, active)
      }
    }
    lastEviction = now
  }

  const timestamps = (rateLimitLog.get(ip) ?? []).filter((t) => t > cutoff)
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, timestamps)
    return true
  }
  rateLimitLog.set(ip, [...timestamps, now])
  return false
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  let body: {
    name?: string
    email?: string
    planId?: string
    planName?: string
    planSlug?: string
    subscribe?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, planId, planName, planSlug, subscribe } = body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400 },
    )
  }
  if (!planId || typeof planId !== 'string') {
    return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
  }
  if (!planName || typeof planName !== 'string') {
    return NextResponse.json(
      { error: 'Plan name is required' },
      { status: 400 },
    )
  }
  if (!planSlug || typeof planSlug !== 'string') {
    return NextResponse.json({ error: 'Plan slug is required' }, { status: 400 })
  }

  const wantsSubscribe = subscribe === true

  try {
    await convex.mutation(api.downloads.recordDownload, {
      name,
      email,
      planId,
      planName,
      subscribe: wantsSubscribe,
    })

    let downloadToken: string
    try {
      downloadToken = generateDownloadToken(planId)
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate download token' },
        { status: 500 },
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://woodgrainandsawdust.com'
    let unsubscribeUrl = `${siteUrl}/plans`
    try {
      const unsubscribeToken = generateUnsubscribeToken(email)
      unsubscribeUrl = `${siteUrl}/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubscribeToken}`
    } catch {
      // UNSUBSCRIBE_SECRET missing — email will have a fallback link; download still completes
    }

    // Fire emails in parallel — don't block the download if they fail.
    const emailTasks: Promise<void>[] = [
      sendDownloadConfirmation({
        toName: name,
        toEmail: email,
        planName,
        planSlug,
        unsubscribeUrl,
      }),
    ]
    if (wantsSubscribe) {
      emailTasks.push(
        sendSubscriberNotification({ subscriberName: name, subscriberEmail: email, planName }),
      )
    }
    Promise.allSettled(emailTasks) // intentionally not awaited

    return NextResponse.json({ success: true, downloadToken })
  } catch {
    return NextResponse.json(
      { error: 'Failed to record download' },
      { status: 500 },
    )
  }
}
