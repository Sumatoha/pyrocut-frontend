/**
 * Детерминированный кинематографичный backdrop для thumbnail, когда нет
 * thumbPath (ещё рендерится / demo). Тёмная «win»-эстетика как на лендинге.
 */
const STAGES = [
  'radial-gradient(120% 80% at 20% 0%, #3A1F12 0%, transparent 55%), radial-gradient(140% 90% at 90% 100%, #2A1230 0%, transparent 60%), linear-gradient(180deg, #17141f 0%, #100e16 100%)',
  'radial-gradient(110% 80% at 80% 10%, #4A2310 0%, transparent 55%), radial-gradient(120% 90% at 10% 100%, #241a3a 0%, transparent 60%), linear-gradient(180deg, #15131c 0%, #0e0c14 100%)',
  'radial-gradient(120% 80% at 50% 0%, #2c1c46 0%, transparent 55%), radial-gradient(140% 90% at 80% 100%, #3a1a12 0%, transparent 60%), linear-gradient(180deg, #16131e 0%, #100e16 100%)',
  'radial-gradient(120% 80% at 10% 10%, #45260f 0%, transparent 50%), radial-gradient(120% 90% at 95% 90%, #1f1730 0%, transparent 60%), linear-gradient(180deg, #161320 0%, #0f0d15 100%)',
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function stageGradient(seed: string): string {
  return STAGES[hash(seed) % STAGES.length];
}
