import './style.css';
import { clearDemo, getStorageError, loadState, removeWorkspaceScope, saveState } from './store';
import { detectPlatform, platformAssets, type ReleaseAsset } from './release';
import type { AppState, Connector, Source, Workspace } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const status = document.querySelector<HTMLDivElement>('#route-status')!;
const BILLING = 'https://api.sociobot.in/api/v1/products/freelancer-agent-context';
const REPO = 'B-Divyesh/sf-freelancer-agent-context';
let state: AppState;
let demo = false;
let notice = '';
let licenseNotice = false;
let initialRoute = true;
let licenseVerification: { token: string; promise: Promise<boolean> } | null = null;
type NativeLaunchRequest = {
  sessionId: string; workspaceId: string; workspaceName: string; sourceId: string; sourceLabel: string;
  connector: Connector; folder: string; selectedSources: Source[]; brief: string; writingRule: string;
  redactionRules: { term: string; replacement: string }[]; checkedDraft: string;
};
type PreparedSession = {
  id: string; workspaceId: string; sourceIds: string[]; checks: string[];
  requests: Map<string, NativeLaunchRequest>; profileDirs: Map<string, string>;
};
let preparedSession: PreparedSession | null = null;

const isDesktop = () => '__TAURI_INTERNALS__' in window;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]!));
const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

function header(): string {
  return `<header class="site-header">
    <a class="wordmark nav-link" href="/"><span class="mark">CF</span><span>Client Context Firewall</span></a>
    <nav aria-label="Main navigation"><a class="nav-link" href="/demo">Demo</a><a class="nav-link" href="/app">Workspace</a><a class="nav-link" href="/privacy">Privacy</a></nav>
  </header>`;
}

function footer(): string {
  return `<footer><p>Keep each client’s work in its own workspace.</p><nav aria-label="Footer"><a class="nav-link" href="/privacy">Privacy</a><a class="nav-link" href="/terms">Terms</a><a class="nav-link" href="/art-provenance">Art provenance</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav><p class="build">v0.1.7</p></footer>`;
}

function setMeta(title: string, description: string, path: string): void {
  document.title = title;
  const canonical = `https://freelancer-agent-context.sociobot.in${path}`;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = description;
}

