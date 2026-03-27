import { createHmac } from 'crypto'

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) throw new Error('Missing required environment variable: UNSUBSCRIBE_SECRET')
  return secret
}

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', getSecret()).update(email.toLowerCase()).digest('hex')
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  let expected: string
  try {
    expected = generateUnsubscribeToken(email.toLowerCase())
  } catch {
    return false
  }
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}
