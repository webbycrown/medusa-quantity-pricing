/**
 * After npm install, Medusa resolves plugins from `.medusa/server/src`.
 * Published packages ship `dist/` only; this copies dist → .medusa/server.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
const medusaOutput = join(root, ".medusa", "server")

if (!existsSync(dist)) {
  process.exit(0)
}

mkdirSync(join(root, ".medusa"), { recursive: true })
rmSync(medusaOutput, { recursive: true, force: true })
cpSync(dist, medusaOutput, { recursive: true })
