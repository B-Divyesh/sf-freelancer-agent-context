import { invoke } from '@tauri-apps/api/core';
import { emptyState, sampleState } from './data';
import type { AppState } from './types';

const isTauri = () => '__TAURI_INTERNALS__' in window;
const key = (demo: boolean) => `${demo ? 'demo:' : 'ccf:'}workspace-state`;
let storageError = '';
export const getStorageError = () => storageError;

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
      const saved = await invoke<string | null>('load_vault');
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
    else if (isTauri()) await invoke('save_vault', { contents: serialized });
    else localStorage.setItem(key(false), serialized);
    storageError = '';
  } catch {
    storageError = 'This change could not be saved. Check device storage, then try again.';
  }
}

export function clearDemo(): void { sessionStorage.removeItem(key(true)); }
