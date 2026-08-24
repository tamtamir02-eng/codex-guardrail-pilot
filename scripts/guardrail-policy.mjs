import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const START_MARKER = '<!-- guardrail-policy:red-paths:start -->'
const END_MARKER = '<!-- guardrail-policy:red-paths:end -->'

function globToRegExp(glob) {
  const normalized = glob.replaceAll('\\', '/').toLowerCase()
  let expression = '^'

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index]
    const next = normalized[index + 1]

    if (character === '*' && next === '*') {
      expression += '.*'
      index += 1
    } else if (character === '*') {
      expression += '[^/]*'
    } else {
      expression += character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
  }

  return new RegExp(`${expression}$`)
}

export function extractRedPatterns(policyText) {
  const start = policyText.indexOf(START_MARKER)
  const end = policyText.indexOf(END_MARKER)

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('RISK_POLICY.md is missing the guardrail-policy RED path block')
  }

  const block = policyText.slice(start + START_MARKER.length, end)
  const patterns = [...block.matchAll(/^\s*-\s+`([^`]+)`\s*$/gm)].map((match) => match[1])

  if (patterns.length === 0) throw new Error('RISK_POLICY.md declares no RED paths')
  return patterns
}

export function classifyChangedFiles(changedFiles, policyText) {
  const patterns = extractRedPatterns(policyText)
  const matchers = patterns.map((pattern) => ({ pattern, matcher: globToRegExp(pattern) }))
  const redMatches = []

  for (const originalPath of changedFiles) {
    const path = originalPath.replaceAll('\\', '/').toLowerCase()
    for (const { pattern, matcher } of matchers) {
      if (matcher.test(path)) redMatches.push({ path: originalPath, pattern })
    }
  }

  return {
    classification: redMatches.length > 0 ? 'RED' : 'GREEN/YELLOW',
    redMatches
  }
}

function changedFilesBetween(baseSha, headSha) {
  const result = spawnSync('git', ['diff', '--name-only', '-z', baseSha, headSha], {
    encoding: 'utf8',
    shell: false
  })

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || 'git diff failed')
  }

  return result.stdout.split('\0').filter(Boolean)
}

function main() {
  const [baseSha, headSha] = process.argv.slice(2)
  if (!baseSha || !headSha) throw new Error('usage: guardrail-policy <base-sha> <head-sha>')

  const policyText = readFileSync('RISK_POLICY.md', 'utf8')
  const changedFiles = changedFilesBetween(baseSha, headSha)
  const result = classifyChangedFiles(changedFiles, policyText)

  console.log(`Changed files evaluated: ${changedFiles.length}`)
  console.log(`Risk classification: ${result.classification}`)

  if (result.classification === 'RED') {
    for (const match of result.redMatches) {
      console.error(`RED path: ${match.path} (matched ${match.pattern})`)
    }
    console.error('RED change detected: security approval required.')
    process.exitCode = 1
  } else {
    console.log('guardrail-policy passed: no RED path changes detected.')
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    main()
  } catch (error) {
    console.error(`guardrail-policy failed closed: ${error.message}`)
    process.exitCode = 1
  }
}
