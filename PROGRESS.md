# PROGRESS — pyrocut frontend

## CURRENT STATE
- **done:** M0–M7 ✅ + ИНТЕГРАЦИЯ С БЭКОМ + ПЛОСКАЯ СТРУКТУРА ПОД VERCEL. build+typecheck зелёные.
  Контракт `shared/index.ts` синхронизирован с бэком (camelCase, зеркало backend/packages/shared).
  API-клиент разворачивает конверт `{ok,data}`. Realtime-строки мапятся snake→camel
  (`lib/client/mappers.ts`). Storage-пути приватных buckets подписываются
  (`lib/client/storage.ts` + `useSignedUrl`). Profile.email — из auth-юзера (в profiles колонки нет).
- **СТРУКТУРА:** монорепо `apps/web`+`packages/shared` сплющено в КОРЕНЬ репо
  (Vercel zero-config: фреймворк по корневому package.json). `@pyrocut/shared` → `shared/index.ts`
  через tsconfig-алиас; `pnpm-workspace.yaml` хранит только `allowBuilds: sharp: true` (иначе
  `pnpm install` exit 1 на ignored-builds → падает и Vercel-install). `next.config` без transpilePackages.
- **in-progress:** —
- **next:** VERIFIED на живом окружении: создать Supabase project (ОБЩИЙ с бэком),
  env на Vercel (`NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `NEXT_PUBLIC_API_BASE`),
  снять `NEXT_PUBLIC_DEMO`, прогнать live flow URL→brand→render→/v/:id.

## РОУТИНГ (важно)
- `/` → **публичный лендинг** (`public/landing.html`, отдаётся через `next.config` rewrite
  `beforeFiles: / → /landing.html`). CTA лендинга ведут на `/login`, лого — на `/`.
- `/app`, `/app/new`, `/app/billing`, `/app/v/[id]` → **продукт за авторизацией**
  (`app/app/**`). После логина редирект на `/app` (middleware + auth/callback + LoginForm).
- `/login`, `/auth/callback`, `/kitchen`, `/` — публичные в middleware (PUBLIC_PREFIXES + `/`).
- Лендинг = статика, в React НЕ оборачивается (свой `<html>`). Менять текст/CTA — в `public/landing.html`.

## LOCATION
- Весь фронтенд = КОРЕНЬ репо `frontend/` (один Next-проект, без apps/packages).
- Запуск: `cd frontend && pnpm dev|build|typecheck`. Команды под Node 22.
- DEMO-режим (UI без бэка): `NEXT_PUBLIC_DEMO=1 pnpm dev`. В UI метка «demo».

## RESUME HERE
Все майлстоуны фронта готовы. Дальше — подключение бэкенда:
1. Создать Supabase project, прописать `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` в `apps/web/.env.local`
   (degraded-баннер и login заработают по-настоящему, realtime включится).
2. Свериться с `packages/shared` от бэка (snake_case, поля Video/Project/Brand/Profile) — слить.
3. Когда живы эндпоинты §6 — снять `NEXT_PUBLIC_DEMO`, прогнать live flow: URL→brand→render→/v/:id.
4. profiles-таблица (id,email,plan,credits) для getProfile — иначе дефолт free/0.

## MILESTONES
- [x] M0. Scaffold: Next 15, Tailwind токены §3, шрифты, layout/навбар, тема, `lib/client/supabase.ts`.
- [x] M1. Примитивы `components/ui` (Button/Card/Chip/StatusDot/Scrubber/Toast/Skeleton/Modal/Dropzone) + витрина `/kitchen`.
- [x] M2. Auth (`/login`: magic link + Google OAuth) + middleware-guard + профиль/план в TopBar (AccountMenu + sign out).
- [x] M3. Dashboard `/` — сетка видео + realtime (useVideos) + empty/error/skeleton + demo-режим.
- [x] M4. New-video flow `/new` (4 шага §4) с realtime-стадиями. VERIFIED в demo (Playwright, все шаги). Реальный URL→ready — после бэка.
- [x] M5. Video detail `/v/[id]` — live iframe/MP4 + download + share + variations + delete. Проверено в demo.
- [x] M6. Billing `/billing` — тарифы (free=hobby/pro=founder/studio) + checkout + план/кредиты. Проверено в demo.
- [x] M7. Polish — мобильная навигация (адаптивная new-кнопка), адаптив проверен на 390px (dashboard/new/billing), focus-visible + reduced-motion глобально.

## DECISIONS
- Монорепо pnpm (`apps/web` + `packages/shared`). Tailwind **v4** (CSS-first `@theme`).
- Роуты: `(auth)/login`, `(dashboard)/` (page=dashboard), `(dashboard)/new`,
  `(dashboard)/v/[id]`, `(dashboard)/billing`. `/_kitchen` вне групп.
- `packages/shared` засеян нами из §6 (enums + интерфейсы) — контракт до появления бэка.
- Token-слой: CSS-переменные §3 в `globals.css` + маппинг в Tailwind `@theme`.
- Весь проект перенесён в `frontend/` (по просьбе) — корень репо общий для front+back.
- DEMO-режим: `NEXT_PUBLIC_DEMO=1` подменяет API на `lib/client/demo.ts`, метка «demo» в UI.
- Thumbnail без `thumb_path`: детерминированный кинематографичный градиент (`lib/thumb.ts`).
- Витрина: `/kitchen` (НЕ `/_kitchen` — папки с `_` в App Router приватные, исключены
  из роутинга; `/kitchen` — прагматичный эквивалент).
- Шрифты: системный стек (display=SF/system, mono=SF Mono/JetBrains) — без веб-загрузки.
- Кнопка-ссылка: `buttonClass(variant,size)` для `next/link` (Button остаётся `<button>`).
- Billing план-маппинг: free=hobby ($0), pro=founder ($19), studio=studio ($49). popular=pro (тёмная).

## OPEN QUESTIONS
- `packages/shared` владеет бэкенд. Сейчас засеян нами — при появлении бэка свериться/слить.
- API-эндпоинты (§6) ещё не существуют. Все вызовы помечены `// TODO(stub)`, при отсутствии
  бэка отдают мок/ошибку явно. Реальная проверка M4 (URL→ready) — после бэка.
- Supabase project ещё не создан. Клиент читает `NEXT_PUBLIC_SUPABASE_*`; без них —
  auth/realtime в degraded-режиме (явный warning).
- Магик-линк vs OAuth для `/login` — пока magic link (минимум). Уточнить.
