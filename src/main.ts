import './style.css';
import { clearDemo, getStorageError, loadState, saveState } from './store';
import type { AppState, Workspace } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const status = document.querySelector<HTMLDivElement>('#route-status')!;
const BILLING = 'https://api.sociobot.in/api/v1/products/freelancer-agent-context';
const REPO = 'B-Divyesh/sf-freelancer-agent-context';
let state: AppState;
let demo = false;
let notice = '';
let licenseNotice = false;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]!));
const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

function header(): string {
  return `<header class="site-header">
    <a class="wordmark nav-link" href="/"><span class="mark">CF</span><span>Client Context Firewall</span></a>
    <nav aria-label="Main navigation"><a class="nav-link" href="/demo">Demo</a><a class="nav-link" href="/app">Workspace</a><a class="nav-link" href="/privacy">Privacy</a></nav>
  </header>`;
}

function footer(): string {
  return `<footer><p>Keep each client’s work in its own boundary.</p><nav aria-label="Footer"><a class="nav-link" href="/privacy">Privacy</a><a class="nav-link" href="/terms">Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav><p class="build">v0.1.0 · Original generated art</p></footer>`;
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
  document.title = 'Client Context Firewall — Keep client work apart';
  app.innerHTML = `${header()}<main id="main">
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">A local desktop boundary for freelancers</p><h1 tabindex="-1">Keep client work from crossing over</h1>
        <p class="lede">For freelance developers who switch clients without mixing sources, accounts, or writing style.</p>
        <div class="hero-actions"><a class="button primary nav-link" href="/demo">Try it with sample data ${icon('arrow')}</a><span>See a checked client session next.</span></div>
        <ul class="facts"><li>${icon('lock')} Client data stays on this device.</li><li>${icon('check')} Works offline after your first visit.</li><li><span aria-hidden="true">₹</span> Free for two workspaces. Pro is $19/month.</li></ul>
      </div>
      <figure class="hero-art"><div class="plate-label">BOUNDARY / 01</div><img src="/art/boundary-ledger.webp" srcset="/art/boundary-ledger-600.webp 600w, /art/boundary-ledger.webp 1200w" sizes="(max-width: 980px) 100vw, 50vw" width="1200" height="800" fetchpriority="high" decoding="async" alt="Two paper client folders sit on opposite sides of an orange divider."><figcaption>Separate briefs, source accounts, and rules before work begins.</figcaption></figure>
    </section>
    <section class="preview-section" aria-labelledby="preview-title"><div><p class="eyebrow">Live product preview</p><h2 id="preview-title">A check before the agent starts</h2><p>The active workspace names the only sources and accounts allowed in this session.</p></div>
      <div class="preview" role="img" aria-label="Northstar workspace with two allowed sources and three passed boundary checks">
        <div class="preview-tabs"><span>NS</span><span class="inactive">JL</span></div><div class="preview-sheet"><p class="stamp">NORTHSTAR / SESSION READY</p><h3>Sources in this session</h3><p>Git · northstar/reorder <b>dev@northstar.example</b></p><p>Drive · Wholesale briefs <b>sam@northstar.example</b></p><ol class="check-list"><li>Account matches workspace</li><li>No other client names found</li><li>Two redaction rules loaded</li></ol></div>
      </div>
    </section>
    <section class="steps" aria-labelledby="steps-title"><p class="eyebrow">How it works</p><h2 id="steps-title">Set the boundary once</h2><ol><li><span>01</span><h3>Name the workspace</h3><p>Add the brief and writing rules that belong to one client.</p><figure><img src="/screens/01-scope.webp" width="760" height="686" loading="lazy" decoding="async" alt="The sample workspace lists two Northstar sources."><figcaption>Start with the client brief and permitted accounts.</figcaption></figure></li><li><span>02</span><h3>Scope each source</h3><p>Record the connector account allowed for this client.</p><figure><img src="/screens/02-block.webp" width="760" height="362" loading="lazy" decoding="async" alt="A session is blocked after three boundary checks fail."><figcaption>A wrong account or client name stops the session.</figcaption></figure></li><li><span>03</span><h3>Check and export</h3><p>Run a preflight, then export a delivery record with the source list.</p><figure><img src="/screens/03-pass.webp" width="760" height="362" loading="lazy" decoding="async" alt="A clean session passes all three boundary checks."><figcaption>A clean check creates a delivery record.</figcaption></figure></li></ol></section>
    <section class="limits" aria-labelledby="limits-title"><div><p class="eyebrow">Clear limits</p><h2 id="limits-title">A guardrail, not surveillance</h2></div><div><p>It does not read other apps or monitor your screen.</p><p>It does not send source code to a hosted service.</p><p>It cannot prevent every copy and paste mistake. It checks the information you give it.</p></div></section>
    <section class="downloads" aria-labelledby="download-title"><div><p class="eyebrow">Desktop app</p><h2 id="download-title">Install your local workspace</h2><p>Choose the package for your system when releases are published. Current v0.1 builds are unsigned.</p></div><div id="download-panel" class="download-panel" aria-live="polite"><p>Checking the latest release…</p></div></section>
    <section class="pricing" aria-labelledby="price-title"><div><p class="eyebrow">Pro license</p><h2 id="price-title">More clients, same local boundary</h2><p class="price"><strong>$19</strong> / month</p><p>Pro adds unlimited workspaces. Safety checks and delivery exports stay free.</p></div><div class="purchase"><a class="button primary" href="${BILLING}/checkout">Buy Pro ${icon('arrow')}</a><button class="button secondary" id="restore-license">Paste a license</button><p>Sociobot is the merchant of record. Manage refunds there.</p><p><a class="nav-link" href="/terms">Read purchase terms</a></p></div></section>
  </main>${footer()}`;
  wireShared();
  document.querySelector('#restore-license')?.addEventListener('click', showLicensePrompt);
  loadDownload();
}

