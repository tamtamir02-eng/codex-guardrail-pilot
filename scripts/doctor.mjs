import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const requiredFiles = [
  '.guardrail/VERSION',
  '.codex/rules/high-blast-radius.rules',
  '.github/CODEOWNERS.example',
  '.github/pull_request_template.md',
  '.github/workflows/guardrail-v4-ci.yml',
  'AGENTS.md',
  'RISK_POLICY.md',
  'README.md',
  'auth/access-policy.js',
  'package.json',
  'scripts/guardrail-policy.mjs',
  'scripts/whitespace-policy.mjs',
  'src/order-total.js',
  'tests/access-policy.test.js',
  'tests/guardrail-policy.test.js',
  'tests/order-total.test.js',
  'tests/whitespace-policy.test.js'
]
const forbiddenDirectories = ['hooks', 'agents', '.codex/hooks', '.codex/agents']
const forbiddenNameParts = ['attestation', 'receipt', 'fingerprint', 'circuit_breaker']
const failures = []

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`missing ${file}`)
}
for (const directory of forbiddenDirectories) {
  if (existsSync(directory)) failures.push(`forbidden custom component ${directory}`)
}

function inspectNames(directory = '.') {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue
    const path = join(directory, entry.name)
    const lowerName = entry.name.toLowerCase()
    if (entry.isFile() && forbiddenNameParts.some((part) => lowerName.includes(part))) {
      failures.push(`forbidden evidence component name ${path}`)
    }
    if (entry.isDirectory()) inspectNames(path)
  }
}
inspectNames()

if (existsSync('package.json')) {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  for (const script of ['lint', 'test', 'test:regression', 'build', 'doctor']) {
    if (typeof packageJson.scripts?.[script] !== 'string') failures.push(`missing npm script ${script}`)
  }
}

if (existsSync('.github/workflows/guardrail-v4-ci.yml')) {
  const workflow = readFileSync('.github/workflows/guardrail-v4-ci.yml', 'utf8')
  for (const marker of ['pull_request:', 'synchronize', 'github.event.pull_request.head.sha', 'contents: read', 'guardrail-policy:', 'scripts/guardrail-policy.mjs']) {
    if (!workflow.includes(marker)) failures.push(`workflow lacks ${marker}`)
  }
  if (workflow.includes('pull_request_target')) failures.push('workflow uses pull_request_target')
}

if (existsSync('RISK_POLICY.md')) {
  const riskPolicy = readFileSync('RISK_POLICY.md', 'utf8')
  for (const marker of ['guardrail-policy:red-paths:start', 'guardrail-policy:red-paths:end', 'HUMAN REVIEW REQUIRED']) {
    if (!riskPolicy.includes(marker)) failures.push(`risk policy lacks ${marker}`)
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`)
  process.exitCode = 1
} else {
  console.log('DOCTOR PASSED: repo-native V4 pilot contract is intact')
}
