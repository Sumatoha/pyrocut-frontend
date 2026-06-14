'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastTone = 'default' | 'success' | 'error';
interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastApi {
  toast: (t: Omit<Toast, 'id'> | string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++counter;
    setItems((prev) => [...prev, { ...t, id }]);
    return id;
  }, []);

  const api: ToastApi = {
    toast: (t) =>
      push(typeof t === 'string' ? { title: t, tone: 'default' } : t),
    success: (title, description) => push({ title, description, tone: 'success' }),
    error: (title, description) => push({ title, description, tone: 'error' }),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {items.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const ms = toast.tone === 'error' ? 6000 : 4000;
    const t = setTimeout(onClose, ms);
    return () => clearTimeout(t);
  }, [toast.tone, onClose]);

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-[14px] border bg-paper p-3.5 shadow-pop',
        toast.tone === 'error' ? 'border-ember/40' : 'border-hair',
      )}
    >
      <span className="mt-0.5 shrink-0">
        {toast.tone === 'success' && (
          <CheckCircle2 className="size-[18px] text-ember" />
        )}
        {toast.tone === 'error' && (
          <AlertTriangle className="size-[18px] text-ember" />
        )}
        {toast.tone === 'default' && (
          <span className="block size-2 translate-y-1.5 rounded-full bg-ink" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-ink">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-[12px] leading-snug text-muted">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="dismiss"
        className="shrink-0 rounded-md p-0.5 text-faint transition-colors hover:text-ink"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
