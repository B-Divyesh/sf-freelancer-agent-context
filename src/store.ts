import { emptyState, sampleState } from './data';
import type { AppState } from './types';

const isTauri = () => '__TAURI_INTERNALS__' in window;
const key = (demo: boolean) => `${demo ? 'demo:' : 'ccf:'}workspace-state`;
let storageError = '';
export const getStorageError = () => storageError;

// Keep the public landing path free of the desktop bridge. It loads only when
// the installed app opens or changes a workspace.
async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<T>(command, args);
}

function migrateState(state: AppState): AppState {
  for (const workspace of state.workspaces) {
    for (const source of workspace.sources) {
      source.connector ||= 'codex';
      source.folder ||= '';
    }
  }
  return state;
}

export async function loadState(demo: boolean): Promise<AppState> {
  if (demo) {
    const saved = sessionStorage.getItem(key(true));
    return saved ? migrateState(JSON.parse(saved)) : sampleState();
  }
  try {
    if (isTauri()) {
      const saved = await tauriInvoke<string | null>('load_vault');
      return saved ? migrateState(JSON.parse(saved)) : emptyState();
    }
    const saved = localStorage.getItem(key(false));
    storageError = ''; return saved ? migrateState(JSON.parse(saved)) : emptyState();
  } catch {
    storageError = 'Your local workspace could not be opened. Check the device credential manager, then reopen the app.';
    return emptyState();
  }
}

export async function saveState(state: AppState, demo: boolean): Promise<void> {
  try {
    const serialized = JSON.stringify(state);
    if (demo) sessionStorage.setItem(key(true), serialized);
    else if (isTauri()) await tauriInvoke('save_vault', { contents: serialized });
    else localStorage.setItem(key(false), serialized);
    storageError = '';
  } catch {
    storageError = 'This change could not be saved. Check device storage, then try again.';
  }
}

export function clearDemo(): void { sessionStorage.removeItem(key(true)); }

/** Remove the installed app's complete scoped connector profile for one client. */
export async function removeWorkspaceScope(workspaceId: string, demo: boolean): Promise<void> {
  if (!demo && isTauri()) await tauriInvoke('delete_workspace_scope', { workspaceId });
}
