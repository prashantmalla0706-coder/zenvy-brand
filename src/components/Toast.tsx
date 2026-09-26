import React from 'react';
import { X, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useShop();

  if (!toast) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121212] text-[#FBFBFA] p-4 shadow-2xl border border-white/10 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tracking-wide uppercase">{toast.text}</p>
          {toast.subtext && (
            <p className="text-xs text-white/70 mt-0.5 truncate">{toast.subtext}</p>
          )}

          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                dismissToast();
              }}
              className="mt-2 text-[11px] font-bold tracking-widest uppercase text-white underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>

        <button
          onClick={dismissToast}
          className="text-white/50 hover:text-white transition-colors p-1 -mr-1 -mt-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
