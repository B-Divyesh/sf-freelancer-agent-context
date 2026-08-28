import { invoke } from '@tauri-apps/api/core';
import { emptyState, sampleState } from './data';
import type { AppState } from './types';

const isTauri = () => '__TAURI_INTERNALS__' in window;
const key = (demo: boolean) => `${demo ? 'demo:' : 'ccf:'}workspace-state`;

export async function loadState(demo: boolean): Promise<AppState> {
  if (demo) {
    const saved = sessionStorage.getItem(key(true));
    return saved ? JSON.parse(saved) : sampleState();
  }
  try {
    if (isTauri()) {
      const saved = await invoke<string | null>('load_vault');
      return saved ? JSON.parse(saved) : emptyState();
    }
    const saved = localStorage.getItem(key(false));
    return saved ? JSON.parse(saved) : emptyState();
  } catch {
    return emptyState();
  }
}

export async function saveState(state: AppState, demo: boolean): Promise<void> {
  const serialized = JSON.stringify(state);
  if (demo) sessionStorage.setItem(key(true), serialized);
  else if (isTauri()) await invoke('save_vault', { contents: serialized });
  else localStorage.setItem(key(false), serialized);
}

export function clearDemo(): void { sessionStorage.removeItem(key(true)); }