function icon(name: 'check'|'arrow'|'lock'|'export'): string {
  const paths = {
    check: '<path d="m5 12 4 4L19 6"/>', arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    lock: '<rect x="5" y="10" width="14" height="10"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    export: '<path d="M12 3v12m-5-5 5 5 5-5M5 19h14"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
}

function landing(): void {
  setMeta('Client Context Firewall — Keep client work apart', 'Keep each client’s sources, rules, and delivery record in one local workspace.', '/');
  app.innerHTML = `${header()}<main id="main" tabindex="-1">
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">A local desktop boundary for freelancers</p><h1 tabindex="-1">Keep client work from crossing over</h1>
        <p class="lede">For freelance developers who switch clients without mixing sources, accounts, or writing style.</p>
        <div class="hero-actions"><a class="button primary nav-link" href="/?demo=1">Try it with sample data ${icon('arrow')}</a><span>See a checked client session next.</span></div>
        <ul class="facts"><li>${icon('lock')} Browser workspaces stay on this device.</li><li>${icon('check')} Works offline after your first visit.</li><li><span aria-hidden="true">$</span> Free for two workspaces. Pro is $19 once.</li></ul>
      </div>
      <figure class="hero-art"><div class="plate-label">Two client folders kept separate</div><img src="/art/boundary-ledger.webp" srcset="/art/boundary-ledger-600.webp 600w, /art/boundary-ledger.webp 1200w" sizes="(max-width: 980px) 100vw, 50vw" width="1200" height="800" fetchpriority="high" decoding="async" alt="Two paper client folders sit on opposite sides of an orange divider."><figcaption>Separate briefs, source accounts, and rules before work begins.</figcaption></figure>
    </section>
    <section class="preview-section" aria-labelledby="preview-title"><div><p class="eyebrow">Live product preview</p><h2 id="preview-title">Preview a checked client session</h2><p>The desktop app opens each agent with a separate client profile: one sign-in and settings folder for that client.</p></div>
      <div class="preview" role="img" aria-label="Northstar workspace with two allowed sources and three passed boundary checks">
        <div class="preview-tabs"><span>NS</span><span class="inactive">JL</span></div><div class="preview-sheet"><p class="stamp">NORTHSTAR / SESSION READY</p><h3>Sources in this session</h3><p>Codex · northstar/reorder <b>client profile</b></p><p>Claude · Wholesale briefs <b>client profile</b></p><ol class="check-list"><li>Client profile is separate</li><li>No other client names found</li><li>Two redaction rules loaded</li></ol></div>
      </div>
    </section>
    <section class="steps" aria-labelledby="steps-title"><p class="eyebrow">How it works</p><h2 id="steps-title">How the client check works</h2><ol><li><span>01</span><h3>Name the workspace</h3><p>Add the brief and writing rules that belong to one client.</p><figure><img src="/screens/01-scope.webp" width="760" height="509" loading="lazy" decoding="async" alt="The sample workspace lists two Northstar sources."><figcaption>Start with the client brief and source folders.</figcaption></figure></li><li><span>02</span><h3>Choose each source</h3><p>Choose a local folder and agent for this client.</p><figure><img src="/screens/02-block.webp" width="760" height="243" loading="lazy" decoding="async" alt="A session is blocked after text checks fail."><figcaption>Another client name or redaction term stops the session.</figcaption></figure></li><li><span>03</span><h3>Launch and export</h3><p>Open every selected agent in its client profile, then export the delivery record.</p><figure><img src="/screens/03-pass.webp" width="760" height="340" loading="lazy" decoding="async" alt="A clean session passes all boundary checks."><figcaption>A delivery record appears after every selected agent opens.</figcaption></figure></li></ol></section>
    <section class="limits" aria-labelledby="limits-title"><div><p class="eyebrow">Clear limits</p><h2 id="limits-title">What the app checks</h2></div><div><p>The desktop app separates each client’s agent credentials and settings in a client profile.</p><p>Your chosen agent may use its own online service.</p><p>The text check catches named clients and redaction terms before launch.</p></div></section>
    <section class="downloads" aria-labelledby="download-title"><div><p class="eyebrow">Desktop app</p><h2 id="download-title">Install the desktop app</h2><p>Choose the package for your system when releases are published.</p></div><div id="download-panel" class="download-panel" aria-live="polite"><p>Checking the latest release…</p></div></section>
    <section class="pricing" aria-labelledby="price-title"><div><p class="eyebrow">Pro license</p><h2 id="price-title">Pro pricing</h2><p class="price"><strong>$19</strong> once</p><p>Pro lets you create more than two workspaces. Checks and delivery exports remain available on the free plan.</p></div><div class="purchase"><a class="button primary" href="${BILLING}/checkout">Buy Pro ${icon('arrow')}</a><button class="button secondary" id="restore-license">Restore Pro license</button><p>Checkout is handled by Sociobot.</p><p><a href="mailto:support@sociobot.in?subject=Client%20Context%20Firewall%20refund">Request a refund from Sociobot</a></p><p><a class="nav-link" href="/terms">Read purchase terms</a></p></div></section>
  </main>${footer()}`;
  wireShared();
  document.querySelector('#restore-license')?.addEventListener('click', showLicensePrompt);
  // Release metadata is useful, but it is not part of the first mobile task.
  // Start it after the initial visual and input work have settled, rather than
  // allowing an off-origin JSON response to contend with the cold render.
  window.setTimeout(() => void loadDownload(), 3000);
}

async function loadDownload(): Promise<void> {
  const panel = document.querySelector<HTMLDivElement>('#download-panel'); if (!panel) return;
  const platform = detectPlatform(navigator.userAgent);
  try {
    const cacheKey = 'ccf:release'; const cached = JSON.parse(localStorage.getItem(cacheKey) ?? '{}');
    const release = Date.now() - cached.savedAt < 3600000 ? cached.data : await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=1`).then(response => { if (!response.ok) throw new Error('release unavailable'); return response.json(); }).then(items => { if (!items[0]) throw new Error('release unavailable'); return items[0]; });
    localStorage.setItem(cacheKey, JSON.stringify({savedAt: Date.now(), data: release}));
    const assets = platformAssets((release.assets ?? []) as ReleaseAsset[], platform, navigator.userAgent);
    if (!assets[0]) throw new Error('asset unavailable');
    const macChoices = platform === 'macOS' && assets.length > 1
      ? `<div class="download-choices">${assets.slice(1).map(asset => `<a href="${escapeHtml(asset.browser_download_url)}">Download ${/aarch64|arm64/i.test(asset.name) ? 'Apple silicon' : 'Intel'} build</a>`).join('')}</div>`
      : '';
    const installNote = platform === 'Linux'
      ? `<p>One-step install: <code>curl -fsSL https://freelancer-agent-context.sociobot.in/install.sh | sh</code></p><p>For a direct AppImage download, run <code>chmod +x ${escapeHtml(assets[0].name)}</code> before opening it.</p>`
      : platform === 'macOS' ? '<p>Choose Apple silicon or Intel when both builds are listed.</p>' : '';
    panel.innerHTML = `<p class="stamp">DETECTED · ${platform.toUpperCase()}</p><a class="button primary" href="${escapeHtml(assets[0].browser_download_url)}">Download for ${platform} ${icon('arrow')}</a><p>${escapeHtml(assets[0].name)}</p>${macChoices}${installNote}`;
  } catch {
    panel.innerHTML = `<p class="stamp">DETECTED · ${platform.toUpperCase()}</p><p>Downloads are being published.</p><a class="button secondary" href="https://github.com/${REPO}/releases">Open the release page ${icon('arrow')}</a>`;
  }
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button id="reset-demo">Reset demo</button><a class="nav-link" href="/app">Start for real</a></aside>`;
}

function workspaceShell(): string {
  const active = state.workspaces.find(w => w.id === state.activeId) ?? state.workspaces[0];
  return `${header()}${demo ? demoBanner() : ''}<main id="main" class="workbench" tabindex="-1">
    <section class="app-heading"><div><p class="eyebrow">${demo ? 'Sample workspace' : 'Local workspace'}</p><h1 tabindex="-1">${active ? 'Check this client session' : 'Create your first client workspace'}</h1></div><div class="heading-actions">${!demo ? '<button class="text-button" id="export-workspace">Export workspace</button><button class="text-button" id="import-workspace">Import workspace</button>' : ''}<div class="state-chip">${navigator.onLine ? 'Device local' : 'Offline · device local'}</div></div></section>
    ${notice ? `<div class="notice" role="status">${escapeHtml(notice)}${licenseNotice ? ' <a class="nav-link" href="/">Buy Pro</a>' : ''}</div>` : ''}
    ${active ? renderActive(active) : renderEmpty()}
  </main>${footer()}`;
}

function renderEmpty(): string {
  return `<section class="empty-state"><div class="empty-mark" aria-hidden="true">01</div><h2>No client workspaces yet</h2><p>Your brief, sources, rules, and delivery records will appear here.</p><button class="button primary" id="new-workspace">Create a workspace</button></section>${workspaceDialog()}`;
}

function renderActive(active: Workspace): string {
  const sessions = state.sessions.filter(s => s.workspaceId === active.id);
  return `<div class="app-grid">
    <aside class="client-rail" aria-label="Client workspaces"><div class="rail-title">Clients <button id="new-workspace" aria-label="Create a workspace">+</button></div><div class="client-tabs" role="tablist" aria-label="Choose a client">${state.workspaces.map(w => `<button role="tab" aria-selected="${w.id === active.id}" tabindex="${w.id === active.id ? '0' : '-1'}" data-workspace="${w.id}"><b>${escapeHtml(w.code)}</b><span>${escapeHtml(w.name)}</span></button>`).join('')}</div></aside>
    <section class="session-sheet" aria-labelledby="client-name"><div class="sheet-head"><div><p class="eyebrow">Active boundary</p><h2 id="client-name">${escapeHtml(active.name)}</h2></div><button class="text-button danger" id="delete-workspace">Delete workspace</button></div>
      <div class="brief-block"><h3>Client brief</h3><p>${escapeHtml(active.brief)}</p><h3>Writing rule</h3><p>${escapeHtml(active.voice)}</p></div>
      <details class="boundary-editor"><summary>Edit the client boundary</summary><form id="boundary-form"><label class="field"><span>Client brief</span><textarea name="brief" required rows="3">${escapeHtml(active.brief)}</textarea></label><label class="field"><span>Writing rule</span><input name="voice" value="${escapeHtml(active.voice)}" required></label><button class="button secondary" type="submit">Save brief</button></form><form id="source-form"><h3>Add a source</h3><label class="field"><span>Source label</span><input name="label" required></label><label class="field"><span>Local folder</span><input name="folder" required placeholder="/path/to/client/project"><small>The desktop launcher opens the agent in this folder.</small></label><label class="field"><span>Coding agent</span><select name="connector"><option value="codex">Codex CLI</option><option value="claude">Claude Code</option><option value="gemini">Gemini CLI</option></select></label><label class="field"><span>Account reminder <small>(optional)</small></span><input name="account"><small>This label is not used as proof. Sign in inside the client profile.</small></label><label class="field"><span>Source type</span><select name="kind"><option>Git</option><option>Drive</option><option>Chat</option><option>Folder</option></select></label><button class="button secondary" type="submit">Add source</button></form><form id="rule-form"><h3>Add a redaction rule</h3><label class="field"><span>Text to find</span><input name="term" required></label><label class="field"><span>Replacement</span><input name="replacement" value="[REDACTED]" required></label><button class="button secondary" type="submit">Add rule</button></form></details>
      <form id="preflight-form"><fieldset><legend>Sources in this session</legend>${active.sources.map((s, index) => `<label class="source-row"><input type="checkbox" name="source" value="${s.id}" ${index === 0 ? 'checked' : ''}><span><b>${escapeHtml(s.kind)} · ${escapeHtml(s.label)}</b><small>${escapeHtml(s.connector)} · client profile · ${escapeHtml(s.folder || 'folder not set')}</small>${s.account ? `<small>Sign-in reminder: ${escapeHtml(s.account)}</small>` : ''}</span></label>`).join('')}</fieldset>
        <label class="field"><span>Text to check <small>(optional)</small></span><textarea name="draft" rows="4" placeholder="Paste a prompt or draft before it reaches your agent."></textarea></label>
        <button class="button primary" type="submit">Check boundary ${icon('arrow')}</button>
      </form>
      <div id="check-result" aria-live="polite"></div>
    </section>
    <aside class="ledger">${renderLedger(active, sessions)}</aside>
  </div>${workspaceDialog()}`;
}

function renderLedger(active: Workspace, sessions = state.sessions.filter(session => session.workspaceId === active.id)): string {
  const latest = sessions[0];
  const completeLaunch = latest?.status === 'launched' && latest.sourceIds.every(sourceId => latest.launches.some(launch => launch.sourceId === sourceId));
  const canExport = latest?.status === 'sample' || completeLaunch;
  const recordLabel = latest?.status === 'sample' ? 'Export sample record' : 'Export latest record';
  const details = sessions.map(session => {
    const outcome = session.status === 'sample' ? 'sample only' : session.status === 'legacy-unverified' ? 'not verified after update' : `${session.launches.length}/${session.sourceIds.length} agents opened`;
    return `<li><span>${new Date(session.startedAt).toLocaleDateString()}</span><b>${session.sourceIds.length} source${session.sourceIds.length === 1 ? '' : 's'} checked</b><small>${outcome}</small></li>`;
  }).join('');
  return `<h2>Delivery records</h2>${sessions.length ? `<ol>${details}</ol>${canExport ? `<button class="button secondary" id="export-record">${recordLabel} ${icon('export')}</button>` : '<p>Open every checked agent before exporting a verified delivery record.</p>'}` : '<p>No delivery records yet.</p><p>Check the boundary, then open every selected agent to create one.</p>'}<div class="boundary-note"><b>${active.rules.length} redaction rules</b><p>${active.rules.map(rule => escapeHtml(rule.term)).join(' · ')}</p></div>`;
}

function workspaceDialog(): string {
  return `<dialog id="workspace-dialog" aria-labelledby="workspace-dialog-title"><form method="dialog" id="workspace-form"><div class="dialog-head"><h2 id="workspace-dialog-title">Create a client workspace</h2><button value="cancel" aria-label="Close dialog">×</button></div><div id="workspace-error" class="form-error" role="alert" aria-live="assertive"></div><label class="field"><span>Client name</span><input name="name" required maxlength="60"></label><label class="field"><span>Client brief</span><textarea name="brief" required rows="3"></textarea></label><label class="field"><span>Writing rule</span><input name="voice" required></label><label class="field"><span>First source label</span><input name="source" required placeholder="client/repository"></label><label class="field"><span>Local folder</span><input name="folder" required placeholder="/path/to/client/project"></label><label class="field"><span>Coding agent</span><select name="connector"><option value="codex">Codex CLI</option><option value="claude">Claude Code</option><option value="gemini">Gemini CLI</option></select></label><label class="field"><span>Account reminder <small>(optional)</small></span><input name="account" type="text"></label><label class="field"><span>First redaction term</span><input name="term" required></label><div class="dialog-actions"><button value="cancel" class="button secondary">Cancel</button><button value="default" class="button primary" id="save-workspace">Save workspace</button></div></form></dialog>`;
}

function importDialog(): string {
  return `<dialog id="import-dialog" aria-labelledby="import-dialog-title"><form method="dialog" id="import-form"><div class="dialog-head"><h2 id="import-dialog-title">Import a workspace backup</h2><button value="cancel" aria-label="Close import dialog">×</button></div><div id="import-error" class="form-error" role="alert" aria-live="assertive"></div><p>Select a backup created by this app. It does not include agent sign-ins or license data.</p><label class="field"><span>Workspace backup file</span><input id="import-file" type="file" accept="application/json,.json" required></label><div id="import-preview" hidden><h3>Review imported workspace</h3><p id="import-summary"></p><p>Local folder paths are device-specific. Review every path after import before opening an agent.</p><label class="source-row"><input id="confirm-folder-paths" type="checkbox" required><span><b>I will review saved paths</b><small>Import keeps the saved paths but does not verify they exist on this device.</small></span></label></div><div class="dialog-actions"><button value="cancel" class="button secondary">Cancel</button><button value="default" class="button primary" id="finish-import" disabled>Import workspace</button></div></form></dialog>`;
}

function workspaceView(): string {
  return `${workspaceShell()}${!demo ? importDialog() : ''}`;
}

async function renderWorkspace(): Promise<void> {
  demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  setMeta(demo ? 'Demo — Client Context Firewall' : 'Workspace — Client Context Firewall', demo ? 'Try a sample client workspace. Sample changes stay in this tab.' : 'Create and check local client workspaces in the browser preview.', demo ? '/demo' : '/app');
  state = await loadState(demo);
  preparedSession = null;
  notice = getStorageError() || notice;
  app.innerHTML = workspaceView();
  wireShared(); wireWorkspace();
}

function wireWorkspace(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-workspace]')];
  const selectWorkspace = async (button: HTMLButtonElement) => {
    const nextState = structuredClone(state); nextState.activeId = button.dataset.workspace!;
    try { await saveState(nextState, demo); state = nextState; app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); document.querySelector<HTMLButtonElement>(`[data-workspace="${CSS.escape(button.dataset.workspace!)}"]`)?.focus(); }
    catch { notice = getStorageError(); app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); }
  };
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => void selectWorkspace(button));
    button.addEventListener('keydown', event => {
      let target = index;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      else return;
      event.preventDefault(); void selectWorkspace(tabs[target]);
    });
  });
  document.querySelector('#new-workspace')?.addEventListener('click', () => (document.querySelector<HTMLDialogElement>('#workspace-dialog'))?.showModal());
  document.querySelector('#export-workspace')?.addEventListener('click', exportWorkspace);
  const importDialogNode = document.querySelector<HTMLDialogElement>('#import-dialog');
  let imported: Workspace | null = null;
  document.querySelector('#import-workspace')?.addEventListener('click', () => importDialogNode?.showModal());
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async event => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]; const error = document.querySelector<HTMLDivElement>('#import-error');
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || parsed.format !== 'client-context-firewall-workspace-v1' || !parsed.workspace?.name || !Array.isArray(parsed.workspace.sources) || !Array.isArray(parsed.workspace.rules)) throw new Error('This is not a Client Context Firewall workspace backup.');
      const raw = parsed.workspace as Workspace;
      imported = {...raw, id: uid(), code: String(raw.name).split(/\s+/).map(part => part[0]).join('').slice(0,2).toUpperCase(), updatedAt: new Date().toISOString(), sources: raw.sources.map(source => ({...source, id:uid(), account:''})), rules: raw.rules.map(rule => ({...rule, id:uid()}))};
      document.querySelector('#import-preview')?.removeAttribute('hidden');
      document.querySelector('#import-summary')!.textContent = `${imported.name}: ${imported.sources.length} source${imported.sources.length === 1 ? '' : 's'} and ${imported.rules.length} rule${imported.rules.length === 1 ? '' : 's'}.`;
      (document.querySelector('#finish-import') as HTMLButtonElement).disabled = true;
      if (error) error.textContent = '';
    } catch (problem) { imported = null; if (error) error.textContent = problem instanceof Error ? problem.message : 'The backup could not be read.'; }
  });
  document.querySelector<HTMLInputElement>('#confirm-folder-paths')?.addEventListener('change', event => {
    const confirmed = (event.currentTarget as HTMLInputElement).checked;
    (document.querySelector('#finish-import') as HTMLButtonElement).disabled = !confirmed || !imported;
  });
  document.querySelector('#import-form')?.addEventListener('submit', async event => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement; if (submitter?.value === 'cancel') return; event.preventDefault();
    const error = document.querySelector<HTMLDivElement>('#import-error');
    if (!imported || !(document.querySelector<HTMLInputElement>('#confirm-folder-paths')?.checked)) { if (error) error.textContent = 'Confirm the local folder paths before importing.'; return; }
    if (state.workspaces.length >= 2 && !licenseActive()) { if (error) error.textContent = 'The free plan includes two workspaces. Add a Pro license before importing another.'; return; }
    const nextState = structuredClone(state); nextState.workspaces.push(imported); nextState.activeId = imported.id;
    try { await saveState(nextState, false); state = nextState; notice = 'Workspace imported. Confirm local folder paths before opening an agent.'; app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); }
    catch { if (error) error.textContent = getStorageError(); }
  });
  document.querySelector('#workspace-form')?.addEventListener('submit', async event => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;
    if (submitter?.value === 'cancel') return;
    event.preventDefault();
    if (!demo && state.workspaces.length >= 2 && !licenseActive()) { notice = 'The free plan includes two workspaces. Add a Pro license for more.'; app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); return; }
    const form = new FormData(event.currentTarget as HTMLFormElement); const name = String(form.get('name'));
    const workspace: Workspace = { id: uid(), name, code: name.split(/\s+/).map(v => v[0]).join('').slice(0,2).toUpperCase(), brief: String(form.get('brief')), voice: String(form.get('voice')), sources: [{ id: uid(), label: String(form.get('source')), account: String(form.get('account')), kind: 'Git', connector: String(form.get('connector')) as Connector, folder: String(form.get('folder')) }], rules: [{ id: uid(), term: String(form.get('term')), replacement: '[REDACTED]' }], updatedAt: new Date().toISOString() };
    const nextState = structuredClone(state); nextState.workspaces.push(workspace); nextState.activeId = workspace.id;
    try {
      await saveState(nextState, demo); state = nextState; app.innerHTML = workspaceView(); wireShared(); wireWorkspace();
    } catch {
      const error = document.querySelector<HTMLDivElement>('#workspace-error');
      if (error) error.textContent = getStorageError();
    }
  });
  document.querySelector('#delete-workspace')?.addEventListener('click', async () => {
    const active = state.workspaces.find(w => w.id === state.activeId);
    if (!active || !confirm(`Delete ${active.name}, its local records, and its client profile?`)) return;
    const previousState = structuredClone(state);
    const nextState = structuredClone(state);
    nextState.workspaces = nextState.workspaces.filter(w => w.id !== active.id); nextState.sessions = nextState.sessions.filter(s => s.workspaceId !== active.id); nextState.activeId = nextState.workspaces[0]?.id ?? null;
    try { await saveState(nextState, demo); }
    catch { notice = getStorageError(); app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); return; }
    try { await removeWorkspaceScope(active.id, demo); }
    catch {
      try { await saveState(previousState, demo); } catch { /* Keep the recovery message below. */ }
      notice = 'The workspace was not deleted because its client profile could not be removed. Close the agent, then try again.';
      app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); return;
    }
    state = nextState; notice = 'Workspace and client profile deleted.'; app.innerHTML = workspaceView(); wireShared(); wireWorkspace();
  });
  document.querySelector('#preflight-form')?.addEventListener('submit', runPreflight);
  document.querySelector('#boundary-form')?.addEventListener('submit', async event => { event.preventDefault(); const nextState = structuredClone(state); const active = nextState.workspaces.find(w => w.id === nextState.activeId)!; const data = new FormData(event.currentTarget as HTMLFormElement); active.brief = String(data.get('brief')); active.voice = String(data.get('voice')); active.updatedAt = new Date().toISOString(); try { await saveState(nextState, demo); state = nextState; notice = 'Client brief saved.'; } catch { notice = getStorageError(); } app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); });
  document.querySelector('#source-form')?.addEventListener('submit', async event => { event.preventDefault(); const nextState = structuredClone(state); const active = nextState.workspaces.find(w => w.id === nextState.activeId)!; const data = new FormData(event.currentTarget as HTMLFormElement); active.sources.push({id:uid(), label:String(data.get('label')), account:String(data.get('account')), kind:String(data.get('kind')) as 'Git'|'Drive'|'Chat'|'Folder', connector:String(data.get('connector')) as Connector, folder:String(data.get('folder'))}); active.updatedAt = new Date().toISOString(); try { await saveState(nextState, demo); state = nextState; notice = 'Source added to this workspace.'; } catch { notice = getStorageError(); } app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); });
  document.querySelector('#rule-form')?.addEventListener('submit', async event => { event.preventDefault(); const nextState = structuredClone(state); const active = nextState.workspaces.find(w => w.id === nextState.activeId)!; const data = new FormData(event.currentTarget as HTMLFormElement); active.rules.push({id:uid(), term:String(data.get('term')), replacement:String(data.get('replacement'))}); active.updatedAt = new Date().toISOString(); try { await saveState(nextState, demo); state = nextState; notice = 'Redaction rule added.'; } catch { notice = getStorageError(); } app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); });
  document.querySelector('#export-record')?.addEventListener('click', exportLatest);
  document.querySelectorAll<HTMLButtonElement>('[data-launch-source]').forEach(button => button.addEventListener('click', () => launchScopedAgent(button.dataset.launchSource!, button)));
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { clearDemo(); notice = 'Demo reset to its original sample.'; await renderWorkspace(); });
}

async function runPreflight(event: Event): Promise<void> {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const data = new FormData(form);
  const active = state.workspaces.find(w => w.id === state.activeId)!; const sourceIds = data.getAll('source').map(String); const draft = String(data.get('draft'));
  const selected = active.sources.filter(s => sourceIds.includes(s.id)); const failures: string[] = [];
  preparedSession = null;
  if (!selected.length) failures.push('Choose at least one source.');
  if (selected.some(source => !source.folder.trim())) failures.push('Set a local folder for every selected source.');
  const foreign = state.workspaces.filter(w => w.id !== active.id).find(w => draft.toLowerCase().includes(w.name.toLowerCase()));
  if (foreign) failures.push(`Text names another client: ${foreign.name}.`);
  for (const rule of active.rules) if (draft.toLowerCase().includes(rule.term.toLowerCase())) failures.push(`Text contains redaction term: ${rule.term}.`);
  const result = document.querySelector<HTMLDivElement>('#check-result')!;
  if (failures.length) { result.innerHTML = `<section class="result blocked" tabindex="-1"><p class="stamp">SESSION BLOCKED</p><h3>Fix ${failures.length} boundary ${failures.length === 1 ? 'check' : 'checks'}</h3><ul>${failures.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul><p>Change the account or text, then check again.</p></section>`; result.firstElementChild?.scrollIntoView({behavior:'smooth', block:'nearest'}); return; }
  const checks = ['No other client names found', `${active.rules.length} redaction rules checked`];
  if (demo) {
    const nextState = structuredClone(state);
    nextState.sessions.unshift({ id: uid(), workspaceId: active.id, startedAt: new Date().toISOString(), sourceIds, checks: ['Sample only — no local folder, client profile, or agent launch was validated', ...checks], status: 'sample', launches: [] });
    try { await saveState(nextState, true); state = nextState; }
    catch { result.innerHTML = `<section class="result blocked" tabindex="-1"><p class="stamp">NOT SAVED</p><h3>The sample record was not created</h3><p>${escapeHtml(getStorageError())}</p></section>`; (result.firstElementChild as HTMLElement).focus(); return; }
    result.innerHTML = `<section class="result passed" tabindex="-1"><p class="stamp">SAMPLE SESSION READY</p><h3>Sample check complete for ${escapeHtml(active.name)}</h3><ul>${['Sample only — no local profile was created', ...checks].map(c => `<li>${icon('check')} ${escapeHtml(c)}</li>`).join('')}</ul><p class="launch-help">Demo mode never opens a local process or creates launch provenance.</p></section>`;
    const ledger = document.querySelector<HTMLElement>('.ledger'); if (ledger) ledger.innerHTML = renderLedger(active);
    document.querySelector('#export-record')?.addEventListener('click', exportLatest);
    (result.firstElementChild as HTMLElement).focus(); return;
  }
  if (!isDesktop()) {
    result.innerHTML = `<section class="result blocked" tabindex="-1"><p class="stamp">DESKTOP VALIDATION REQUIRED</p><h3>Open this workspace in the desktop app</h3><p>The browser preview cannot validate your local folder or create a client profile. It will not create a passing delivery record.</p></section>`;
    (result.firstElementChild as HTMLElement).focus(); return;
  }
  const sessionId = uid();
  const requests = new Map<string, NativeLaunchRequest>();
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    for (const source of selected) {
      const request: NativeLaunchRequest = { sessionId, workspaceId: active.id, workspaceName: active.name, sourceId: source.id, sourceLabel: source.label, connector: source.connector, folder: source.folder, selectedSources: selected, brief: active.brief, writingRule: active.voice, redactionRules: active.rules.map(({term, replacement}) => ({term, replacement})), checkedDraft: draft };
      await invoke('prepare_scoped_session', { request });
      requests.set(source.id, request);
    }
  } catch (error) {
    result.innerHTML = `<section class="result blocked" tabindex="-1"><p class="stamp">SESSION NOT PREPARED</p><h3>The local boundary was not validated</h3><p>${escapeHtml(String(error))}</p><p>Check the folder and installed agent, then try again. No delivery record was created.</p></section>`;
    (result.firstElementChild as HTMLElement).focus(); return;
  }
  preparedSession = { id: sessionId, workspaceId: active.id, sourceIds, checks: ['Each selected source has a validated client profile', ...checks], requests, profileDirs: new Map() };
  result.innerHTML = `<section class="result passed" tabindex="-1"><p class="stamp">BOUNDARY PREPARED</p><h3>Open every checked agent for ${escapeHtml(active.name)}</h3><ul>${preparedSession.checks.map(c => `<li>${icon('check')} ${escapeHtml(c)}</li>`).join('')}</ul><div class="launch-actions">${selected.map(source => `<button class="button secondary" type="button" data-launch-source="${escapeHtml(source.id)}">Open ${escapeHtml(source.connector)} for ${escapeHtml(source.label)}</button>`).join('')}</div><p class="launch-help">Each agent receives this saved brief, writing rule, redaction rules, and checked text through its client profile. A delivery record is available after every selected agent opens.</p><div class="launch-status" aria-live="polite"></div></section>`;
  document.querySelectorAll<HTMLButtonElement>('[data-launch-source]').forEach(button => button.addEventListener('click', () => launchScopedAgent(button.dataset.launchSource!, button)));
  (result.firstElementChild as HTMLElement).focus();
}

async function launchScopedAgent(sourceId: string, button: HTMLButtonElement): Promise<void> {
  const statusNode = document.querySelector<HTMLDivElement>('.launch-status');
  if (demo || !isDesktop()) { if (statusNode) statusNode.textContent = 'Only a prepared desktop session can open an agent.'; return; }
  const workspace = state.workspaces.find(item => item.id === state.activeId);
  const source = workspace?.sources.find(item => item.id === sourceId);
  const pending = preparedSession;
  const request = pending && pending.workspaceId === workspace?.id ? pending.requests.get(sourceId) : undefined;
  if (!workspace || !source || !request || !pending) { if (statusNode) statusNode.textContent = 'Run the boundary check again before opening an agent.'; return; }
  button.disabled = true;
  if (statusNode) statusNode.textContent = `Opening ${source.connector} in the ${workspace.name} profile…`;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const receipt = await invoke<{ profileDir: string; contextPath: string }>('launch_scoped_agent', { request });
    pending.profileDirs.set(sourceId, receipt.profileDir);
    const nextState = structuredClone(state); const existing = nextState.sessions.find(session => session.id === pending.id);
    const launch = { sourceId, connector: source.connector, profileDir: receipt.profileDir, contextPath: receipt.contextPath, launchedAt: new Date().toISOString() };
    if (existing) existing.launches = [...existing.launches.filter(item => item.sourceId !== sourceId), launch];
    else nextState.sessions.unshift({ id: pending.id, workspaceId: workspace.id, startedAt: new Date().toISOString(), sourceIds: pending.sourceIds, checks: pending.checks, status: 'launched', launches: [launch] });
    await saveState(nextState, false); state = nextState;
    const completed = pending.sourceIds.every(id => state.sessions.find(session => session.id === pending.id)?.launches.some(item => item.sourceId === id));
    if (statusNode) statusNode.textContent = completed ? `${source.connector} opened. Every selected agent opened, and the delivery record is ready.` : `${source.connector} opened. Open the remaining checked agents before exporting the delivery record.`;
    const ledger = document.querySelector<HTMLElement>('.ledger'); if (ledger) { ledger.innerHTML = renderLedger(workspace); document.querySelector('#export-record')?.addEventListener('click', exportLatest); }
  } catch (error) {
    if (statusNode) statusNode.textContent = `The agent did not open. ${String(error)} Check the folder and install ${source.connector}, then try again.`;
  } finally { button.disabled = false; }
}

function exportLatest(): void {
  const active = state.workspaces.find(w => w.id === state.activeId)!; const session = state.sessions.find(s => s.workspaceId === active.id); if (!session) return;
  const completeLaunch = session.status === 'launched' && session.sourceIds.every(sourceId => session.launches.some(launch => launch.sourceId === sourceId));
  if (session.status !== 'sample' && !completeLaunch) return;
  const record = { product: 'Client Context Firewall', client: active.name, createdAt: session.startedAt, status: session.status, sources: active.sources.filter(s => session.sourceIds.includes(s.id)).map(({label, account, kind}) => ({kind,label,account})), checks: session.checks, launches: session.launches, statement: session.status === 'sample' ? 'Sample data only. No local folder, client profile, or agent launch was validated.' : 'This record confirms the client profile and agent launches. It is not a guarantee against data loss.' };
  const blob = new Blob([JSON.stringify(record, null, 2)], {type:'application/json'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${active.code.toLowerCase()}-delivery-record.json`; link.click(); URL.revokeObjectURL(link.href);
}

function exportWorkspace(): void {
  const active = state.workspaces.find(workspace => workspace.id === state.activeId); if (!active) return;
  const safeWorkspace = {...active, sources: active.sources.map(({account: _account, ...source}) => source)};
  const backup = {format:'client-context-firewall-workspace-v1', exportedAt:new Date().toISOString(), workspace:safeWorkspace, note:'This backup excludes agent sign-ins, license data, and delivery records. Confirm local folder paths after importing.'};
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${active.code.toLowerCase() || 'client'}-workspace-backup.json`; link.click(); URL.revokeObjectURL(link.href);
}

function legal(kind: 'privacy'|'terms'): void {
  const privacy = kind === 'privacy'; setMeta(`${privacy ? 'Privacy' : 'Terms'} — Client Context Firewall`, privacy ? 'Learn what Client Context Firewall stores and where workspace data goes.' : 'Read the Client Context Firewall purchase and use terms.', `/${kind}`);
  app.innerHTML = `${header()}<main id="main" class="legal" tabindex="-1"><p class="eyebrow">Policy · effective 29 August 2026</p><h1 tabindex="-1">${privacy ? 'Your client data stays under your control' : 'Terms for using the client boundary'}</h1>${privacy ? `<h2>What the app stores</h2><p>The desktop app stores workspaces, source labels, rules, and delivery records in an encrypted file on your device. Its encryption key is stored with your operating system’s credential manager.</p><p>Each desktop workspace gets a separate client profile. The checked brief, writing rule, redaction rules, and draft are written inside that profile only for the prepared session. The browser preview stores workspaces in this browser. Demo data uses a separate session-only key.</p><h2>What leaves your device</h2><p>The browser preview does not send workspace data to another site. Before opening an agent, the app removes API keys inherited from its parent process. Your chosen coding agent may use its own online service after launch. The landing page asks GitHub for public release details. License verification sends only your license token to Sociobot.</p><h2>Delete and export</h2><p>Delete each workspace inside the app to remove its local records and complete client profile. Export a workspace backup to move it. Confirm every local folder path after import.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p>` : `<h2>Use of the app</h2><p>This tool helps you define and check a client boundary. It cannot prevent every disclosure or replace your professional judgment.</p><h2>Pro plan</h2><p>Pro costs $19 once. It lets you create more than two workspaces. Checkout is handled by Sociobot.</p><h2>License</h2><p>You may restore a valid license on another device. A revoked license stops new Pro workspace creation. Existing workspaces, checks, and exports remain available.</p><h2>Refunds</h2><p><a href="mailto:support@sociobot.in?subject=Client%20Context%20Firewall%20refund">Request a refund from Sociobot</a>.</p><h2>Warranty</h2><p>The software is provided as is, without a promise that it will catch every mistake. You remain responsible for client agreements and delivered work.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with terms questions.</p>`}</main>${footer()}`; wireShared();
}

function provenance(): void { setMeta('Art provenance — Client Context Firewall', 'Read how the original Client Context Firewall artwork was made.', '/art-provenance'); app.innerHTML = `${header()}<main id="main" class="legal" tabindex="-1"><p class="eyebrow">Art provenance</p><h1 tabindex="-1">Original art for this product</h1><p>The folder-divider artwork was generated for Client Context Firewall with the factory image model on 28 August 2026.</p><h2>Source record</h2><p>The source PNG and prompt record ship in this repository under <code>assets/src/</code>. The site uses WebP derivatives under <code>public/art/</code>.</p><p>The art shows two separate client folders because the product prevents client work from crossing into another session.</p></main>${footer()}`; wireShared(); }

function notFound(): void { setMeta('Page not found — Client Context Firewall', 'This Client Context Firewall page was not found. Return home or open the demo.', location.pathname); app.innerHTML = `${header()}<main id="main" class="not-found" tabindex="-1"><p class="huge">404</p><h1 tabindex="-1">This page was not found</h1><p>The address does not match a page in this workspace.</p><a class="button primary nav-link" href="/">Return home</a></main>${footer()}`; wireShared(); }

function wireShared(): void {
  document.querySelector('.demo-banner a[href="/app"]')?.addEventListener('click', clearDemo);
  document.querySelectorAll<HTMLAnchorElement>('a.nav-link').forEach(link => link.addEventListener('click', event => { const url = new URL(link.href); if (url.origin !== location.origin) return; event.preventDefault(); navigate(`${url.pathname}${url.search}`); }));
}

function navigate(path: string): void { history.replaceState({...history.state, scrollY:window.scrollY}, ''); history.pushState({scrollY:0}, '', path); void route(true); }

async function showLicensePrompt(): Promise<void> {
  const token = prompt('Paste your Client Context Firewall license token.'); if (!token?.trim()) return;
  localStorage.setItem('sb_license:freelancer-agent-context', token.trim()); localStorage.removeItem('sb_license_verdict:freelancer-agent-context');
  const valid = await verifyLicense(token.trim(), true); alert(valid ? 'Pro is active on this device.' : 'That license could not be verified. Check the token and try again.');
}

function licenseActive(): boolean { try { const cached = JSON.parse(localStorage.getItem('sb_license_verdict:freelancer-agent-context') ?? '{}'); return cached.valid === true; } catch { return false; } }

async function verifyLicense(token: string, force = false): Promise<boolean> {
  const cacheKey = 'sb_license_verdict:freelancer-agent-context';
  try { const cached = JSON.parse(localStorage.getItem(cacheKey) ?? '{}'); if (!force && Date.now() - cached.checkedAt < 86400000) return cached.valid === true; } catch {}
  if (licenseVerification?.token === token) return licenseVerification.promise;
  const promise = (async () => {
    try { const response = await fetch(`${BILLING}/verify?license=${encodeURIComponent(token)}`); const result = await response.json(); localStorage.setItem(cacheKey, JSON.stringify({valid: result.valid === true, checkedAt: Date.now()})); return result.valid === true; }
    catch { return licenseActive(); }
  })();
  licenseVerification = { token, promise };
  try { return await promise; }
  finally { if (licenseVerification?.promise === promise) licenseVerification = null; }
}

function acceptReturnedLicense(): void {
  const url = new URL(location.href); const token = url.searchParams.get('license'); if (!token) return;
  localStorage.setItem('sb_license:freelancer-agent-context', token); url.searchParams.delete('license'); history.replaceState({}, '', `${url.pathname}${url.search}`); void verifyLicense(token, true);
}

async function route(resetScroll = false): Promise<void> {
  acceptReturnedLicense(); if (resetScroll) window.scrollTo(0,0);
  const path = location.pathname.replace(/\/$/, '') || '/';
  const demoQuery = new URLSearchParams(location.search).get('demo') === '1';
  if (demoQuery || (isDesktop() && path === '/')) await renderWorkspace(); else if (path === '/') landing(); else if (path === '/demo' || path === '/app') await renderWorkspace(); else if (path === '/privacy' || path === '/terms') legal(path.slice(1) as 'privacy'|'terms'); else if (path === '/art-provenance') provenance(); else notFound();
  const h1 = document.querySelector<HTMLElement>('h1');
  if (h1) {
    status.textContent = h1.textContent ?? '';
    if (!initialRoute) requestAnimationFrame(() => h1.focus({preventScroll:true}));
  }
  initialRoute = false;
  const savedLicense = localStorage.getItem('sb_license:freelancer-agent-context');
  if (savedLicense) void verifyLicense(savedLicense).then(valid => { if (!valid && location.pathname === '/app') { licenseNotice = true; notice = 'License no longer active.'; app.innerHTML = workspaceView(); wireShared(); wireWorkspace(); } });
}

window.addEventListener('popstate', () => {
  if (location.hash === '#main') { document.querySelector<HTMLElement>('#main')?.focus(); return; }
  void route(false).then(() => requestAnimationFrame(() => window.scrollTo(0, Number(history.state?.scrollY ?? 0))));
});
window.addEventListener('online', () => { if (location.pathname === '/app' || location.pathname === '/demo') renderWorkspace(); });
window.addEventListener('offline', () => { if (location.pathname === '/app' || location.pathname === '/demo') renderWorkspace(); });
if ('serviceWorker' in navigator && !isDesktop()) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
route();
