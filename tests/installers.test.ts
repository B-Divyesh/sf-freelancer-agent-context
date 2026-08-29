import { afterEach, describe, expect, it } from 'vitest';
import { chmod, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectMacArchitecture, platformAssets } from '../src/release';

const temporary: string[] = [];
afterEach(async () => Promise.all(temporary.splice(0).map(path => rm(path, {recursive:true, force:true}))));

describe('release installers', () => {
  it('@claim:platform-install selects Mac architecture and installs an executable Linux AppImage', async () => {
    const assets = [
      {name:'Client.Context.Firewall_0.1.3_aarch64.dmg', browser_download_url:'https://example/arm'},
      {name:'Client.Context.Firewall_0.1.3_x64.dmg', browser_download_url:'https://example/intel'}
    ];
    const intelAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
    const armAgent = 'Mozilla/5.0 (Macintosh; arm64 Mac OS X 14_0)';
    expect(detectMacArchitecture(intelAgent)).toBe('x64');
    expect(platformAssets(assets, 'macOS', intelAgent)[0].name).toContain('_x64.dmg');
    expect(platformAssets(assets, 'macOS', armAgent)[0].name).toContain('_aarch64.dmg');
    const root = await mkdtemp(join(tmpdir(), 'ccf-installer-test-')); temporary.push(root);
    const mocks = join(root, 'mocks'); const bin = join(root, 'bin');
    await import('node:fs/promises').then(fs => Promise.all([fs.mkdir(mocks), fs.mkdir(bin)]));
    const payload = 'verified-appimage';
    const digest = '565ca0065869f19fb6f475bc79597664d18402914b09becec92f44fd9af71a22';
    const curl = `#!/bin/sh\ncase "$*" in\n  *releases/latest*) printf '%s' '{"assets":[{"name":"Client.Context.Firewall_0.1.3_amd64.AppImage","browser_download_url":"https://example/Client.Context.Firewall_0.1.3_amd64.AppImage"},{"name":"SHA256SUMS","browser_download_url":"https://example/SHA256SUMS"}]}' ;;\n  *SHA256SUMS*) printf '%s\\n' '${digest}  Client.Context.Firewall_0.1.3_amd64.AppImage' ;;\n  *) while [ "$#" -gt 0 ]; do if [ "$1" = "-o" ]; then shift; printf '%s' '${payload}' > "$1"; exit 0; fi; shift; done ;;\nesac\n`;
    const uname = "#!/bin/sh\nprintf '%s\\n' Linux\n";
    await writeFile(join(mocks, 'curl'), curl); await writeFile(join(mocks, 'uname'), uname);
    await chmod(join(mocks, 'curl'), 0o755); await chmod(join(mocks, 'uname'), 0o755);
    const result = spawnSync('sh', ['public/install.sh'], {cwd:process.cwd(), encoding:'utf8', env:{...process.env, PATH:`${mocks}:${bin}:${process.env.PATH}`, XDG_BIN_HOME:bin}});
    expect(result.status, result.stderr).toBe(0);
    const installed = join(bin, 'client-context-firewall');
    expect(await readFile(installed, 'utf8')).toBe(payload);
    expect((await stat(installed)).mode & 0o111).toBe(0o111);
  });
});