async function loadDownload(): Promise<void> {
  const panel = document.querySelector<HTMLDivElement>('#download-panel'); if (!panel) return;
  const platform = /Mac/i.test(navigator.userAgent) ? 'macOS' : /Win/i.test(navigator.userAgent) ? 'Windows' : 'Linux';
  const extensions = platform === 'macOS' ? ['.dmg'] : platform === 'Windows' ? ['.msi', '.exe'] : ['.AppImage', '.deb'];
  try {
    const cacheKey = 'ccf:release'; const cached = JSON.parse(localStorage.getItem(cacheKey) ?? '{}');
    const release = Date.now() - cached.savedAt < 3600000 ? cached.data : await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=1`).then(response => { if (!response.ok) throw new Error('release unavailable'); return response.json(); }).then(items => { if (!items[0]) throw new Error('release unavailable'); return items[0]; });
    localStorage.setItem(cacheKey, JSON.stringify({savedAt: Date.now(), data: release}));
    const asset = release.assets?.find((item: {name:string}) => extensions.some(ext => item.name.endsWith(ext)));
    if (!asset) throw new Error('asset unavailable');
    panel.innerHTML = `<p class="stamp">DETECTED · ${platform.toUpperCase()}</p><a class="button primary" href="${escapeHtml(asset.browser_download_url)}">Download for ${platform} ${icon('arrow')}</a><p>${escapeHtml(asset.name)} · unsigned build</p>`;
  } catch {
    panel.innerHTML = `<p class="stamp">DETECTED · ${platform.toUpperCase()}</p><p>Downloads are being published.</p><a class="button secondary" href="https://github.com/${REPO}/releases">Open the release page ${icon('arrow')}</a>`;
  }
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button id="reset-demo">Reset demo</button><a class="nav-link" href="/app">Start for real</a></aside>`;
}

function workspaceShell(): string {
  const active = state.workspaces.find(w => w.id === state.activeId) ?? state.workspaces[0];
  return `${header()}${demo ? demoBanner() : ''}<main id="main" class="workbench">
    <section class="app-heading"><div><p class="eyebrow">${demo ? 'Sample workspace' : 'Local workspace'}</p><h1 tabindex="-1">${active ? 'Check this client session' : 'Create your first client workspace'}</h1></div><div class="state-chip">${navigator.onLine ? 'Device local' : 'Offline · device local'}</div></section>
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
    <aside class="client-rail" aria-label="Client workspaces"><div class="rail-title">Clients <button id="new-workspace" aria-label="Create a workspace">+</button></div><div class="client-tabs" role="tablist" aria-label="Choose a client">${state.workspaces.map(w => `<button role="tab" aria-selected="${w.id === active.id}" data-workspace="${w.id}"><b>${escapeHtml(w.code)}</b><span>${escapeHtml(w.name)}</span></button>`).join('')}</div></aside>
    <section class="session-sheet" aria-labelledby="client-name"><div class="sheet-head"><div><p class="eyebrow">Active boundary</p><h2 id="client-name">${escapeHtml(active.name)}</h2></div><button class="text-button danger" id="delete-workspace">Delete workspace</button></div>
      <div class="brief-block"><h3>Client brief</h3><p>${escapeHtml(active.brief)}</p><h3>Writing rule</h3><p>${escapeHtml(active.voice)}</p></div>
      <details class="boundary-editor"><summary>Edit the client boundary</summary><form id="boundary-form"><label class="field"><span>Client brief</span><textarea name="brief" required rows="3">${escapeHtml(active.brief)}</textarea></label><label class="field"><span>Writing rule</span><input name="voice" value="${escapeHtml(active.voice)}" required></label><button class="button secondary" type="submit">Save brief</button></form><form id="source-form"><h3>Add a source</h3><label class="field"><span>Source label</span><input name="label" required></label><label class="field"><span>Connector account</span><input name="account" required></label><label class="field"><span>Source type</span><select name="kind"><option>Git</option><option>Drive</option><option>Chat</option><option>Folder</option></select></label><button class="button secondary" type="submit">Add source</button></form><form id="rule-form"><h3>Add a redaction rule</h3><label class="field"><span>Text to find</span><input name="term" required></label><label class="field"><span>Replacement</span><input name="replacement" value="[REDACTED]" required></label><button class="button secondary" type="submit">Add rule</button></form></details>
      <form id="preflight-form"><fieldset><legend>Sources in this session</legend>${active.sources.map((s, index) => `<label class="source-row"><input type="checkbox" name="source" value="${s.id}" ${index === 0 ? 'checked' : ''}><span><b>${escapeHtml(s.kind)} · ${escapeHtml(s.label)}</b><small>Expected account: ${escapeHtml(s.account)}</small></span></label>`).join('')}</fieldset>
        <label class="field"><span>Active account</span><input name="account" value="${escapeHtml(active.sources[0]?.account ?? '')}" required><small>Enter the account your connector is using now.</small></label>
        <label class="field"><span>Text to check <small>(optional)</small></span><textarea name="draft" rows="4" placeholder="Paste a prompt or draft before it reaches your agent."></textarea></label>
        <button class="button primary" type="submit">Check session ${icon('arrow')}</button>
      </form>
      <div id="check-result" aria-live="polite"></div>
    </section>
    <aside class="ledger"><h2>Delivery records</h2>${sessions.length ? `<ol>${sessions.map(s => `<li><span>${new Date(s.startedAt).toLocaleDateString()}</span><b>${s.sourceIds.length} source${s.sourceIds.length === 1 ? '' : 's'} checked</b></li>`).join('')}</ol><button class="button secondary" id="export-record">Export latest record ${icon('export')}</button>` : '<p>No delivery records yet.</p><p>Run a clean session check to create one.</p>'}<div class="boundary-note"><b>${active.rules.length} redaction rules</b><p>${active.rules.map(r => escapeHtml(r.term)).join(' · ')}</p></div></aside>
  </div>${workspaceDialog()}`;
}

function workspaceDialog(): string {
  return `<dialog id="workspace-dialog"><form method="dialog" id="workspace-form"><div class="dialog-head"><h2>Create a client workspace</h2><button value="cancel" aria-label="Close dialog">×</button></div><label class="field"><span>Client name</span><input name="name" required maxlength="60"></label><label class="field"><span>Client brief</span><textarea name="brief" required rows="3"></textarea></label><label class="field"><span>Writing rule</span><input name="voice" required></label><label class="field"><span>First source label</span><input name="source" required placeholder="client/repository"></label><label class="field"><span>Connector account</span><input name="account" required type="text"></label><label class="field"><span>First redaction term</span><input name="term" required></label><div class="dialog-actions"><button value="cancel" class="button secondary">Cancel</button><button value="default" class="button primary" id="save-workspace">Save workspace</button></div></form></dialog>`;
}

async function renderWorkspace(): Promise<void> {
  demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  document.title = demo ? 'Demo — Client Context Firewall' : 'Workspace — Client Context Firewall';
  state = await loadState(demo);
  notice = getStorageError() || notice;
  app.innerHTML = workspaceShell();
  wireShared(); wireWorkspace();
}

function wireWorkspace(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-workspace]').forEach(button => button.addEventListener('click', async () => {
    state.activeId = button.dataset.workspace!; await saveState(state, demo); app.innerHTML = workspaceShell(); wireShared(); wireWorkspace();
  }));
  document.querySelector('#new-workspace')?.addEventListener('click', () => (document.querySelector<HTMLDialogElement>('#workspace-dialog'))?.showModal());
  document.querySelector('#workspace-form')?.addEventListener('submit', async event => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;
    if (submitter?.value === 'cancel') return;
    event.preventDefault();
    if (!demo && state.workspaces.length >= 2 && !licenseActive()) { notice = 'The free plan includes two workspaces. Add a Pro license for more.'; app.innerHTML = workspaceShell(); wireShared(); wireWorkspace(); return; }
    const form = new FormData(event.currentTarget as HTMLFormElement); const name = String(form.get('name'));
    const workspace: Workspace = { id: uid(), name, code: name.split(/\s+/).map(v => v[0]).join('').slice(0,2).toUpperCase(), brief: String(form.get('brief')), voice: String(form.get('voice')), sources: [{ id: uid(), label: String(form.get('source')), account: String(form.get('account')), kind: 'Git' }], rules: [{ id: uid(), term: String(form.get('term')), replacement: '[REDACTED]' }], updatedAt: new Date().toISOString() };
    state.workspaces.push(workspace); state.activeId = workspace.id; await saveState(state, demo); app.innerHTML = workspaceShell(); wireShared(); wireWorkspace();
  });
  document.querySelector('#delete-workspace')?.addEventListener('click', async () => {
    const active = state.workspaces.find(w => w.id === state.activeId); if (!active || !confirm(`Delete ${active.name} and its local records?`)) return;
    state.workspaces = state.workspaces.filter(w => w.id !== active.id); state.sessions = state.sessions.filter(s => s.workspaceId !== active.id); state.activeId = state.workspaces[0]?.id ?? null; await saveState(state, demo); app.innerHTML = workspaceShell(); wireShared(); wireWorkspace();
  });
  document.querySelector('#preflight-form')?.addEventListener('submit', runPreflight);
  document.querySelector('#boundary-form')?.addEventListener('submit', async event => { event.preventDefault(); const active = state.workspaces.find(w => w.id === state.activeId)!; const data = new FormData(event.currentTarget as HTMLFormElement); active.brief = String(data.get('brief')); active.voice = String(data.get('voice')); active.updatedAt = new Date().toISOString(); await saveState(state, demo); notice = 'Client brief saved.'; app.innerHTML = workspaceShell(); wireShared(); wireWorkspace(); });
  document.querySelector('#source-form')?.addEventListener('submit', async event => { event.preventDefault(); const active = state.workspaces.find(w => w.id === state.activeId)!; const data = new FormData(event.currentTarget as HTMLFormElement); active.sources.push({id:uid(), label:String(data.get('label')), account:String(data.get('account')), kind:String(data.get('kind')) as 'Git'|'Drive'|'Chat'|'Folder'}); active.updatedAt = new Date().toISOString(); await saveState(state, demo); notice = 'Source added to this workspace.'; app.innerHTML = workspaceShell(); wireShared(); wireWorkspace(); });
  document.querySelector('#rule-form')?.addEventListener('submit', async event => { event.preventDefault(); const active = state.workspaces.find(w => w.id === state.activeId)!; const data = new FormData(event.currentTarget as HTMLFormElement); active.rules.push({id:uid(), term:String(data.get('term')), replacement:String(data.get('replacement'))}); active.updatedAt = new Date().toISOString(); await saveState(state, demo); notice = 'Redaction rule added.'; app.innerHTML = workspaceShell(); wireShared(); wireWorkspace(); });
  document.querySelector('#export-record')?.addEventListener('click', exportLatest);
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { clearDemo(); notice = 'Demo reset to its original sample.'; await renderWorkspace(); });
}

