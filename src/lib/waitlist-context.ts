import { createContext, useContext } from 'react'

export type WaitlistContextValue = {
  /** Open the waitlist modal, optionally seeding the email field. */
  open: (email?: string) => void
}

export const WaitlistContext = createContext<WaitlistContextValue | null>(null)

export function useWaitlist() {
  const ctx = useContext(WaitlistContext)
  if (!ctx) throw new Error('useWaitlist must be used within a WaitlistProvider')
  return ctx
}
