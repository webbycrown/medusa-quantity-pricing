import { readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { spawnSync } from "node:child_process"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = join(root, "src")

function hasTypeScriptSource(dirPath) {
  let entries
  try {
    entries = readdirSync(dirPath, { withFileTypes: true })
  } catch {
    return false
  }

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (hasTypeScriptSource(fullPath)) {
        return true
      }
      continue
    }

    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      return true
    }
  }

  return false
}

if (!hasTypeScriptSource(srcDir)) {
  console.log("prepare: no TypeScript source found, skipping build")
  process.exit(0)
}

const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
})

if (build.status !== 0) {
  process.exit(build.status ?? 1)
}
