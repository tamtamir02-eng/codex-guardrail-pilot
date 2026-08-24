import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
for (const script of ['lint', 'test', 'build', 'doctor']) {
  if (typeof packageJson.scripts?.[script] !== 'string') {
    throw new Error(`package.json is missing the ${script} script`)
  }
}

const files = []
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) collect(path)
    if (entry.isFile() && ['.js', '.mjs'].includes(extname(entry.name))) files.push(path)
  }
}

for (const root of ['src', 'auth']) collect(root)
for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ['--check', file], {
    encoding: 'utf8',
    shell: false
  })
  if (result.status !== 0) {
    process.stderr.write(result.stderr)
    process.exit(result.status ?? 1)
  }
}

console.log(`BUILD VALIDATION PASSED (${files.length} application files)`)
