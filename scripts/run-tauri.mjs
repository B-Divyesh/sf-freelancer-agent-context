import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/@tauri-apps/cli/tauri.js', import.meta.url));
const environment = { ...process.env };

// Tauri's boolean parser accepts "true"/"false", while many build systems use CI=1/0.
if (environment.CI === '1') environment.CI = 'true';
if (environment.CI === '0') environment.CI = 'false';

const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: environment,
  stdio: 'inherit'
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
