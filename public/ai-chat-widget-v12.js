(function () {
  // Prevent double-load
  if (window.__aiChatLoaded) return;
  window.__aiChatLoaded = true;

  const WORKER_URL = 'https://dry-flower-b3e7.dev-qrcraft.workers.dev/';

  const SITE_CONFIGS = {
    '1099deductions.com': {
      name: '1099 AI',
      greeting: 'Hi! Ask me about deductions, calculator, deadlines or any gig job type.',
      systemPrompt: `You are a helpful assistant for 1099Deductions.com — a free US tax deductions tool for gig workers (1099 contractors).

SITE PAGES (JavaScript SPA):
- HOME: "Find Every Tax Write-Off You're Missing". Savings Estimator on the right.
- BY JOB TYPE: Grid of 14 gig jobs → click → deduction checklist for that job.
- CALCULATOR: 1) pick job 2) enter income 3) pick state 4) click "Calculate My Tax Savings →"
- DEADLINES: 2026 IRS quarterly dates. Q1: Apr 15, Q2: Jun 16, Q3: Sep 15, Q4: Jan 15 2027.
- BLOG: Tax articles.

GIG JOBS (14): DoorDash, Uber, Instacart, Amazon Flex, Lyft, Etsy, OnlyFans, Airbnb, Fiverr, TaskRabbit, Rover, Upwork, Postmates, Shipt.

DEDUCTIONS: Mileage 67¢/mile, phone 50-100%, internet, home office, supplies, platform fees.

BEHAVIOR:
- Short answers (1-3 sentences)
- Guide to site tools, don't calculate yourself
- Ask ONE follow-up question if needed
- Off-topic → redirect politely`
    },
    'privatepaycheck.com': {
      name: 'Paycheck AI',
      greeting: "Hi! I'm your Paycheck Assistant. I know this site inside out — calculator, all 50 states, tax rules. What would you like to know?",
      systemPrompt: `You are the assistant for PrivatePaycheck.com — free US paycheck calculator for all 50 states.

SITE PAGES:
- HOME: "Calculate Your Exact Take-Home Pay". CTA: "CALCULATE MY PAY →"
- CALCULATOR: 1) Pay Type (Annual/Hourly) 2) Gross amount 3) Pay Frequency 4) State 5) Filing Status → "CALCULATE MY PAY". Results: Federal Tax, State Tax, FICA, Net Pay.
- ALL STATES: Tax rates all 50 states. No-tax: FL, TX, NV, WA, WY, SD, TN, NH.
- BLOG: Tax tips, IRS updates 2026.

KEY FACTS: FICA 7.65%, standard deduction $14,600 single / $29,200 married. Free, no data stored.

BEHAVIOR:
- Short answers (1-3 sentences)
- Guide to calculator, don't calculate yourself
- Ask ONE follow-up if needed
- Off-topic → redirect politely`
    },
    'gigwisetax.com': {
      name: 'GigWise AI',
      greeting: 'Hi! Ask me about gig taxes, deductions or quarterly payments.',
      systemPrompt: `You are the assistant for GigWiseTax.com — free self-employment tax calculator for US gig workers.

SITE PAGES:
- HOME: Tab calculator. Tabs: "Tax Calculator" | "2026 Deadlines" | "All Platforms"
- CALCULATORS: SE Tax (15.3% + state), Quarterly Payment with Google Calendar export
- TAX TOOLS: Mileage tracker (67¢/mile), Deductions finder, Home office calculator
- BY STATE: All 51 jurisdictions with state rates
- PLATFORMS: DoorDash, Uber, Lyft, Instacart, Etsy, OnlyFans, Airbnb, Upwork, Fiverr — each with deductions
- RESOURCES: Guides for quarterly taxes, Schedule C, SE tax

KEY FACTS: SE Tax = 15.3%. Quarterly 2026: Q1 Apr 15, Q2 Jun 16, Q3 Sep 15, Q4 Jan 15 2027. Pay quarterly if owe $1,000+. Mileage: 67¢/mile.

BEHAVIOR:
- Short answers (1-3 sentences)
- Guide to site tools, don't calculate yourself
- Ask ONE follow-up if needed
- Off-topic → redirect politely`
    },
    'compressto20kb.com': {
      name: 'Compress AI',
      greeting: 'Hi! I can help you compress images to any size. What format is your image?',
      systemPrompt: `You are the assistant for CompressTo20KB.com — free browser-based image compression tool.

FEATURES:
- UPLOAD: Drag & drop or click. JPEG, PNG, WebP, AVIF, GIF.
- TARGET SIZE: Set desired KB (default 20KB). Presets: Shopify, Etsy, Amazon, Instagram, Gov 20KB, 50KB.
- MODES: Quality Mode or Exact KB Mode.
- FORMATS: WebP (70% smaller), AVIF (smallest), JPEG (compatible), PNG (lossless).
- COMPRESS → DOWNLOAD instantly. No account, no server upload, 100% private.

TIPS: WebP = best balance. AVIF = smallest file. PNG = for logos/transparency. Still too big → try WebP first.

BEHAVIOR:
- Short answers (1-3 sentences)
- Guide through steps, ask what they're trying to achieve
- Off-topic → redirect politely`
    }
  };

  function getConfig() {
    const host = window.location.hostname.replace('www.', '');
    return SITE_CONFIGS[host] || SITE_CONFIGS['gigwisetax.com'];
  }

  function detectLang(text) {
    if (!text) return 'en';
    const hasCyr = /[а-яёА-ЯЁіїєґІЇЄҐ]/.test(text);
    if (!hasCyr) return 'en';
    // Spanish check
    const hasSpanish = /[áéíóúüñ¿¡]/i.test(text);
    if (hasSpanish) return 'es';
    // Ukrainian specific letters
    const hasUkr = /[іїєґІЇЄҐ]/.test(text);
    const hasRuOnly = /[ъыэёЪЫЭЁ]/.test(text);
    if (hasRuOnly) return 'ru';
    if (hasUkr) return 'uk';
    return 'ru'; // default Cyrillic = Russian
  }

  // Also detect Spanish without Cyrillic
  function detectLangFull(text) {
    if (!text) return 'en';
    const hasSpanish = /[áéíóúüñ¿¡]/i.test(text);
    if (hasSpanish) return 'es';
    return detectLang(text);
  }

  const LANG_NAMES = { en: 'English', uk: 'Ukrainian', ru: 'Russian', es: 'Spanish' };

  const config = getConfig();
  let messages = [];
  let isOpen = false;
  let isSending = false;
  let currentLang = 'en';

  // ── STYLES ──
  const style = document.createElement('style');
  style.textContent = `
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
      transition: transform 0.2s, opacity 0.2s;
      animation: fabGlow 2.5s ease-in-out infinite;
    }
    #ai-fab.hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.7);
    }
    #ai-fab:hover { transform: scale(1.08); }
    #ai-fab svg { width: 22px; height: 22px; fill: #fff; }
    @keyframes fabGlow {
      0%,100% { box-shadow: 0 3px 14px rgba(184,146,74,0.5); }
      50% { box-shadow: 0 0 24px 8px rgba(184,146,74,0.8); }
    }

    #ai-chat-window {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 50vh;
      max-height: 50vh;
      background: #0D1F38;
      border: none;
      border-top: 1px solid rgba(184,146,74,0.35);
      border-radius: 14px 14px 0 0;
      display: none;
      flex-direction: column;
      z-index: 9999;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-sizing: border-box;
    }
    #ai-chat-window.open { display: flex; }

    @media (min-width: 601px) {
      #ai-chat-window {
        left: auto;
        right: 20px;
        bottom: 0;
        width: 340px;
        height: 46vh;
        max-height: 46vh;
        border-radius: 14px 14px 0 0;
        border: 1px solid rgba(184,146,74,0.35);
        border-bottom: none;
      }
    }

    #ai-chat-header {
      background: #0A1828;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(184,146,74,0.2);
      flex-shrink: 0;
    }
    #ai-chat-header-left { display: flex; align-items: center; gap: 8px; }
    #ai-online-dot { width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; flex-shrink: 0; }
    #ai-chat-name { color: #B8924A; font-weight: 700; font-size: 14px; }
    #ai-chat-sub { color: #8899AA; font-size: 11px; margin-top: 1px; }
    #ai-chat-close {
      background: none; border: none; cursor: pointer;
      color: #B8924A; font-size: 24px; padding: 0 4px; line-height: 1;
      font-weight: 700;
    }
    #ai-chat-close:hover { color: #fff; }

    #ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }
    #ai-chat-messages::-webkit-scrollbar { width: 3px; }
    #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(184,146,74,0.3); border-radius: 2px; }

    .ai-msg {
      max-width: 88%;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 14px;
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
    .ai-msg.typing { color: #8899AA; font-style: italic; }

    #ai-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 9px 12px;
      border-top: 1px solid rgba(184,146,74,0.2);
      background: #0A1828;
      flex-shrink: 0;
    }
    #ai-chat-input {
      flex: 1;
      background: #162840;
      border: 1px solid rgba(184,146,74,0.25);
      border-radius: 8px;
      color: #D0E0F0;
      font-size: 14px;
      padding: 8px 11px;
      outline: none;
      min-width: 0;
    }
    #ai-chat-input::placeholder { color: #556677; }
    #ai-chat-input:focus { border-color: rgba(184,146,74,0.6); }
    #ai-chat-send {
      background: #B8924A;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 16px;
      padding: 0 14px;
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
    if (isOpen) return;
    isOpen = true;
    win.classList.add('open');
    fab.classList.add('hidden');
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(config.greeting, 'bot');
        messages.push({ role: 'assistant', content: config.greeting });
      }, 150);
    }
    setTimeout(() => input.focus(), 300);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('open');
    fab.classList.remove('hidden');
  }

  fab.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isSending) return;

    // Detect language from user message
    const lang = detectLangFull(text);
    currentLang = lang;

    isSending = true;
    sendBtn.disabled = true;
    input.value = '';

    addMessage(text, 'user');
    messages.push({ role: 'user', content: text });

    const typingDiv = addMessage('···', 'bot typing');

    const langName = LANG_NAMES[currentLang] || 'English';
    const systemFull = `${config.systemPrompt}\n\nLANGUAGE: User wrote in ${langName}. Reply ONLY in ${langName}. Never switch languages.`;

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: systemFull,
          messages: messages.slice(-10)
        })
      });

      if (!res.ok) {
        typingDiv.textContent = 'Service unavailable. Try again shortly.';
        typingDiv.classList.remove('typing');
      } else {
        const data = await res.json();
        const reply = data.response || (data.content && data.content[0] && data.content[0].text) || data.reply || data.text || data.message || '...';
        typingDiv.textContent = reply;
        typingDiv.classList.remove('typing');
        messages.push({ role: 'assistant', content: reply });
      }
    } catch (e) {
      typingDiv.textContent = 'Connection error. Check your internet.';
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
// v12
