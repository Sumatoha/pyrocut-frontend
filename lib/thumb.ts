/**
 * Backdrop для стадии рендера / thumbnail без превью. Раньше был рандомный
 * пятнистый градиент по hash(id) — выглядел кривым и разнобойным. Теперь ОДНА
 * выверенная тёмная сцена (холодный верх → тёплый ember-пол у нижней кромки),
 * единообразная во всех местах: грид, деталь, визард. Сигнатуру (seed)
 * сохраняем — вызовы не трогаем.
 */
const STAGE =
  'radial-gradient(90% 60% at 50% 112%, rgba(255,90,31,0.10) 0%, transparent 60%), ' +
  'radial-gradient(130% 90% at 50% -25%, #1A1622 0%, transparent 60%), ' +
  'linear-gradient(180deg, #131018 0%, #0E0C13 100%)';

export function stageGradient(_seed: string): string {
  return STAGE;
}
