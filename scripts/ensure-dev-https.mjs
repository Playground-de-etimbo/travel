import { existsSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const certDir = path.resolve(process.cwd(), '.cert')
const certFile = path.join(certDir, 'localhost.pem')
const keyFile = path.join(certDir, 'localhost-key.pem')

if (existsSync(certFile) && existsSync(keyFile)) {
  process.exit(0)
}

const mkcertProbe = spawnSync('mkcert', ['-help'], { encoding: 'utf8' })
if (mkcertProbe.error || mkcertProbe.status !== 0) {
  console.error('\nHTTPS setup requires mkcert before running pnpm dev.\n')
  console.error('Install mkcert using one of these commands:')
  console.error('- macOS:    brew install mkcert')
  console.error('- Ubuntu:   sudo apt install mkcert')
  console.error('- Windows:  choco install mkcert\n')
  console.error('Then run: pnpm dev\n')
  process.exit(1)
}

mkdirSync(certDir, { recursive: true })

const installCA = spawnSync('mkcert', ['-install'], { stdio: 'inherit' })
if (installCA.status !== 0) {
  console.error(
    '\nFailed to trust the local CA. Run `pnpm https:setup` in an interactive terminal and complete any password prompts.\n'
  )
  process.exit(installCA.status ?? 1)
}

const generateCert = spawnSync(
  'mkcert',
  [
    '-key-file',
    keyFile,
    '-cert-file',
    certFile,
    'localhost',
    '127.0.0.1',
    '::1',
  ],
  { stdio: 'inherit' }
)

if (generateCert.status !== 0) {
  process.exit(generateCert.status ?? 1)
}

console.log('\nGenerated trusted local HTTPS certs in .cert/\n')
