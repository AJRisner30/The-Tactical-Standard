import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppStoreModal } from './AppStoreModal';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'banner' | 'pill';
  className?: string;
  withPrefixDivider?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'nav',
  className = '',
  withPrefixDivider = false
}) => {
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed, remove all install UI completely from the screen
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    // If the browser provides a direct install prompt, trigger it immediately
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {withPrefixDivider && (
        <span className="text-zinc-600 hidden md:inline select-none">|</span>
      )}
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-md shrink-0 ${
          variant === 'nav'
            ? 'px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black border border-amber-400/50 text-xs font-black uppercase tracking-wider'
            : variant === 'pill'
            ? 'px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black tracking-wide uppercase border border-amber-400/50 shadow-sm'
            : 'px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider border border-amber-400/50 shadow-lg'
        } ${className}`}
        title="Install The Tactical Standard app to your device"
      >
        <Download className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
        <span className="whitespace-nowrap font-athletic">Install App</span>
      </button>

      {showModal && (
        <AppStoreModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
