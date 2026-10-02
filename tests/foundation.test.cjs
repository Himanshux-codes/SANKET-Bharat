const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const cache = new Map()
function load(file) {
  file = path.resolve(root, file)
  if (cache.has(file)) return cache.get(file).exports
  const m = new Module(file, module); cache.set(file, m)
  m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file))
  const normal = m.require.bind(m)
  m.require = spec => {
    if (spec.startsWith('.') || spec.startsWith('@/')) {
      const p = spec.startsWith('@/') ? path.join(root, spec.slice(2)) : path.resolve(path.dirname(file), spec)
      for (const ext of ['.ts', '.tsx']) if (fs.existsSync(p + ext)) return load(p + ext)
    }
    return normal(spec)
  }
  m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, file)
  return m.exports
}
const modes = load('lib/data-mode.ts')
const seeds = load('lib/incident-data.ts')
const reports = load('lib/demo-records.ts')
const evaluation = load('lib/evaluation/evaluate-classifier.ts')
const classifier = load('lib/evaluation/disaster-classifier.ts')
const site = load('lib/site-data.ts')
function inspect(value, mode) {
  if (Array.isArray(value)) return value.forEach(v => inspect(v, mode))
  if (!value || typeof value !== 'object') return
  assert.equal(value.dataMode, mode); assert.equal(value.isSimulation, true)
  assert.ok(value.provenance.sourceId); assert.ok(value.provenance.origin)
  for (const p of value.provenance.parents) { assert.equal(p.dataMode, mode); assert.equal(p.isSimulation, true) }
  for (const [key, child] of Object.entries(value)) if (key !== 'provenance') inspect(child, mode)
}
const input = { emergencyType: 'Flood', severity: 'High', location: 'Synthetic place', description: 'Synthetic fixture only' }
const demo = modes.metadata('demo', 'local-form', 'fixture-demo')
const evalTag = modes.metadata('evaluation', 'dataset', 'fixture.csv:1')
const pilot = modes.metadata('pilot', 'local-form', 'future-pilot')
test('all seeds and nested workflow objects explicitly retain demo provenance through JSON reload', () => {
  for (const values of Object.values(seeds)) if (Array.isArray(values)) {
    inspect(values, 'demo'); inspect(JSON.parse(JSON.stringify(values)), 'demo')
  }
  for (const report of seeds.INITIAL_VERIFICATION_QUEUE.filter(r => r.verificationStatus === 'Duplicate')) {
    assert.ok(seeds.INITIAL_INCIDENTS.some(i => i.id === report.canonicalCaseId))
  }
})
test('unknown location and analytical values never become fabricated coordinates/confidence/availability', () => {
  const report = reports.buildDemoReport(input, 'fixture', 'fixture-report')
  inspect(report, 'demo'); assert.equal(report.lat, null); assert.equal(report.lng, null)
  assert.equal(report.confidence, null); assert.equal(report.aiRecommendation.confidence, 'Not available')
  assert.equal(report.aiRecommendation.allocationFactors.availability, 'Not available')
  assert.equal(report.evidence[0].supports, false)
})
test('local IDs are allocated before React updates and differ across calls', () => {
  const ids = Array.from({ length: 100 }, () => reports.localId('DEMO'))
  assert.equal(new Set(ids).size, ids.length); assert.ok(ids.every(Boolean))
})
test('foreign-mode inputs cannot be silently relabelled into local demo intake', () => {
  assert.throws(() => reports.buildDemoReport({ ...input, ...pilot }, 'id', 'rpt'), /relabel/)
  assert.throws(() => reports.buildDemoReport(input, 'id', 'rpt', pilot), /Pilot/)
})
test('pilot and cross-mode nested records fail closed on browser hydration', () => {
  assert.deepEqual(modes.restoreSandbox([{ id: 'pilot', ...pilot }]), [])
  assert.deepEqual(modes.restoreSandbox([{ id: 'mixed', ...demo, evidence: [{ ...evalTag }] }]), [])
  assert.deepEqual(modes.restoreSandbox([{ id: 'hidden-pilot', ...demo, evidence: [{ ...pilot }] }]), [])
})
test('legacy browser data becomes sandbox data, not pilot; prior fake deployment is repaired', () => {
  const original = reports.buildDemoReport(input, 'legacy-id', 'legacy-rpt')
  function strip(v) { if (Array.isArray(v)) return v.map(strip); if (!v || typeof v !== 'object') return v; return Object.fromEntries(Object.entries(v).filter(([k]) => !['dataMode','isSimulation','provenance'].includes(k)).map(([k,v]) => [k,strip(v)])) }
  const [restored] = modes.restoreSandbox([strip({ ...original, status: 'dispatched', lat: 28.5708, lng: 77.326 })])
  const fixed = reports.repairSandboxIncident(restored)
  inspect(fixed, 'demo'); assert.equal(fixed.provenance.origin, 'legacy-browser')
  assert.notEqual(fixed.status, 'dispatched'); assert.equal(fixed.lat, null)
})
test('derivation preserves source lineage and refuses mode mixing', () => {
  const derived = modes.deriveMetadata([demo], 'derived-fixture')
  assert.equal(derived.isSimulation, true); assert.equal(derived.provenance.parents[0].sourceId, 'fixture-demo')
  assert.throws(() => modes.deriveMetadata([demo, evalTag], 'mixed'), /Cross-mode/)
})
test('evidence cannot cross demo/evaluation/pilot boundaries', () => {
  assert.equal(modes.canAttachEvidence(demo, evalTag), false)
  assert.equal(modes.canAttachEvidence(pilot, demo), false)
  assert.equal(modes.canAttachEvidence(pilot, pilot), false)
  assert.equal(modes.canAttachEvidence(demo, modes.metadata('demo','social-simulation','social')), true)
})
test('pilot queues/metrics remain unavailable and all communications are refused', () => {
  assert.throws(() => modes.selectMode([demo, evalTag, pilot], 'pilot'), /unavailable/)
  assert.deepEqual(modes.selectMode([demo, evalTag], 'demo'), [demo])
  for (const record of [demo, evalTag, pilot]) assert.equal(modes.canCommunicate(record), false)
})
test('CSV metrics and classifier-derived records retain evaluation provenance; target is excluded', () => {
  const row = { ...evalTag, id: '1', text: 'synthetic flood fixture', keyword: '', location: '', target: 1 }
  let seen
  const result = evaluation.evaluateClassifier([row], input => { seen = input; return classifier.classifyDisasterText(input) })
  assert.equal('target' in seen, false); inspect(result.results, 'evaluation'); inspect(result.metrics, 'evaluation')
  assert.equal(result.metrics.total, 1); assert.equal(result.results[0].predicted, 1)
  assert.throws(() => evaluation.evaluateClassifier([{ ...row, ...demo }], classifier.classifyDisasterText), /Evaluation/)
})
test('static chart records and generated advisories retain provenance, and pilot advisories are empty', () => {
  for (const key of ['DASHBOARD_WIDGETS','INCIDENT_TIMESERIES','RESPONSE_BY_REGION','DISASTER_MIX','RESPONSE_SLA','STATS','GLOBE_MARKERS','INDIA_INCIDENTS']) inspect(site[key], 'demo')
  const record = reports.buildDemoReport(input, 'advisory-id', 'advisory-rpt')
  inspect(site.getAdvisoriesForIncident(record.id, record), 'demo')
  assert.deepEqual(site.getAdvisoriesForIncident('pilot', { ...record, ...pilot }), [])
})
test('English and Hindi action wording states local-only receipt and no operational capabilities', () => {
  const { translations } = load('lib/i18n/translations.ts')
  assert.match(translations.en.report.successBody, /No authority/)
  assert.match(translations.hi.report.successBody, /किसी प्राधिकरण को नहीं/)
  for (const lang of ['en','hi']) assert.notEqual(translations[lang].report.successHeadline, 'Help is being coordinated.')
})
