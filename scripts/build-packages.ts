import { exec } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'

const __dirname = new URL('.', import.meta.url).pathname
const require = createRequire(import.meta.url)

const root = resolve(__dirname, '..')
const packagesRoot = resolve(__dirname, '../packages')

interface Package<
  Pkg extends Record<string, unknown> = Record<string, unknown>,
> {
  pkg: Pkg
  name: string
  directory: string
}

function findPackages(root: string): Package[] {
  const directories = readdirSync(root, { withFileTypes: true })
    .filter((ent) => ent.isDirectory())
    .map((ent) => resolve(root, ent.name))

  const packageDirectories = directories.filter((dir) =>
    existsSync(resolve(dir, 'package.json')),
  )
  const nonPackageDirectories = directories.filter(
    (dir) => !packageDirectories.includes(dir),
  )

  const packages = packageDirectories.map((dir) => {
    const p = resolve(dir, 'package.json')
    const pkg = require(p)
    if (!pkg.name) {
      throw new Error(`Missing name in ${p}`)
    }

    return { pkg, name: pkg.name ?? '', directory: dir }
  })

  const nestedPackages = nonPackageDirectories.flatMap(findPackages)

  return ([...packages, ...nestedPackages] as Package[]).sort((a, b) =>
    a.name.startsWith('@modernice/') ? -1 : a.name <= b.name ? -1 : 1,
  )
}

function extractDependencies(pkg: Package, packages: Package[]) {
  const deps = Object.keys(pkg.pkg.dependencies || {})
  return packages.filter((candidate) => deps.includes(candidate.name))
}

async function run() {
  const packages = findPackages(packagesRoot)

  for (const pkg of packages) {
    await build(pkg, packages)
  }
}

const builds = new Map<string, Promise<void>>()

async function build(pkg: Package, packages: Package[]) {
  if (builds.has(pkg.name)) {
    return builds.get(pkg.name)
  }

  function _build() {
    return new Promise<void>((res) => {
      buildDependencies(pkg, packages).then(() => {
        const relativePath = pkg.directory.replace(`${packagesRoot}/`, '')

        console.info(`\nBuilding ${pkg.name} ...`)
        const process = exec(`pnpm -C packages/${relativePath} build`, {
          cwd: root,
        })
        const { stdout, stderr } = process

        stdout!.on('data', console.log)
        stderr!.on('data', console.error)
        process.on('exit', () => res())
      })
    })
  }

  const b = _build()
  builds.set(pkg.name, b)
  await b
}

async function buildDependencies(pkg: Package, packages: Package[]) {
  const deps = extractDependencies(pkg, packages)
  if (!deps.length) {
    return
  }

  console.info(
    `\nBuilding dependencies of ${pkg.name}:\n\t${deps
      .map((d) => d.name)
      .join(', ')}`,
  )

  for (const pkg of deps) {
    await build(pkg, packages)
  }
}

run()