async function runPreflight(event: Event): Promise<void> {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const data = new FormData(form);
  const active = state.workspaces.find(w => w.id === state.activeId)!; const sourceIds = data.getAll('source').map(String); const account = String(data.get('account')).trim(); const draft = String(data.get('draft'));
  const selected = active.sources.filter(s => sourceIds.includes(s.id)); const failures: string[] = [];
  if (!selected.length) failures.push('Choose at least one source.');
  if (selected.length && !selected.some(s => s.account.toLowerCase() === account.toLowerCase())) failures.push(`Account ${account || '(blank)'} does not match a selected source.`);
  const foreign = state.workspaces.filter(w => w.id !== active.id).find(w => draft.toLowerCase().includes(w.name.toLowerCase()));
  if (foreign) failures.push(`Text names another client: ${foreign.name}.`);
  for (const rule of active.rules) if (draft.toLowerCase().includes(rule.term.toLowerCase())) failures.push(`Text contains redaction term: ${rule.term}.`);
  const result = document.querySelector<HTMLDivElement>('#check-result')!;
  if (failures.length) { result.innerHTML = `<section class="result blocked" tabindex="-1"><p class="stamp">SESSION BLOCKED</p><h3>Fix ${failures.length} boundary ${failures.length === 1 ? 'check' : 'checks'}</h3><ul>${failures.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul><p>Change the account or text, then check again.</p></section>`; result.firstElementChild?.scrollIntoView({behavior:'smooth', block:'nearest'}); return; }
  const checks = ['Account matches a selected source', 'No other client names found', `${active.rules.length} redaction rules checked`];
  state.sessions.unshift({ id: uid(), workspaceId: active.id, startedAt: new Date().toISOString(), sourceIds, checks }); await saveState(state, demo);
  result.innerHTML = `<section class="result passed" tabindex="-1"><p class="stamp">BOUNDARY PASSED</p><h3>Session ready for ${escapeHtml(active.name)}</h3><ul>${checks.map(c => `<li>${icon('check')} ${escapeHtml(c)}</li>`).join('')}</ul><p>Use only the listed sources in your agent session.</p></section>`;
  (result.firstElementChild as HTMLElement).focus();
}

