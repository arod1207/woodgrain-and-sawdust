'use client'

import { useRef, useState, useCallback } from 'react'
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
import { Download, Loader2 } from 'lucide-react'

interface DownloadFormProps {
  planId: string
  planName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DownloadForm({
  planId,
  planName,
  open,
  onOpenChange,
}: DownloadFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const downloadRef = useRef<HTMLAnchorElement>(null)

  const resetForm = useCallback(() => {
    setName('')
    setEmail('')
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
        body: JSON.stringify({ name, email, planId, planName }),
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
      setDownloadUrl(tokenUrl)
      onOpenChange(false)
      resetForm()
      // Wait a tick so the anchor href updates before clicking
      setTimeout(() => downloadRef.current?.click(), 0)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <a
        ref={downloadRef}
        href={downloadUrl}
        download
        className='hidden'
        aria-hidden
      />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-walnut'>Download Plan</DialogTitle>
            <DialogDescription className='text-charcoal-light'>
              Enter your name and email to download{' '}
              <span className='font-medium text-charcoal'>{planName}</span>.
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
