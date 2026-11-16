import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './context/FirebaseContext.tsx';

// Ensure any stale Service Workers or poisoned caches are cleaned up on boot
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      })
      .catch(() => {});
  }
  if ('caches' in window) {
    window.caches
      .keys()
      .then((keys) => {
        for (const key of keys) {
          window.caches.delete(key).catch(() => {});
        }
      })
      .catch(() => {});
  }
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  declare props: { children: React.ReactNode };
  state: ErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown) {
    console.error('[The Tactical Standard] Root render error caught:', error);
  }

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('rpa_active_custom_ai_program_v1');
      localStorage.removeItem('rpa_active_program_key_v1');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090b0d] text-zinc-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#0e1217] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-black uppercase text-white tracking-wider">
              The Tactical <span className="text-amber-400">Standard</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              A cached session state was updated. Click below to reload your training deck.
            </p>
            {this.state.errorMessage && (
              <p className="text-[11px] font-mono text-amber-300/90 bg-black/50 p-2.5 rounded-lg border border-zinc-800 break-words">
                {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Reload Command Deck
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </RootErrorBoundary>
  </StrictMode>
);
