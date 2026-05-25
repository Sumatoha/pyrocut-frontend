const BRAND_COLOR = "#5B4DEF";
const HEAT_COLOR = "#FF5A1F";

function layout(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #F5F5F4; font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; color: #0B0B0E; -webkit-font-smoothing: antialiased; }
    .container { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
    .card { background: #FFFFFF; border-radius: 22px; padding: 40px 32px; border: 1px solid rgba(11,11,14,0.10); }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
    .logo svg { display: block; }
    .logo span { font-family: Inter, -apple-system, sans-serif; font-weight: 600; font-size: 18px; }
    h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 16px; }
    p { font-size: 14px; line-height: 1.6; color: #2A2A2F; margin: 0 0 16px; }
    .key-box { background: #F5F5F4; border: 1px solid rgba(11,11,14,0.10); border-radius: 10px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 15px; letter-spacing: 0.04em; text-align: center; margin: 20px 0; word-break: break-all; }
    .btn { display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 14px 28px; border-radius: 999px; font-size: 14px; font-weight: 500; text-decoration: none; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #6B6B72; }
    .footer a { color: ${BRAND_COLOR}; text-decoration: none; }
    .highlight { color: ${HEAT_COLOR}; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="8" fill="#0B0B0E"/><path d="M9.5 21.5 C 9 16 10.5 13 13.5 11 L 20 5.5 L 18 12.5 C 20.5 13.5 21.5 16.2 21.5 18.4 C 21.5 21 19 23.2 15.5 23.2 C 13 23.2 11 22.6 9.5 21.5 Z" fill="#FF5A1F"/><circle cx="20" cy="5.5" r="1.6" fill="#FFB85C"/></svg>
        <span>pyrocut</span>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 pyrocut labs · <a href="https://pyrocut.app">pyrocut.app</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeProEmail(licenseKey: string) {
  return layout(`
    <h1>Welcome to Pyrocut Founder</h1>
    <p>Your subscription is active. Here's your license key — paste it into Pyrocut on first launch.</p>
    <div class="key-box">${licenseKey}</div>
    <p>You can activate up to <span class="highlight">3 devices</span>. Manage activations anytime from your account portal.</p>
    <p style="margin-top: 24px;">
      <a href="https://pyrocut.app/account" class="btn">Open your account →</a>
    </p>
    <p style="margin-top: 24px; font-size: 13px; color: #6B6B72;">
      Need the app? <a href="https://pyrocut.app/api/download/pyrocut" style="color: ${BRAND_COLOR};">Download Pyrocut for Mac</a>
    </p>
  `);
}

export function welcomeLifetimeEmail(licenseKey: string) {
  return layout(`
    <h1>Welcome to Pyrocut — Lifetime</h1>
    <p>One payment. Yours forever. All future updates included, no renewal needed.</p>
    <div class="key-box">${licenseKey}</div>
    <p>You can activate up to <span class="highlight">5 devices</span>. Manage activations from your account portal.</p>
    <p style="margin-top: 24px;">
      <a href="https://pyrocut.app/account" class="btn">Open your account →</a>
    </p>
    <p style="margin-top: 24px; font-size: 13px; color: #6B6B72;">
      Need the app? <a href="https://pyrocut.app/api/download/pyrocut" style="color: ${BRAND_COLOR};">Download Pyrocut for Mac</a>
    </p>
  `);
}
