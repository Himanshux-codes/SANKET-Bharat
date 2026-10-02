// HTTP/render smoke only. This does not exercise browser interactions or storage.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const path = require('node:path')
const { setTimeout: pause } = require('node:timers/promises')

async function main() {
  const root = path.resolve(__dirname, '..')
  const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', '3101'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })
  let log = ''
  server.stdout.on('data', chunk => { log += chunk })
  server.stderr.on('data', chunk => { log += chunk })
  const exited = new Promise(resolve => server.once('exit', resolve))
  server.on('error', error => { log += error.message })
  const base = 'http://127.0.0.1:3101'
  try {
    let ready = false
    const deadline = Date.now() + 30_000
    while (Date.now() < deadline && server.exitCode === null) {
      try {
        ready = (await fetch(base, { signal: AbortSignal.timeout(1000) })).ok
        if (ready) break
      } catch { /* Readiness probe retries until the local server starts. */ }
      await pause(100)
    }
    assert.ok(ready, `Smoke server did not start: ${log}`)
    for (const route of ['/', '/report', '/admin', '/ai-analysis', '/dashboard', '/live-map', '/evaluation', '/privacy-policy']) {
      const response = await fetch(base + route, { signal: AbortSignal.timeout(5000) })
      assert.equal(response.status, 200, route)
      const html = await response.text()
      assert.match(html, /DEMO ONLY/, route)
      assert.match(html, /Pilot mode is unavailable/, route)
      assert.match(html, /No authority receives a report, message or assignment/, route)
      console.log(`PASS HTTP/render ${route}`)
    }
  } finally {
    if (server.exitCode === null) server.kill('SIGTERM')
    await exited
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
