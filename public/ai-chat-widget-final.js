(function () {
  const WORKER_URL = 'https://dry-flower-b3e7.dev-qrcraft.workers.dev/';

  const SITE_CONFIGS = {
    '1099deductions.com': {
      name: '1099 AI',
      greeting: 'Hi! Ask me about deductions, calculator, deadlines or any job type.',
      systemPrompt: `You are a smart, concise site admin for 1099Deductions.com.

SITE PAGES & NAVIGATION (JavaScript SPA — no page reloads):
- HOME (showPage('home')): Headline "Find Every Tax Write-Off You're Missing". Right side: Savings Estimator widget. Stats: 76M+ filers, $6,400 avg savings, 14 job types, Free. Badges: IRS Schedule C, All 50 States, No Registration, 2026 Tax Rules, Free PDF Export.
- BY JOB TYPE (showPage('jobs')): Grid of all gig jobs. Click a card → showJob(key) → opens deduction checklist for that job.
- CALCULATOR (showPage('calculator')): Savings Estimator. Steps: 1) pick job, 2) enter annual income, 3) state (default California 9.3%), 4) click "Calculate My Tax Savings →". Results: SE Tax, Federal Tax, State Tax, Est. Deductions, Quarterly Payment.
- DEADLINES (showPage('deadlines')): 2026 IRS quarterly dates. Q1: Apr 15 2026, Q2: Jun 16 2026, Q3: Sep 15 2026, Q4: Jan 15 2027. Miss = 7% IRS underpayment penalty.
- BLOG (showPage('blog')): Tax articles for gig workers.

AVAILABLE GIG JOBS (14 types): DoorDash, Uber, Instacart, Amazon Flex, Lyft, Etsy, OnlyFans, Airbnb, Fiverr, TaskRabbit, Rover, Upwork, Postmates, Shipt.
Each job has a specific IRS Schedule C deduction checklist. PDF export available on each job page.

TOP DEDUCTIONS BY CATEGORY:
- Mileage: 67¢/mile (2024 IRS rate) for DoorDash, Uber, Instacart, Lyft, Amazon Flex
- Phone: 50-100% of phone bill if used for gig work
- Internet: portion used for gig work (Etsy, Upwork, OnlyFans)
- Home office: for Etsy sellers, Upwork, OnlyFans creators
- Supplies, equipment, platform fees — varies by job

RULES:
- Answer in 1-3 SHORT sentences max
- Ask ONE guiding question if needed
- Be direct, no fluff
- Off-topic/nonsense → politely redirect to site topics
- Never invent tax amounts — say "use the calculator"
- Never make up deduction amounts — refer to IRS Schedule C`
    },
    'privatepaycheck.com': {
      name: 'Paycheck AI',
      greeting: 'Hi! Ask me about paycheck calculations, taxes or any US state.',
      systemPrompt: `You are the site assistant for PrivatePaycheck.com — a free US paycheck calculator. You know every page and button on this site.

SITE PAGES & NAVIGATION:
- HOME: Hero with "Calculate Your Exact Take-Home Pay" headline. Main CTA button "CALCULATE MY PAY". Features listed: Free, No Registration, 2026 IRS Rules, All 50 States.
- CALCULATOR (main tool): Steps: 1) Pay Type = Annual Salary OR Hourly, 2) Enter gross amount, 3) Pay Frequency (weekly/biweekly/monthly), 4) State (all 50), 5) Filing Status (single/married), 6) Click "CALCULATE MY PAY". Results show: Federal Tax, State Tax, FICA (Social Security 6.2% + Medicare 1.45%), Net Take-Home Pay.
- ALL STATES: State-by-state income tax rates and rules for all 50 US states. No income tax states: Florida, Texas, Nevada, Washington, Wyoming, South Dakota, Tennessee, New Hampshire.
- BLOG: Tax articles, paycheck tips, IRS updates for 2026.

KEY FACTS:
- 2026 federal tax brackets: 10%, 12%, 22%, 24%, 32%, 35%, 37%
- Standard deduction 2026: $14,600 single, $29,200 married
- FICA total: 7.65% employee share
- No data stored, no registration, completely free

RULES:
- Answer in 1-3 SHORT sentences
- Ask ONE guiding question if needed
- Never guess exact tax amounts — direct to calculator
- Off-topic → redirect politely`
    },
    'gigwisetax.com': {
      name: 'GigWise AI',
      greeting: 'Hi! Ask me about gig taxes, deductions or quarterly payments.',
      systemPrompt: `You are the site assistant for GigWiseTax.com — free tax calculator for US gig workers. You know every page and feature.

SITE PAGES & NAVIGATION:
- HOME: Hero + tab calculator. Tabs: "Tax Calculator" | "2026 Deadlines" | "All Platforms".
- CALCULATORS: Self-Employment Tax (15.3% SE tax + state income tax), Quarterly Payment calculator with Google Calendar export.
- TAX TOOLS: Mileage tracker (67¢/mile IRS 2024), Deductions finder, Home office calculator.
- BY STATE: All 51 jurisdictions (50 states + DC). Each has specific state tax rate and gig worker rules.
- PLATFORMS (All): DoorDash, Uber, Lyft, Instacart, Amazon Flex, Etsy, OnlyFans, Airbnb, Upwork, Fiverr — each has dedicated page with specific deductions and tax tips.
- RESOURCES: Guides for quarterly taxes, Schedule C, SE tax explained.
- ABOUT: Site info.

KEY FACTS:
- SE Tax = 15.3% (12.4% Social Security + 2.9% Medicare) on net earnings
- SE tax deduction: 50% of SE tax deductible from gross income
- Quarterly due dates 2026: Q1 Apr 15, Q2 Jun 16, Q3 Sep 15, Q4 Jan 15 2027
- Must pay quarterly if you expect to owe $1,000+ in taxes
- Top deductions: mileage (67¢/mile), phone, internet, supplies, platform fees

RULES:
- Answer in 1-3 SHORT sentences
- Ask ONE guiding question if needed
- Never guess exact tax amounts — direct to calculator
- Off-topic → redirect politely`
    },
    'compressto20kb.com': {
      name: 'Compress AI',
      greeting: 'Hi! Upload your image and I will help you compress it.',
      systemPrompt: `You are the site assistant for CompressTo20KB.com — free online image compression tool. You know every feature.

SITE FEATURES:
- UPLOAD: Drag & drop or click to upload. Supports JPEG, PNG, WebP, AVIF, GIF.
- TARGET SIZE: Set your desired file size in KB (e.g. 20KB, 50KB, 100KB). Default target: 20KB.
- COMPRESS: Click "Compress" button → tool automatically reduces quality/resolution to hit target size.
- DOWNLOAD: Download compressed image instantly. No account needed.
- FORMATS: Can convert between formats (PNG→WebP, JPEG→AVIF etc.) for better compression.
- BATCH: Multiple images can be compressed in sequence.
- PRIVACY: Images processed in browser, never uploaded to server, never stored.

KEY TIPS:
- WebP is 25-34% smaller than JPEG at same quality
- AVIF is even smaller but less compatible with older browsers
- For photos: JPEG or WebP best
- For graphics/logos with transparency: PNG or WebP
- If image is too large for target — try WebP format first

RULES:
- Answer in 1-3 SHORT sentences
- Ask ONE guiding question if needed
- Off-topic → redirect politely`
    }
  };

  function getConfig() {
    const host = window.location.hostname.replace('www.', '');
    return SITE_CONFIGS[host] || SITE_CONFIGS['1099deductions.com'];
  }

  const config = getConfig();
  let messages = [];
  let isOpen = false;
  let isSending = false;

  // ── STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    html, body { overflow-x: hidden !important; max-width: 100% !important; }
    * { box-sizing: border-box; }
    #ai-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #B8924A;
      border: none;
      cursor: pointer;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 16px rgba(184,146,74,0.55);
      transition: transform 0.2s, box-shadow 0.2s;
      animation: fabGlow 2s ease-in-out infinite;
    }
    #ai-fab:hover { transform: scale(1.1); }
    #ai-fab svg { width: 26px; height: 26px; fill: #fff; }
    @keyframes fabGlow {
      0%,100% { box-shadow: 0 3px 14px rgba(184,146,74,0.5); }
      50% { box-shadow: 0 0 28px 10px rgba(184,146,74,0.85); }
    }

    #ai-chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 390px;
      max-height: 65vh;
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

    /* Mobile */
    @media (max-width: 600px) {
      #ai-chat-window {
        position: fixed;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 32vh !important;
        max-height: 32vh !important;
        border-radius: 12px 12px 0 0;
        border-left: none;
        border-right: none;
        border-bottom: none;
      }
      #ai-fab { bottom: 16px; right: 16px; width: 50px; height: 50px; }
      #ai-fab svg { width: 20px; height: 20px; }
      .ai-msg { font-size: 15px !important; line-height: 1.5 !important; }
      #ai-chat-input { font-size: 16px !important; }
      #ai-chat-name { font-size: 14px !important; }
      #ai-chat-sub { font-size: 11px !important; }
      #ai-chat-header { padding: 8px 12px !important; }
      #ai-chat-input-row { padding: 7px 10px !important; }
    }

    #ai-chat-header {
      background: #0A1828;
      padding: 10px 12px;
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
      color: #B8924A; font-size: 26px; padding: 0 6px; line-height: 1;
      font-weight: 700;
    }
    #ai-chat-close:hover { color: #fff; }

    #ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }
    #ai-chat-messages::-webkit-scrollbar { width: 3px; }
    #ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(184,146,74,0.3); border-radius: 2px; }

    .ai-msg {
      max-width: 88%;
      padding: 8px 11px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.45;
      word-break: break-word;
    }
    .ai-msg.bot {
      background: #162840;
      color: #D0E0F0;
      align-self: flex-start;
      border: 1px solid rgba(184,146,74,0.15);
    }
    .ai-msg.user {
      background: #B8924A;
      color: #fff;
      align-self: flex-end;
    }
    .ai-msg.typing { color: #8899AA; font-style: italic; }

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
      border-radius: 6px;
      color: #D0E0F0;
      font-size: 13px;
      padding: 7px 10px;
      outline: none;
      min-width: 0;
    }
    #ai-chat-input::placeholder { color: #556677; }
    #ai-chat-input:focus { border-color: rgba(184,146,74,0.55); }
    #ai-chat-send {
      background: #B8924A;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 15px;
      padding: 0 12px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #ai-chat-send:hover { background: #d4a84e; }
    #ai-chat-send:disabled { background: #4a3a1a; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // ── FAB BUTTON ──
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
    fab.style.display = 'none';
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(config.greeting, 'bot');
        messages.push({ role: 'assistant', content: config.greeting });
      }, 120);
    }
    setTimeout(() => input.focus(), 200);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('open');
    fab.style.display = 'flex';
  }

  fab.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  // Detect language from text
  function detectLang(text) {
    const ua = /[а-яёіїєґ]/i.test(text);
    const ru = /[ъыэё]/i.test(text);
    if (ua && !ru) return 'Ukrainian';
    if (ru) return 'Russian';
    return 'English';
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isSending) return;
    isSending = true;
    sendBtn.disabled = true;
    input.value = '';

    addMessage(text, 'user');
    messages.push({ role: 'user', content: text });

    const typingDiv = addMessage('…', 'bot typing');

    // Inject detected language into system prompt
    const lang = detectLang(text);
    const systemWithLang = `${config.systemPrompt}\n\nCRITICAL: The user is writing in ${lang}. You MUST reply ONLY in ${lang}. Do not use any other language.`;

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
        typingDiv.textContent = 'Service unavailable. Try again in a moment.';
        typingDiv.classList.remove('typing');
        isSending = false;
        sendBtn.disabled = false;
        return;
      }
      const data = await res.json();
      const reply = (data.response)
        || (data.content && data.content[0] && data.content[0].text)
        || (data.reply) || (data.text) || (data.message) || 'No response. Try again.';
      typingDiv.textContent = reply;
      typingDiv.classList.remove('typing');
      messages.push({ role: 'assistant', content: reply });
    } catch (e) {
      console.error('Chat fetch error:', e);
      typingDiv.textContent = 'Connection error. Check your internet and try again.';
      typingDiv.classList.remove('typing');
    }

    isSending = false;
    sendBtn.disabled = false;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  // Show FAB immediately with glow (already via CSS animation)

  // Auto-open after 5s on ALL devices
  setTimeout(() => openChat(), 5000);

})();
