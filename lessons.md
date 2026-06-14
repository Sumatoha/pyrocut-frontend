# lessons — pyrocut frontend

Значимые баги: корневая причина, симптом, фикс. Max 1000 строк.
Формат: ## [дата] Название → Симптом / Причина / Фикс

## [2026-06-14] App Router: папки с `_` приватные → Симптом: `/_kitchen` не появлялся в роутах (build показывал только `/`). Причина: в Next App Router папки с префиксом `_` — private folders, исключены из роутинга. Фикс: переименовал в `app/kitchen` (route `/kitchen`).

## [2026-06-14] @supabase/ssr setAll implicit any → Симптом: tsc TS7006 на `setAll(toSet)` в server.ts/middleware.ts. Причина: createServerClient перегружен (deprecated get/set/remove + новый getAll/setAll), контекстная типизация колбэка не срабатывает. Фикс: явно аннотировал параметр `CookieToSet[]` (`{name,value,options:CookieOptions}`), `CookieOptions` импортируется из `@supabase/ssr`.

## [2026-06-14] Интеграция фронт↔бэк: 3 расхождения контракта → Симптом: при подключении к реальному API фронт получал бы конверт вместо данных, неверные имена полей и неиграбельные ссылки. Причина: (1) бэк отдаёт конверт `{ok,data}`, а `request<T>` возвращал `data as T` целиком; (2) фронтовый shared был snake_case (`mp4_path`, `palette`, `headline`), бэк отдаёт camelCase (`mp4Path`, `colors`, `h1`); (3) buckets ПРИВАТНЫЕ — бэк отдаёт storage-ПУТЬ, не URL, а `<video src>`/`<img src>` ждали готовую ссылку; (4) Supabase Realtime присылает СЫРЫЕ snake_case строки (в обход бэк-мапперов), хотя REST отдаёт camelCase; (5) таблица `profiles` без колонки `email`. Фикс: бэкенд = единственный источник контракта, фронтовый `packages/shared` зеркалит его camelCase; `request<T>` разворачивает конверт; `lib/client/storage.ts` подписывает пути (`createSignedUrl`) + хук `useSignedUrl`; `lib/client/mappers.ts` мапит realtime-строки snake→camel; email берётся из auth-юзера, не из profiles.
