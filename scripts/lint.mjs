import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

import { inspectWhitespace } from './whitespace-policy.mjs'

const roots = ['src', 'auth', 'tests', 'scripts']
const extensions = new Set(['.js', '.mjs'])
const files = []

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) collect(path)
    if (entry.isFile() && extensions.has(extname(entry.name))) files.push(path)
  }
}

for (const root of roots) collect(root)

const failures = []
for (const file of files.sort()) {
  const text = readFileSync(file, 'utf8')
  failures.push(...inspectWhitespace(text, file))
}

if (failures.length) {
  for (const failure of failures) console.error(failure)
  process.exitCode = 1
} else {
  console.log(`LINT PASSED (${files.length} files)`)
}
