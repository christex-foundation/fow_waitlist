/**
 * Cloudflare Pages Function — POST /api/waitlist
 *
 * Receives the waitlist form from the browser and writes a row to Airtable.
 * The Airtable token lives only here (as a secret env var) and never reaches
 * the client bundle.
 *
 * Required environment variables (set in Cloudflare Pages → Settings → Variables):
 *   AIRTABLE_TOKEN     Airtable Personal Access Token (secret)
 *   AIRTABLE_BASE_ID   e.g. appXXXXXXXXXXXXXX
 *   AIRTABLE_TABLE     table name, e.g. "Waitlist"  (optional, defaults to "Waitlist")
 */

interface Env {
  AIRTABLE_TOKEN: string
  AIRTABLE_BASE_ID: string
  AIRTABLE_TABLE?: string
}

type Payload = {
  name?: unknown
  email?: unknown
  phone?: unknown
  role?: unknown
  skill?: unknown
  location?: unknown
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID) {
    return json({ error: 'Server is not configured.' }, 500)
  }

  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const name = str(body.name)
  const email = str(body.email)
  const phone = str(body.phone)
  const role = str(body.role)
  const skill = str(body.skill)
  const location = str(body.location)

  // Validation mirrors the client: name required, and at least one contact.
  if (name.length < 2) {
    return json({ error: 'Please enter your name.' }, 400)
  }
  if (!email && !phone) {
    return json({ error: 'Add an email or a phone number.' }, 400)
  }
  if (role !== 'Freelancer' && role !== 'Client') {
    return json({ error: 'Invalid role.' }, 400)
  }

  const table = encodeURIComponent(env.AIRTABLE_TABLE ?? 'Waitlist')
  const url = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${table}`

  const fields: Record<string, string> = { Name: name, Role: role }
  if (email) fields.Email = email
  if (phone) fields.Phone = phone
  if (skill) fields['Skill / Interest'] = skill
  if (location) fields.Location = location
  fields.Source = new URL(request.url).hostname

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  })

  if (!res.ok) {
    // Avoid leaking Airtable internals to the client.
    return json({ error: 'Could not save right now. Please try again.' }, 502)
  }

  return json({ ok: true })
}
