export function inspectWhitespace(text, file = 'input') {
  const normalizedText = text.replaceAll('\r\n', '\n')
  const failures = []

  if (normalizedText.includes('\t')) failures.push(`${file}: tab character`)
  if (!normalizedText.endsWith('\n')) failures.push(`${file}: missing final newline`)

  normalizedText.split('\n').forEach((line, index) => {
    if (/[ \t]+$/.test(line)) failures.push(`${file}:${index + 1}: trailing whitespace`)
  })

  return failures
}