function exportLatest(): void {
  const active = state.workspaces.find(w => w.id === state.activeId)!; const session = state.sessions.find(s => s.workspaceId === active.id); if (!session) return;
  const record = { product: 'Client Context Firewall', client: active.name, createdAt: session.startedAt, sources: active.sources.filter(s => session.sourceIds.includes(s.id)).map(({label, account, kind}) => ({kind,label,account})), checks: session.checks, statement: 'This record lists the boundary check inputs. It is not a guarantee against data loss.' };
  const blob = new Blob([JSON.stringify(record, null, 2)], {type:'application/json'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${active.code.toLowerCase()}-delivery-record.json`; link.click(); URL.revokeObjectURL(link.href);
}

function legal(kind: 'privacy'|'terms'): void {
  const privacy = kind === 'privacy'; document.title = `${privacy ? 'Privacy' : 'Terms'} — Client Context Firewall`;
  app.innerHTML = `${header()}<main id="main" class="legal"><p class="eyebrow">Policy · effective 28 August 2026</p><h1 tabindex="-1">${privacy ? 'Your client data stays under your control' : 'Terms for using the client boundary'}</h1>${privacy ? `<h2>What the app stores</h2><p>The desktop app stores workspaces, source labels, rules, and delivery records in an encrypted file on your device. Its encryption key is stored with your operating system’s credential manager.</p><p>The web preview uses browser storage. Demo data uses a separate session-only key and is cleared when you reset it.</p><h2>What leaves your device</h2><p>Workspace data is not sent to us. The landing page asks GitHub for public release details. License verification sends only your license token to Sociobot.</p><h2>Delete and export</h2><p>Delete each workspace inside the app. Export a delivery record before offboarding if you need an audit trail.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p>` : `<h2>Use of the app</h2><p>This tool helps you define and check a client boundary. It cannot prevent every disclosure or replace your professional judgment.</p><h2>Pro plan</h2><p>Pro costs $19 per month. It adds unlimited workspaces. Sociobot is the merchant of record and handles billing and refunds.</p><h2>License</h2><p>You may restore a valid license on another device. A refunded, expired, or revoked license stops Pro features. Your free workspaces and exports remain available.</p><h2>Warranty</h2><p>The software is provided as is, without a promise that it will catch every mistake. You remain responsible for client agreements and delivered work.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with terms questions.</p>`}</main>${footer()}`; wireShared();
}

function notFound(): void { document.title = 'Page not found — Client Context Firewall'; app.innerHTML = `${header()}<main id="main" class="not-found"><p class="huge">404</p><h1 tabindex="-1">This page crossed the wrong boundary</h1><p>The address does not match a page in this workspace.</p><a class="button primary nav-link" href="/">Return home</a></main>${footer()}`; wireShared(); }

function wireShared(): void {
  document.querySelector('.demo-banner a[href="/app"]')?.addEventListener('click', clearDemo);
  document.querySelectorAll<HTMLAnchorElement>('a.nav-link').forEach(link => link.addEventListener('click', event => { const url = new URL(link.href); if (url.origin !== location.origin) return; event.preventDefault(); navigate(url.pathname); }));
}

function navigate(path: string): void { history.pushState({}, '', path); route(); }

async function showLicensePrompt(): Promise<void> {
  const token = prompt('Paste your Client Context Firewall license token.'); if (!token?.trim()) return;
  localStorage.setItem('sb_license:freelancer-agent-context', token.trim()); localStorage.removeItem('sb_license_verdict:freelancer-agent-context');
  const valid = await verifyLicense(token.trim(), true); alert(valid ? 'Pro is active on this device.' : 'That license could not be verified. Check the token and try again.');
}

function licenseActive(): boolean { try { const cached = JSON.parse(localStorage.getItem('sb_license_verdict:freelancer-agent-context') ?? '{}'); return cached.valid === true; } catch { return false; } }

async function verifyLicense(token: string, force = false): Promise<boolean> {
  const cacheKey = 'sb_license_verdict:freelancer-agent-context';
  try { const cached = JSON.parse(localStorage.getItem(cacheKey) ?? '{}'); if (!force && Date.now() - cached.checkedAt < 86400000) return cached.valid === true; } catch {}
  try { const response = await fetch(`${BILLING}/verify?license=${encodeURIComponent(token)}`); const result = await response.json(); localStorage.setItem(cacheKey, JSON.stringify({valid: result.valid === true, checkedAt: Date.now()})); return result.valid === true; } catch { return licenseActive(); }
}

function acceptReturnedLicense(): void {
  const url = new URL(location.href); const token = url.searchParams.get('license'); if (!token) return;
  localStorage.setItem('sb_license:freelancer-agent-context', token); url.searchParams.delete('license'); history.replaceState({}, '', `${url.pathname}${url.search}`); void verifyLicense(token, true);
}

async function route(): Promise<void> {
  acceptReturnedLicense(); window.scrollTo(0,0);
  const path = location.pathname.replace(/\/$/, '') || '/';
  if ('__TAURI_INTERNALS__' in window && path === '/') await renderWorkspace(); else if (path === '/') landing(); else if (path === '/demo' || path === '/app') await renderWorkspace(); else if (path === '/privacy' || path === '/terms') legal(path.slice(1) as 'privacy'|'terms'); else notFound();
  const h1 = document.querySelector<HTMLElement>('h1'); if (h1) { status.textContent = h1.textContent ?? ''; requestAnimationFrame(() => h1.focus({preventScroll:true})); }
  const savedLicense = localStorage.getItem('sb_license:freelancer-agent-context');
  if (savedLicense) void verifyLicense(savedLicense).then(valid => { if (!valid && location.pathname === '/app') { licenseNotice = true; notice = 'License no longer active.'; app.innerHTML = workspaceShell(); wireShared(); wireWorkspace(); } });
}

window.addEventListener('popstate', route);
window.addEventListener('online', () => { if (location.pathname === '/app' || location.pathname === '/demo') renderWorkspace(); });
window.addEventListener('offline', () => { if (location.pathname === '/app' || location.pathname === '/demo') renderWorkspace(); });
if ('serviceWorker' in navigator && !('__TAURI_INTERNALS__' in window)) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
route();
