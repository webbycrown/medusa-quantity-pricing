/**
 * Copies Medusa build output (.medusa/server) to dist/ — the only folder published to npm.
 * postinstall copies dist → .medusa/server so Medusa can load the plugin at runtime.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

function removeDeclarationSourceMaps(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      removeDeclarationSourceMaps(path)
      continue
    }
    if (entry.name.endsWith(".d.ts.map")) {
      rmSync(path)
    }
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const buildOutput = join(root, ".medusa", "server")
const medusaOutput = buildOutput
const dist = join(root, "dist")

if (!existsSync(buildOutput)) {
  console.error(
    "sync-dist: .medusa/server not found. Run `npm run build` (medusa plugin:build) first."
  )
  process.exit(1)
}

rmSync(dist, { recursive: true, force: true })
cpSync(buildOutput, dist, { recursive: true })
removeDeclarationSourceMaps(dist)

// Medusa resolves modules from packageRoot/.medusa/server/src (filesystem + exports)
mkdirSync(join(root, ".medusa"), { recursive: true })
rmSync(medusaOutput, { recursive: true, force: true })
cpSync(dist, medusaOutput, { recursive: true })

console.log("sync-dist: dist/ ready; .medusa/server synced for local dev")
