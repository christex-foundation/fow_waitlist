import { useCallback, useState, type ReactNode } from 'react'
import { WaitlistContext } from '../lib/waitlist-context'
import WaitlistModal from './WaitlistModal'

export default function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [prefillEmail, setPrefillEmail] = useState('')
  // Bumped on each open so the modal remounts with fresh form/submission state.
  const [openId, setOpenId] = useState(0)

  const open = useCallback((email?: string) => {
    setOpenId((n) => n + 1)
    setPrefillEmail(email ?? '')
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <WaitlistContext.Provider value={{ open }}>
      {children}
      <WaitlistModal
        key={openId}
        isOpen={isOpen}
        prefillEmail={prefillEmail}
        onClose={close}
      />
    </WaitlistContext.Provider>
  )
}
