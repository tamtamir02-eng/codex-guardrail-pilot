import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

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
  if (text.includes('\t')) failures.push(`${file}: tab character`)
  if (!text.endsWith('\n')) failures.push(`${file}: missing final newline`)
  text.split('\n').forEach((line, index) => {
    const content = line.endsWith('\r') ? line.slice(0, -1) : line
    if (/[ \t]+$/.test(content)) failures.push(`${file}:${index + 1}: trailing whitespace`)
  })
}

if (failures.length) {
  for (const failure of failures) console.error(failure)
  process.exitCode = 1
} else {
  console.log(`LINT PASSED (${files.length} files)`)
}
