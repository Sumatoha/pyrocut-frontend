# lessons — pyrocut frontend

Значимые баги: корневая причина, симптом, фикс. Max 1000 строк.
Формат: ## [дата] Название → Симптом / Причина / Фикс

## [2026-06-15] Видео-страница: битый роут `/v/:id` + iframe показывал HTML-код
**Симптом:** клик по карточке видео (дашборд) и по вариации (сайдбар детали) «выкидывал»
(404); при live-preview генерящегося видео в iframe был виден исходный HTML, не анимация;
share/variation молча не давали фидбэка.
**Причина:** (1) `<Link href="/v/${id}">` в `video-card.tsx` и `video-detail.tsx` — без
префикса `/app` (все роуты под `app/app/**` → `/app/v/[id]`), 404. (2) iframe грузил
композицию через `src` от Supabase signed URL; Supabase отдаёт пользовательский HTML как
`text/plain`+`nosniff` → браузер рендерит исходник. (3) `copyShare`/`makeVariation` в детали
глотали успех/ошибку (toast-провайдер есть в layout, но тут не использовался).
**Фикс:** (1) `/v/${id}` → `/app/v/${id}` в обоих местах. (2) новый `composition-preview.tsx`:
fetch HTML → `<iframe srcDoc>` (srcDoc всегда парсится как HTML, не зависит от content-type) +
loading/failed. (3) `useToast` в детали: link copied / could not copy / could not create variation.
Урок: в App Router ссылки от корня включают сегмент-группу (`/app/...`); пользовательский HTML
из Supabase Storage рендерить только через `srcDoc`.

## [2026-06-14] App Router: папки с `_` приватные → Симптом: `/_kitchen` не появлялся в роутах (build показывал только `/`). Причина: в Next App Router папки с префиксом `_` — private folders, исключены из роутинга. Фикс: переименовал в `app/kitchen` (route `/kitchen`).

## [2026-06-14] @supabase/ssr setAll implicit any → Симптом: tsc TS7006 на `setAll(toSet)` в server.ts/middleware.ts. Причина: createServerClient перегружен (deprecated get/set/remove + новый getAll/setAll), контекстная типизация колбэка не срабатывает. Фикс: явно аннотировал параметр `CookieToSet[]` (`{name,value,options:CookieOptions}`), `CookieOptions` импортируется из `@supabase/ssr`.

## [2026-06-14] checkout('free') → бэк 400 → Симптом: юзер на pro/studio жал «switch to hobby» на free-карточке, получал тост «could not start checkout». Причина: кнопка free была disabled только когда план текущий; иначе `upgrade('free')` → `api.checkout('free')`, но бэк-схема `CheckoutSchema = PlanSchema.exclude(['free'])` отклоняла zod-400 ($0 нельзя оформить через Polar). Фикс: сузил тип `api.checkout` до `Exclude<Plan,'free'>` (контракт честный, ловит компилятором); в `upgrade` ранний `return` для 'free' (control-flow narrowing → каст не нужен); кнопку free задизейблил всегда («free forever»). Даунгрейд/отмена — отдельный флоу (не реализован, MVP).

## [2026-06-14] Интеграция фронт↔бэк: 3 расхождения контракта → Симптом: при подключении к реальному API фронт получал бы конверт вместо данных, неверные имена полей и неиграбельные ссылки. Причина: (1) бэк отдаёт конверт `{ok,data}`, а `request<T>` возвращал `data as T` целиком; (2) фронтовый shared был snake_case (`mp4_path`, `palette`, `headline`), бэк отдаёт camelCase (`mp4Path`, `colors`, `h1`); (3) buckets ПРИВАТНЫЕ — бэк отдаёт storage-ПУТЬ, не URL, а `<video src>`/`<img src>` ждали готовую ссылку; (4) Supabase Realtime присылает СЫРЫЕ snake_case строки (в обход бэк-мапперов), хотя REST отдаёт camelCase; (5) таблица `profiles` без колонки `email`. Фикс: бэкенд = единственный источник контракта, фронтовый `packages/shared` зеркалит его camelCase; `request<T>` разворачивает конверт; `lib/client/storage.ts` подписывает пути (`createSignedUrl`) + хук `useSignedUrl`; `lib/client/mappers.ts` мапит realtime-строки snake→camel; email берётся из auth-юзера, не из profiles.

## [2026-06-15] Magic link кидает на лендинг + архитектура доменов → Симптом: после клика по ссылке из письма юзера редиректит на лендинг, сессии нет. Причина (2 слоя): (1) `/auth/callback` не в allowlist «Redirect URLs» Supabase → при невалидном redirect_to Supabase молча падает на Site URL; (2) ОДИН Vercel-проект `pyrocut` висел на 3 доменах (`pyrocut.com`,`www.`,`app.`) и все отдавали и лендинг, и дашборд — host-разделения не было, sign-in ссылки относительные → логин происходил на том домене, где юзер. При этом вся инфра уже завязана на `app.pyrocut.com`: backend `APP_URL=https://app.pyrocut.com` (CORS однооргиновый `Access-Control-Allow-Origin=APP_URL`, бэк тоже на Vercel — проект `pyrocut-backend-api`), Polar successUrl, Supabase Site URL. Фикс — достроили 2-доменную модель (НЕ единый домен): `pyrocut.com`/`www` = лендинг, `app.pyrocut.com` = продукт. В `next.config.ts` host-based `redirects()`/`rewrites()` (`has`/`missing` type:'host'): app-host `/`→`/app`; marketing-host `/login`,`/app/*`→`https://app.pyrocut.com/...`; лендинг-rewrite `/`→`/landing.html` только когда host≠app. Localhost/`*.vercel.app` под host-правила не попадают → работают сами. Code-fix в коде уже верный (login-form `emailRedirectTo=origin/auth/callback?next=/app`), менять не пришлось. ОСТАЛОСЬ вручную (Supabase MCP НЕ пишет Auth-конфиг, токена нет): Authentication → URL Configuration → Site URL=`https://app.pyrocut.com`, Redirect URLs = `https://app.pyrocut.com/auth/callback`,`https://app.pyrocut.com/**`,`http://localhost:3000/auth/callback`,`https://*.vercel.app/auth/callback`. NB: Auth-конфиг правится только дашбордом или Management API курлом с `sbp_`-токеном.

## [2026-07-04] «download mp4» открывал плеер Safari в новой вкладке → Симптом: клик по download открывает вкладку с нативным видеоплеером, скачивания нет. Причина: `<a download href={signedUrl}>` — атрибут `download` работает ТОЛЬКО для same-origin URL; Supabase Storage — другой origin, браузер просто навигирует на mp4. Фикс: подписывать ОТДЕЛЬНУЮ ссылку с опцией `createSignedUrl(path, ttl, { download: 'name.mp4' })` → Supabase добавляет `?download=` и отдаёт `content-disposition: attachment` — скачивание форсится сервером, не атрибутом. `useSignedUrl(bucket, path, download?)` принимает имя файла третьим аргументом.
