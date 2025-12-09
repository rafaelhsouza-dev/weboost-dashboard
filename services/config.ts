// Centralized resolver for the Gemini API key that works without .env
// Priority order (first non-empty wins):
// 1) window.__APP_CONFIG__.GEMINI_API_KEY (set in index.html or any boot script)
// 2) window.APP_CONFIG.GEMINI_API_KEY (alternative key)
// 3) localStorage['GEMINI_API_KEY'] (can be set at runtime via code/console)
// 4) import.meta.env.VITE_API_KEY_GEMINI (Vite env)
// 5) process.env.VITE_API_KEY_GEMINI (Node env / SSR)

export function getGeminiApiKey(): string {
  // 1/2. Global config on window
  try {
    if (typeof window !== 'undefined') {
      const w = window as any;
      const fromAppConfig = w?.__APP_CONFIG__?.GEMINI_API_KEY || w?.APP_CONFIG?.GEMINI_API_KEY;
      if (fromAppConfig && typeof fromAppConfig === 'string' && fromAppConfig.trim()) {
        return fromAppConfig.trim();
      }
    }
  } catch (_) {
    // ignore
  }

  // 3. localStorage
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const ls = window.localStorage.getItem('GEMINI_API_KEY');
      if (ls && ls.trim()) return ls.trim();
    }
  } catch (_) {
    // ignore storage errors (private mode, etc.)
  }

  // 4. Vite env
  try {
    // import.meta may not exist in some runtimes
    const viteVal = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY_GEMINI) || '';
    if (viteVal && typeof viteVal === 'string' && viteVal.trim()) return viteVal.trim();
  } catch (_) {
    // ignore
  }

  // 5. process env
  try {
    const nodeVal = (typeof process !== 'undefined' && (process as any).env?.VITE_API_KEY_GEMINI) || '';
    if (nodeVal && typeof nodeVal === 'string' && nodeVal.trim()) return nodeVal.trim();
  } catch (_) {
    // ignore
  }

  return '';
}
