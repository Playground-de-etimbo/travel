import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('ensure-dev-https script', () => {
  it('fails with clear guidance when mkcert is unavailable', () => {
    const repoRoot = path.resolve(__dirname, '../../..')
    const scriptPath = path.join(repoRoot, 'scripts/ensure-dev-https.mjs')
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'destino-https-test-'))
    const run = spawnSync(process.execPath, [scriptPath], {
      cwd: tempDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: '',
      },
    })
    fs.rmSync(tempDir, { recursive: true, force: true })

    expect(run.status).toBe(1)
    expect(run.stderr).toContain(
      'HTTPS setup requires mkcert before running pnpm dev.'
    )
    expect(run.stderr).toContain('brew install mkcert')
  })
})
