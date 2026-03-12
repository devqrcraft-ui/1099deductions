(function () {
  const WORKER_URL = 'https://dry-flower-b3e7.dev-qrcraft.workers.dev/';

  const SITE_CONFIGS = {
    '1099deductions.com': {
      name: '1099 AI',
      greetings: {
        en: 'Hi! Ask me about deductions, calculator, deadlines or any gig job type.',
        uk: 'Привіт! Запитайте про відрахування, калькулятор, дедлайни або тип роботи.',
        ru: 'Привет! Спрашивайте о вычетах, калькуляторе, дедлайнах или типе работы.'
      },
      systemPrompt: `You are a smart, concise AI assistant for 1099Deductions.com — a free US tax deductions tool for gig workers.

YOUR ROLE: Guide users to use the site features themselves. Do NOT calculate for them — point them to the right tool/page.

SITE PAGES & NAVIGATION (JavaScript SPA — no page reloads):
- HOME: Headline "Find Every Tax Write-Off You're Missing". Right side: Savings Estimator widget.
- BY JOB TYPE (showPage('jobs')): Grid of 14 gig jobs. Click a card → opens deduction checklist.
- CALCULATOR (showPage('calculator')): Steps: 1) pick job, 2) enter annual income, 3) state, 4) click "Calculate My Tax Savings →".
- DEADLINES (showPage('deadlines')): 2026 IRS quarterly dates. Q1: Apr 15, Q2: Jun 16, Q3: Sep 15, Q4: Jan 15 2027.
- BLOG: Tax articles for gig workers.

AVAILABLE GIG JOBS (14): DoorDash, Uber, Instacart, Amazon Flex, Lyft, Etsy, OnlyFans, Airbnb, Fiverr, TaskRabbit, Rover, Upwork, Postmates, Shipt.

TOP DEDUCTIONS:
- Mileage: 67¢/mile for delivery/rideshare
- Phone: 50-100% of bill
- Internet: portion for gig work
- Home office: for online-based gigs
- Supplies, platform fees — varies by job

GUIDING APPROACH:
- Ask what gig job they do if not specified
- Tell them WHICH PAGE to go to: "Click 'By Job Type' → pick DoorDash → see your full deduction checklist"
- For amounts → "Use the Calculator tab to get exact numbers for your state"
- 1-3 sentences max, one guiding question per reply`
    },
    'privatepaycheck.com': {
      name: 'Paycheck AI',
      greetings: {
        en: "Hi! I'm your Paycheck Assistant. I know this site inside out — calculator, all 50 states, tax rules. What would you like to know?",
        uk: 'Привіт! Я ваш помічник з розрахунку зарплати. Знаю калькулятор, всі 50 штатів, податкові правила.',
        ru: 'Привет! Я ваш помощник по расчёту зарплаты. Знаю калькулятор, все 50 штатов, налоговые правила.'
      },
      systemPrompt: `You are the AI assistant for PrivatePaycheck.com — free US paycheck calculator for all 50 states.

YOUR ROLE: Help users navigate the site and understand how to use the calculator. Guide them to the tool — do NOT calculate for them.

SITE PAGES:
- HOME: Hero "Calculate Your Exact Take-Home Pay". CTA: "CALCULATE MY PAY →"
- CALCULATOR (main tool): 1) Pay Type (Annual/Hourly), 2) Gross amount, 3) Pay Frequency, 4) State, 5) Filing Status → hit "CALCULATE MY PAY". Shows: Federal Tax, State Tax, FICA, Net Pay.
- ALL STATES: Tax rates for all 50 states. No-tax states: FL, TX, NV, WA, WY, SD, TN, NH.
- BLOG: Tax tips, IRS updates 2026.

KEY FACTS (for context only — always say "use the calculator for your exact number"):
- FICA: 7.65% (Social Security 6.2% + Medicare 1.45%)
- Standard deduction 2026: $14,600 single / $29,200 married
- No data stored, completely free, no registration

GUIDING APPROACH:
- Ask what they need: salary or hourly? Which state?
- Tell them exactly which fields to fill: "Go to the Calculator → set Pay Type to Hourly → enter your rate → pick your state"
- 1-3 sentences max, one guiding question per reply`
    },
    'gigwisetax.com': {
      name: 'GigWise AI',
      greetings: {
        en: 'Hi! Ask me about gig taxes, deductions or quarterly payments.',
        uk: 'Привіт! Запитайте про податки для гіг-воркерів, відрахування або квартальні платежі.',
        ru: 'Привет! Спрашивайте о налогах для гиг-работников, вычетах или квартальных платежах.'
      },
      systemPrompt: `You are the AI assistant for GigWiseTax.com — free self-employment tax calculator for US gig workers.

YOUR ROLE: Explain concepts simply and guide users to the right tool. Do NOT calculate — point to the calculator.

SITE PAGES:
- HOME: Tab calculator. Tabs: "Tax Calculator" | "2026 Deadlines" | "All Platforms".
- CALCULATORS: SE Tax (15.3% + state), Quarterly Payment with Google Calendar export.
- TAX TOOLS: Mileage tracker (67¢/mile), Deductions finder, Home office calculator.
- BY STATE: All 51 jurisdictions. Each has state rate + gig worker rules.
- PLATFORMS: DoorDash, Uber, Lyft, Instacart, Etsy, OnlyFans, Airbnb, Upwork, Fiverr — each with specific deductions.
- RESOURCES: Guides for quarterly taxes, Schedule C, SE tax explained.

KEY FACTS (context only):
- SE Tax = 15.3% (12.4% SS + 2.9% Medicare) on net earnings
- 50% of SE tax is deductible
- Quarterly 2026: Q1 Apr 15, Q2 Jun 16, Q3 Sep 15, Q4 Jan 15 2027
- Pay quarterly if you expect to owe $1,000+
- Top deductions: mileage, phone, internet, supplies, platform fees

GUIDING APPROACH:
- Ask which platform they work on if not specified
- Guide: "Open the Tax Calculator tab → enter your net income → pick your state → see your SE tax + quarterly amount"
- Explain WHAT a term means, then say "the calculator shows your exact number"
- 1-3 sentences max, one guiding question per reply`
    },
    'compressto20kb.com': {
      name: 'Compress AI',
      greetings: {
        en: 'Hi! I can help you compress images to any size. What format is your image?',
        uk: 'Привіт! Допоможу стиснути зображення до потрібного розміру. Який формат вашого файлу?',
        ru: 'Привет! Помогу сжать изображение до нужного размера. Какой формат вашего файла?'
      },
      systemPrompt: `You are the AI assistant for CompressTo20KB.com — free browser-based image compression tool.

YOUR ROLE: Help users understand how to compress their image effectively. Guide them through the steps.

SITE FEATURES:
- UPLOAD: Drag & drop or click. Supports JPEG, PNG, WebP, AVIF, GIF.
- TARGET SIZE: Set desired KB (default: 20KB).
- COMPRESS: Click "Compress" → auto-reduces quality/resolution to hit target.
- DOWNLOAD: Instant download. No account needed.
- FORMATS: Convert between formats (PNG→WebP etc.) for better compression.
- PRIVACY: Processed in browser, never uploaded to server.

KEY TIPS:
- WebP = 25-34% smaller than JPEG at same quality
- AVIF = smallest, but older browsers may not support
- Photos → JPEG or WebP
- Logos/graphics with transparency → PNG or WebP
- Image still too big? → try switching to WebP format first

GUIDING APPROACH:
- Ask what they're trying to do (what size target? what format is the original?)
- Give a specific tip based on their situation
- 1-3 sentences max, one guiding question per reply`
    }
  };

  function getConfig() {
    const host = window.location.hostname.replace('www.', '');
    return SITE_CONFIGS[host] || SITE_CONFIGS['gigwisetax.com'];
  }

  // Detect language from browser OR text
  function detectLang(text) {
    if (text) {
      const hasUkr = /[іїєґ]/i.test(text);
      const hasCyr = /[а-яёА-ЯЁ]/i.test(text);
      const hasRu = /[ъыэёЪЫЭЁ]/i.test(text);
      if (hasCyr && !hasRu && hasUkr) return 'uk';
      if (hasCyr && hasRu) return 'ru';
      if (hasCyr) return 'uk'; // default Cyrillic to Ukrainian
    }
    // Browser language fallback
    const bl = (navigator.language || 'en').toLowerCase();
    if (bl.startsWith('uk')) return 'uk';
    if (bl.startsWith('ru')) return 'ru';
    return 'en';
  }

  const LANG_NAMES = { en: 'English', uk: 'Ukrainian', ru: 'Russian' };

  const config = getConfig();
  let messages = [];
  let isOpen = false;
  let isSending = false;
  let detectedLang = detectLang(null); // initial from browser

  // ── STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    html, body { overflow-x: hidden !important; max-width: 100% !important; }
    * { box-sizing: border-box; }

    #ai-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #B8924A;
      border: none;
      cursor: pointer;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 14px rgba(184,146,74,0.5);
      transition: transform 0.2s;
      animation: fabGlow 2.5s ease-in-out infinite;
    }
    #ai-fab:hover { transform: scale(1.08); }
    #ai-fab svg { width: 22px; height: 22px; fill: #fff; }
    @keyframes fabGlow {
      0%,100% { box-shadow: 0 3px 14px rgba(184,146,74,0.5); }
      50% { box-shadow: 0 0 24px 8px rgba(184,146,74,0.8); }
    }

    #ai-chat-window {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 310px;
      height: 400px;
      max-height: 60vh;
      background: #0D1F38;
      border: 1px solid rgba(184,146,74,0.35);
      border-radius: 12px;
      display: none;
      flex-direction: column;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.55);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #ai-chat-window.open { display: flex; }

    @media (max-width: 600px) {
      #ai-chat-window {
        position: fixed;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        top: auto !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 55vh !important;
        max-height: 55vh !important;
        border-radius: 14px 14px 0 0;
        border-left: none;
        border-right: none;
        border-bottom: none;
      }
      #ai-fab {
        bottom: 16px;
        right: 16px;
        width: 48px;
        height: 48px;
      }
      #ai-fab svg { width: 20px; height: 20px; }
      .ai-msg { font-size: 14px !important; }
      #ai-chat-input { font-size: 16px !important; }
    }

    #ai-chat-header {
      background: #0A1828;
      padding: 9px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(184,146,74,0.2);
      flex-shrink: 0;
    }
    #ai-chat-header-left { display: flex; align-items: center; gap: 8px; }
    #ai-online-dot { width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; flex-shrink: 0; }
    #ai-chat-name { color: #B8924A; font-weight: 700; font-size: 13px; }
    #ai-chat-sub { color: #8899AA; font-size: 10px; margin-top: 1px; }
    #ai-chat-close {
      background: none; border: none; cursor: pointer;
      color: #B8924A; font-size: 22px; padding: 0 4px; line-height: 1;
      font-weight: 700; opacity: 0.8;
    }
    #ai-chat-close:hover { color: #fff; opacity: 1; }

    #ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-height: 0;
    }
    #ai-chat-messages::-webkit-scrollbar { width: 3px; }
    #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(184,146,74,0.3); border-radius: 2px; }

    .ai-msg {
      max-width: 88%;
      padding: 8px 11px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
    .ai-msg.bot {
      background: #162840;
      color: #D0E0F0;
      align-self: flex-start;
      border: 1px solid rgba(184,146,74,0.12);
    }
    .ai-msg.user {
      background: #B8924A;
      color: #fff;
      align-self: flex-end;
    }
    .ai-msg.typing { color: #8899AA; font-style: italic; font-size: 18px; letter-spacing: 2px; }

    #ai-chat-input-row {
      display: flex;
      gap: 6px;
      padding: 8px 10px;
      border-top: 1px solid rgba(184,146,74,0.2);
      background: #0A1828;
      flex-shrink: 0;
    }
    #ai-chat-input {
      flex: 1;
      background: #162840;
      border: 1px solid rgba(184,146,74,0.25);
      border-radius: 7px;
      color: #D0E0F0;
      font-size: 13px;
      padding: 7px 10px;
      outline: none;
      min-width: 0;
    }
    #ai-chat-input::placeholder { color: #556677; }
    #ai-chat-input:focus { border-color: rgba(184,146,74,0.6); }
    #ai-chat-send {
      background: #B8924A;
      border: none;
      border-radius: 7px;
      color: #fff;
      font-size: 16px;
      padding: 0 13px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #ai-chat-send:hover { background: #d4a84e; }
    #ai-chat-send:disabled { background: #4a3a1a; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // ── FAB ──
  const fab = document.createElement('button');
  fab.id = 'ai-fab';
  fab.title = config.name;
  fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
  document.body.appendChild(fab);

  // ── CHAT WINDOW ──
  const win = document.createElement('div');
  win.id = 'ai-chat-window';
  win.innerHTML = `
    <div id="ai-chat-header">
      <div id="ai-chat-header-left">
        <div id="ai-online-dot"></div>
        <div>
          <div id="ai-chat-name">${config.name}</div>
          <div id="ai-chat-sub">Online · Fast replies</div>
        </div>
      </div>
      <button id="ai-chat-close">−</button>
    </div>
    <div id="ai-chat-messages"></div>
    <div id="ai-chat-input-row">
      <input id="ai-chat-input" type="text" placeholder="Ask a question..." autocomplete="off" />
      <button id="ai-chat-send">&#10148;</button>
    </div>
  `;
  document.body.appendChild(win);

  const msgContainer = win.querySelector('#ai-chat-messages');
  const input = win.querySelector('#ai-chat-input');
  const sendBtn = win.querySelector('#ai-chat-send');
  const closeBtn = win.querySelector('#ai-chat-close');

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    div.textContent = text;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return div;
  }

  function openChat() {
    isOpen = true;
    win.classList.add('open');
    if (messages.length === 0) {
      const greeting = config.greetings[detectedLang] || config.greetings['en'];
      setTimeout(() => {
        addMessage(greeting, 'bot');
        messages.push({ role: 'assistant', content: greeting });
      }, 120);
    }
    setTimeout(() => input.focus(), 250);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('open');
  }

  fab.addEventListener('click', () => { if (isOpen) closeChat(); else openChat(); });
  closeBtn.addEventListener('click', closeChat);

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isSending) return;

    // Update detected language from user's text
    const msgLang = detectLang(text);
    if (msgLang !== 'en') detectedLang = msgLang; // update if non-english detected

    isSending = true;
    sendBtn.disabled = true;
    input.value = '';

    addMessage(text, 'user');
    messages.push({ role: 'user', content: text });

    const typingDiv = addMessage('···', 'bot typing');

    const langName = LANG_NAMES[detectedLang] || 'English';
    const systemWithLang = `${config.systemPrompt}\n\nLANGUAGE RULE: The user is communicating in ${langName}. You MUST reply ONLY in ${langName}. Never switch languages.`;

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: systemWithLang,
          messages: messages.slice(-10)
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Worker error:', res.status, errText);
        typingDiv.textContent = detectedLang === 'uk' ? 'Сервіс недоступний. Спробуйте пізніше.' :
                                 detectedLang === 'ru' ? 'Сервис недоступен. Попробуйте позже.' :
                                 'Service unavailable. Try again shortly.';
        typingDiv.classList.remove('typing');
      } else {
        const data = await res.json();
        const reply = data.response || (data.content && data.content[0] && data.content[0].text) || data.reply || data.text || data.message || '...';
        typingDiv.textContent = reply;
        typingDiv.classList.remove('typing');
        messages.push({ role: 'assistant', content: reply });
      }
    } catch (e) {
      console.error('Chat error:', e);
      typingDiv.textContent = detectedLang === 'uk' ? 'Помилка з\'єднання. Перевірте інтернет.' :
                               detectedLang === 'ru' ? 'Ошибка соединения. Проверьте интернет.' :
                               'Connection error. Check your internet.';
      typingDiv.classList.remove('typing');
    }

    isSending = false;
    sendBtn.disabled = false;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  // Auto-open after 6s
  setTimeout(() => { if (!isOpen) openChat(); }, 6000);

})();
