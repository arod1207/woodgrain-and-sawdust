'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, Loader2 } from 'lucide-react'

interface DownloadFormProps {
  planId: string
  planName: string
  planSlug: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DownloadForm({
  planId,
  planName,
  planSlug,
  open,
  onOpenChange,
}: DownloadFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subscribe, setSubscribe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const resetForm = useCallback(() => {
    setName('')
    setEmail('')
    setSubscribe(false)
    setError('')
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) resetForm()
      onOpenChange(nextOpen)
    },
    [onOpenChange, resetForm],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, planId, planName, planSlug, subscribe }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (!data?.downloadToken) {
        setError('Download unavailable. Please try again.')
        return
      }

      const tokenUrl = `/api/download?planId=${planId}&token=${data.downloadToken}`
      onOpenChange(false)
      resetForm()
      // Imperatively trigger download so the href is always current
      const a = document.createElement('a')
      a.href = tokenUrl
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-walnut'>Download Plan</DialogTitle>
            <DialogDescription className='text-charcoal-light'>
              Enter your name and email to download{' '}
              <span className='font-medium text-charcoal'>{planName}</span>.
              {' '}I&apos;ll also email you a download link good for 7 days — check your spam folder if it doesn&apos;t show up.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='download-name' className='text-charcoal'>
                Name
              </Label>
              <Input
                id='download-name'
                type='text'
                placeholder='Your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='border-cream-dark focus-visible:ring-amber'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='download-email' className='text-charcoal'>
                Email
              </Label>
              <Input
                id='download-email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='border-cream-dark focus-visible:ring-amber'
              />
            </div>

            <div className='flex items-start gap-3'>
              <Checkbox
                id='subscribe'
                checked={subscribe}
                onCheckedChange={(checked) => setSubscribe(checked === true)}
                className='mt-0.5 border-charcoal/50 data-[state=checked]:bg-amber data-[state=checked]:border-amber'
              />
              <Label
                htmlFor='subscribe'
                className='cursor-pointer text-sm leading-snug text-charcoal-light'
              >
                Notify me when new build plans are available
              </Label>
            </div>

            <p className='text-xs text-charcoal-light/70'>
              No spam, ever. This is just a hobby site — I build stuff in my garage and share the plans. That&apos;s it.
            </p>

            {error && <p className='text-sm text-red-600'>{error}</p>}

            <Button
              type='submit'
              size='lg'
              disabled={isSubmitting}
              className='w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light disabled:opacity-50'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  Preparing download...
                </>
              ) : (
                <>
                  <Download className='mr-2 h-5 w-5' />
                  Download Plan
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
