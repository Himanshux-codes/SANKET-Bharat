import { test, expect, type Page } from '@playwright/test'
import type { Incident } from '../../lib/incident-types'

const routes = ['/', '/report', '/admin', '/ai-analysis', '/dashboard', '/live-map', '/evaluation', '/privacy-policy']
const syntheticDescription = 'Synthetic browser regression fixture. No real emergency.'

async function records(page: Page): Promise<Incident[]> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sanket_incidents') || '[]'))
}

async function submitExample(page: Page) {
  await page.goto('/report')
  await page.getByRole('textbox', { name: 'Manual location' }).fill('Synthetic unknown-coordinate place')
  await page.getByPlaceholder('Describe the situation, visible damage, hazards and anything responders should know...').fill(syntheticDescription)
  await page.getByRole('button', { name: 'Add Local Demo Report' }).click()
  await expect(page.getByRole('heading', { name: 'Added to this browser demo.' })).toBeVisible()
  await expect(page.getByText('No authority has received this example.', { exact: false })).toBeVisible()
  await expect(page.getByText('No help, dispatch or communication was arranged.', { exact: false })).toBeVisible()
  await expect.poll(async () => (await records(page)).filter(r => r.description === syntheticDescription).length).toBeGreaterThan(0)
  return (await records(page)).find(r => r.description === syntheticDescription)!
}

test.beforeEach(async ({ page }) => {
  // Isolate synthetic checks from analytics, font and remote visual assets.
  await page.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:3100'
    ? route.continue() : route.abort())
  page.on('pageerror', error => { throw error })
})

for (const route of routes) {
  test(`route ${route} loads with the demo-only boundary`, async ({ page }, testInfo) => {
    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
    const notice = page.getByRole('complementary', { name: 'Demo limitations' })
    await expect(notice).toContainText('DEMO ONLY')
    await expect(notice).toContainText('No authority receives a report, message or assignment.')
    await expect(notice).toContainText('Pilot mode is unavailable.')
    // The shared layout is the first main; several existing routes nest their own main.
    await expect(page.locator('main').first()).toBeVisible()
    await expect(page.getByText('Loading demo', { exact: false })).toHaveCount(0)
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
      await page.screenshot({ path: testInfo.outputPath(`${width}.png`), fullPage: true, animations: 'disabled' })
    }
  })
}

test('local receipt, report review and recommendation approval never dispatch or contain', async ({ page }) => {
  const first = await submitExample(page)
  expect(first.dataMode).toBe('demo')
  expect(first.isSimulation).toBe(true)
  expect(first.provenance.origin).toBe('local-form')
  expect(first.lat).toBeNull()
  expect(first.lng).toBeNull()
  await page.getByRole('button', { name: 'Submit another report' }).click()
  await page.getByRole('button', { name: 'Add Local Demo Report' }).click()
  await expect.poll(async () => (await records(page)).filter(r => r.description === syntheticDescription).length).toBe(2)
  const examples = (await records(page)).filter(r => r.description === syntheticDescription)
  expect(new Set(examples.map(r => r.id)).size).toBe(2)
  expect(new Set(examples.map(r => r.reportId)).size).toBe(2)

  await page.goto('/admin')
  const report = page.locator('article').filter({ hasText: first.reportId! })
  await report.getByRole('button', { name: 'Approve', exact: true }).click()
  await expect.poll(async () => (await records(page)).find(r => r.id === first.id)?.verificationStatus).toBe('Verified')
  let current = (await records(page)).find(r => r.id === first.id)!
  expect(current.status).toBe(first.status)
  expect(current.humanDecision).toEqual(first.humanDecision)
  expect(current.teams).toBe(0)
  expect(current.assignedTeam).toBe(first.assignedTeam)
  await report.getByRole('button', { name: 'Reject', exact: true }).click()
  await expect.poll(async () => (await records(page)).find(r => r.id === first.id)?.verificationStatus).toBe('Rejected')
  current = (await records(page)).find(r => r.id === first.id)!
  expect(current.status).toBe(first.status)
  expect(current.assignedTeam).toBe(first.assignedTeam)

  await page.goto(`/ai-analysis?id=${first.id}`)
  const recommendation = page.getByText('Template review in a sandbox. No authenticated authority, assignment or communication.', { exact: true }).locator('..')
  await recommendation.getByRole('button', { name: 'Modify', exact: true }).click()
  const modifiedAction = 'Synthetic human revision; no assignment authorized.'
  await page.getByRole('textbox', { name: 'Modify recommendation before approval' }).fill(modifiedAction)
  await page.getByRole('button', { name: 'Save modified recommendation' }).click()
  await recommendation.getByRole('button', { name: 'Approve', exact: true }).click()
  await expect.poll(async () => (await records(page)).find(r => r.id === first.id)?.humanDecision.status).toBe('Approved')
  current = (await records(page)).find(r => r.id === first.id)!
  expect(current.humanDecision.finalAction).toBe(modifiedAction)
  expect(current.status).toBe(first.status)
  expect(current.teams).toBe(0)
  expect(current.assignedTeam).toBe(first.assignedTeam)
  expect(current.dataMode).toBe('demo')
  expect(current.humanDecision.isSimulation).toBe(true)
})

