'use client';

import { useEffect, useState } from 'react';

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `00:${pad(m)}:${pad(s)}`;
}

/**
 * Живой таймер «сколько идёт рендер» от createdAt. Тикает раз в секунду пока active.
 * Делает индикатор ожидания живым вместо статичного 00:00:00.
 */
export function useElapsed(createdAt: string | undefined, active: boolean): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!createdAt) return '00:00:00';
  const start = new Date(createdAt).getTime();
  if (!Number.isFinite(start)) return '00:00:00';
  return fmt(now - start);
}
