/**
 * Vercel Edge Function — POST /api/waitlist
 *
 * Receives the waitlist form from the browser and writes a row to Airtable.
 * The Airtable token lives only here (as a project env var) and never reaches
 * the client bundle.
 *
 * Required environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   AIRTABLE_TOKEN     Airtable Personal Access Token (secret)
 *   AIRTABLE_BASE_ID   e.g. appXXXXXXXXXXXXXX
 *   AIRTABLE_TABLE     table name, e.g. "Waitlist"  (optional, defaults to "Waitlist")
 */

export const config = { runtime: 'edge' }

type Payload = {
  name?: unknown
  email?: unknown
  phone?: unknown
  role?: unknown
  skill?: unknown
  location?: unknown
  interestArea?: unknown
  assessmentAnswers?: unknown
}

const interestAreas = ['Media', 'Software Engineering', 'Operations & Strategy']

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405)
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
  const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
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
  const interestArea = str(body.interestArea)
  const answers = body.assessmentAnswers

  if (!interestAreas.includes(interestArea)) {
    return json({ error: 'Choose an interest area.' }, 400)
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return json({ error: 'Complete the skills assessment.' }, 400)
  }

  const assessmentAnswers = answers as Record<string, unknown>
  const activityInterests = assessmentAnswers.activityInterests
  const toolsUsed = assessmentAnswers.toolsUsed
  const experienceDescription = str(assessmentAnswers.experienceDescription)
  const scenarioResponse = str(assessmentAnswers.scenarioResponse)
  const supportNeeded = str(assessmentAnswers.supportNeeded)
  const previousExperience = str(assessmentAnswers.previousExperience)
  const otherTool = str(assessmentAnswers.otherTool)

  if (
    !Array.isArray(activityInterests) ||
    activityInterests.length < 1 ||
    activityInterests.length > 2 ||
    !activityInterests.every((answer) => typeof answer === 'string') ||
    !Array.isArray(toolsUsed) ||
    toolsUsed.length < 1 ||
    !toolsUsed.every((answer) => typeof answer === 'string') ||
    !scenarioResponse ||
    !supportNeeded ||
    (interestArea === 'Media' && !experienceDescription) ||
    (interestArea !== 'Media' && previousExperience !== 'Yes' && previousExperience !== 'No') ||
    (interestArea !== 'Media' && previousExperience === 'Yes' && !experienceDescription) ||
    (toolsUsed.includes('Other') && !otherTool)
  ) {
    return json({ error: 'Complete the skills assessment.' }, 400)
  }

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

  const table = encodeURIComponent(AIRTABLE_TABLE ?? 'Waitlist')
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`

  const fields: Record<string, string> = { Name: name, Role: role }
  if (email) fields.Email = email
  if (phone) fields.Phone = phone
  if (skill) fields['Skill / Interest'] = skill
  if (location) fields.Location = location
  fields['Interest Area'] = interestArea
  fields['Assessment Responses'] = JSON.stringify(assessmentAnswers, null, 2)
  fields.Source = new URL(request.url).hostname

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
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
