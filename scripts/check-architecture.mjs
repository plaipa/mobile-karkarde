#!/usr/bin/env node
/**
 * Architecture guard for the Feature-Sliced layout described in ARCHITECTURE.md.
 * Run: npm run check:arch   (also part of `npm run verify`)
 *
 * Rules
 *  1. Layers only import downwards:  app > pages > widgets > features > entities > shared
 *  2. Slices on the same layer never import each other (except pairs listed in ALLOWED_SIBLINGS).
 *  3. Reaching into another slice goes through its public API: `@/<layer>/<slice>` (its index.ts),
 *     never `@/<layer>/<slice>/ui/Foo`.
 *  4. Inside a slice use relative imports — importing yourself through the alias creates cycles.
 *  5. `shared` has no slices; anything may import `@/shared/<segment>/<file>` directly.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src')
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] // high -> low

/** "from -> to" slice pairs that may import each other on the same layer. Keep this list tiny. */
const ALLOWED_SIBLINGS = new Set([
  'entities/product -> entities/category', // a product has a category; category is the base taxonomy
])

const IMPORT_RE = /(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (/\.(ts|tsx)$/.test(name)) yield full
  }
}

/** src/pages/home/ui/Hero.tsx -> { layer: 'pages', slice: 'home' } */
function locate(absPath) {
  const [layer, slice] = relative(SRC, absPath).split(sep)
  return { layer, slice: layer === 'shared' || layer === 'app' ? null : slice }
}

const problems = []

for (const file of walk(SRC)) {
  const here = locate(file)
  if (!LAYERS.includes(here.layer)) continue // main.tsx, vite-env.d.ts
  const text = readFileSync(file, 'utf8')
  for (const [, spec] of text.matchAll(IMPORT_RE)) {
    if (!spec.startsWith('@/')) continue
    const parts = spec.slice(2).split('/')
    const [layer, slice, ...rest] = parts
    const fail = (msg) => problems.push(`${relative(SRC, file)}: "${spec}" — ${msg}`)

    if (!LAYERS.includes(layer)) { fail(`unknown layer "${layer}"`); continue }
    if (LAYERS.indexOf(layer) < LAYERS.indexOf(here.layer)) {
      fail(`${here.layer} must not import from higher layer ${layer}`)
      continue
    }
    if (layer === 'shared') continue

    const sameLayer = layer === here.layer
    if (sameLayer && layer === 'app') continue
    if (sameLayer && slice === here.slice) { fail('use a relative import inside the same slice'); continue }
    if (sameLayer && !ALLOWED_SIBLINGS.has(`${here.layer}/${here.slice} -> ${layer}/${slice}`)) {
      fail(`slice "${here.slice}" must not import sibling slice "${slice}" (compose them in a higher layer)`)
      continue
    }
    if (layer !== 'app' && rest.length > 0) fail(`import ${layer}/${slice} through its public API (index.ts), not its internals`)
  }
}

if (problems.length) {
  console.error(`✖ ${problems.length} architecture violation(s):\n` + problems.map((p) => '  - ' + p).join('\n'))
  process.exit(1)
}
console.log('✔ architecture OK — layers, slices and public APIs respected')
