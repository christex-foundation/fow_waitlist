export type WaitlistPayload = {
  name: string
  email?: string
  phone?: string
  role: 'Freelancer' | 'Client'
  skill?: string
  location?: string
}

export type WaitlistResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Submits the waitlist form to our own serverless endpoint, which holds the
 * Airtable token server-side. The Airtable key is never exposed to the browser.
 */
export async function submitWaitlist(
  payload: WaitlistPayload,
): Promise<WaitlistResult> {
  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null
      return {
        ok: false,
        error: data?.error ?? 'Something went wrong. Please try again.',
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'Could not connect. Check your internet and try again.',
    }
  }
}
