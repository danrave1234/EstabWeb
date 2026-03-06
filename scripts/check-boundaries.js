const fs = require("fs")
const path = require("path")

const ROOT = process.cwd()
const SCAN_DIRS = ["app", "components", "lib"]
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git"])
const EXCEPTIONS = new Set([
  "lib/utils/block-props.tsx",
  "lib/utils/dynamic.ts",
])

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/")
}

function collectFiles(dirPath, acc) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      collectFiles(fullPath, acc)
      continue
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      acc.push(fullPath)
    }
  }
}

function getImportSpecifiers(content) {
  const matches = []
  const importFrom = /from\s+['"]([^'"]+)['"]/g
  const dynamicImport = /import\(\s*['"]([^'"]+)['"]\s*\)/g

  for (const regex of [importFrom, dynamicImport]) {
    let match = regex.exec(content)
    while (match) {
      matches.push(match[1])
      match = regex.exec(content)
    }
  }
  return matches
}

function resolveRelativeSource(filePath, source) {
  if (!source.startsWith(".")) return null
  const candidate = path.resolve(path.dirname(filePath), source)
  return toPosixPath(path.relative(ROOT, candidate))
}

function evaluateViolation(fileRelPath, source, resolvedRelSource) {
  const file = toPosixPath(fileRelPath)
  const isApiRoute = file.startsWith("app/api/")
  const isComponent = file.startsWith("components/")
  const isLib = file.startsWith("lib/")

  const sourcePath = source.startsWith("@/")
    ? source.slice(2)
    : resolvedRelSource || source

  const targetsComponents = sourcePath.startsWith("components/")
  const targetsApiRoutes = sourcePath.startsWith("app/api/")
  const targetsApp = sourcePath.startsWith("app/")

  if (isApiRoute && targetsComponents) {
    return "API routes cannot import from components. Move shared logic into lib/."
  }
  if (isComponent && targetsApiRoutes) {
    return "Components cannot import API route modules. Call route handlers via HTTP/actions."
  }
  if (isLib && (targetsApp || targetsComponents)) {
    return "lib/ modules must remain framework-agnostic and cannot import from app/ or components/."
  }
  return null
}

function main() {
  const files = []
  for (const dir of SCAN_DIRS) {
    const full = path.join(ROOT, dir)
    if (fs.existsSync(full)) collectFiles(full, files)
  }

  const violations = []
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8")
    const imports = getImportSpecifiers(content)
    const fileRelPath = path.relative(ROOT, filePath)
    const fileRelPosix = toPosixPath(fileRelPath)
    if (EXCEPTIONS.has(fileRelPosix)) continue
    for (const source of imports) {
      const resolvedRelSource = resolveRelativeSource(filePath, source)
      const violation = evaluateViolation(fileRelPath, source, resolvedRelSource)
      if (violation) {
        violations.push({
          file: fileRelPosix,
          source,
          message: violation,
        })
      }
    }
  }

  if (violations.length === 0) {
    console.log("Boundary check passed.")
    process.exit(0)
  }

  console.error("Boundary check failed:")
  for (const v of violations) {
    console.error(`- ${v.file} imports "${v.source}"`)
    console.error(`  ${v.message}`)
  }
  process.exit(1)
}

main()