test('social simulation is visibly fictional and remains non-corroborating after reload', async ({ page }) => {
  const incident = await submitExample(page)
  await page.goto(`/ai-analysis?id=${incident.id}`)
  await expect(page.getByText('Generated examples only. No social API access, verification or corroboration. Available only for demo records.')).toBeVisible()
  await page.getByRole('button', { name: 'Attach fictional note' }).first().click()
  await expect(page.getByRole('button', { name: 'Fictional note attached' }).first()).toBeVisible()
  await expect.poll(async () => (await records(page)).find(r => r.id === incident.id)?.evidence.filter(e => e.provenance.origin === 'social-simulation').length).toBe(1)
  await page.reload()
  await page.getByRole('button', { name: 'View Illustrative Notes', exact: false }).click()
  await expect(page.getByText('Illustrative note · not corroboration').first()).toBeVisible()
  const note = (await records(page)).find(r => r.id === incident.id)!.evidence.find(e => e.provenance.origin === 'social-simulation')!
  expect(note.dataMode).toBe('demo')
  expect(note.isSimulation).toBe(true)
  expect(note.supports).toBe(false)
  expect(note.verification).toBe('illustrative')
  expect(note.reliability).toBe('Unknown')
  expect(note.summary).toMatch(/^Fictional example:/)
})

test('unknown coordinates do not add a map pin', async ({ page }) => {
  await page.goto('/live-map')
  const pins = page.locator('svg[aria-label="Illustrative demo incident map of India"] [role="button"]')
  await expect.poll(() => pins.count()).toBeGreaterThan(0)
  const originalCount = await pins.count()
  const incident = await submitExample(page)
  await page.goto('/live-map')
  await expect(pins).toHaveCount(originalCount)
  expect(await pins.evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label')))).not.toContain(`${incident.city}, ${incident.state} — ${incident.severity} ${incident.kind}`)
  expect((await records(page)).find(r => r.id === incident.id)?.lat).toBeNull()
  expect((await records(page)).find(r => r.id === incident.id)?.lng).toBeNull()
})

test('pilot records and URL parameters cannot enable a pilot queue', async ({ page }) => {
  await page.goto('/admin')
  await expect.poll(async () => (await records(page)).length).toBeGreaterThan(0)
  await page.evaluate(() => {
    const seed = JSON.parse(localStorage.getItem('sanket_incidents')!)[0]
    const pilot = { ...seed, id: 'BLOCKED-PILOT-FIXTURE', dataMode: 'pilot', isSimulation: false }
    localStorage.setItem('sanket_incidents', JSON.stringify([pilot]))
    localStorage.setItem('sanket_queue', JSON.stringify([pilot]))
  })
  await page.goto('/admin?mode=pilot')
  await expect(page.getByRole('complementary', { name: 'Demo limitations' })).toContainText('Pilot mode is unavailable.')
  await expect.poll(async () => (await records(page)).length).toBeGreaterThan(0)
  expect((await records(page)).every(r => r.dataMode === 'demo' && r.isSimulation && r.id !== 'BLOCKED-PILOT-FIXTURE')).toBe(true)
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sanket_queue') || '[]').length)).toBe(0)
  await expect(page.getByRole('button', { name: /enter pilot|enable pilot|switch to pilot/i })).toHaveCount(0)
})
