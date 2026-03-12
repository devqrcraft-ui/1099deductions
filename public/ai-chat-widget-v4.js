(function () {
  const WORKER_URL = 'https://dry-flower-b3e7.dev-qrcraft.workers.dev/';

  const SITE_CONFIGS = {
    'privatepaycheck.com': {
      name: 'Paycheck AI',
      greeting: 'Hi! I\'m your Paycheck Assistant. I know this site inside out — calculator, all 50 states, tax rules. What would you like to know?',
      systemPrompt: `You are a professional paycheck assistant for PrivatePaycheck.com. You know every feature of this site.
Site navigation: Home (hero + calculator), Calculator (main tool), All States (state tax info for all 50 states), Blog (tax articles).
Key features: Free paycheck calculator, federal + state taxes, 2026 IRS rules, no data stored, no registration.
How the calculator works: user picks Pay Type (Annual Salary or Hourly), enters gross amount, picks Pay Frequency and State, fills Filing Status and allowances, clicks Calculate — sees federal tax, state tax, FICA, and net take-home pay.
Buttons: "CALCULATE MY PAY" = main CTA on homepage. "All States" = state-by-state tax page. "Blog" = tax articles.
Rules: Answer in 1-3 SHORT sentences. Then ask ONE guiding question. Be professional and direct. Match user language. No long paragraphs. Never guess tax amounts — direct to calculator.`
    },
    'gigwisetax.com': {
      name: 'GigWise AI',
      greeting: 'Hi! I\'m your GigWise Tax Assistant. Ask me anything about gig taxes, deductions, or quarterly payments!',
      systemPrompt: `You are a professional tax assistant for GigWiseTax.com — for gig workers (Uber, DoorDash, freelancers).
Site navigation: Home (hero + calculator tabs), Calculators (SE tax, quarterly), Tax Tools (mileage, deductions), By State (51 states), Resources (guides), About.
Key features: Self-employment tax calculator (15.3% SE tax + state income tax), quarterly payment schedule with Google Calendar export, all 51 jurisdictions, 2026 IRS rules.
How it works: user picks gig platform + state → sees SE tax, state tax, quarterly payment amounts, deadlines.
Buttons: "Find My Savings" = main CTA. "2026 Deadlines" tab = quarterly dates. "All Platforms" tab = platform list.
Q1 2026 deadline: April 15, 2026.
Rules: Answer in 1-3 SHORT sentences. Then ask ONE guiding question. Professional and direct. Match user language. No long paragraphs.`
    },
    'compressto20kb.com': {
      name: 'Compress AI',
      greeting: 'Hi! Need to compress an image? Drop it on the page and set your target size. What format are you working with?',
      systemPrompt: `You are a helpful assistant for CompressTo20KB.com — a free image compression tool.
Site navigation: Home (upload & compress tool), Blog.
Key features: Free image compression to any target size (20KB, 50KB, 100KB, etc.), supports JPG/PNG/WebP/AVIF, batch compression, no registration, no file size limit on upload.
How it works: user drags image onto page or clicks upload → sets target KB size → clicks Compress → downloads result.
Buttons: Upload area = drag & drop zone. Target size input = set desired output KB. "Compress" = start compression. "Download" = save result.
Rules: Answer in 1-3 SHORT sentences. Then ask ONE guiding question. Be direct and practical. Match user language. No long paragraphs.`
    },
    '1099deductions.com': {
      name: '1099 AI',
      greeting: 'Hi! I\'m your 1099 Deductions Assistant. I know this site inside out — deductions by job, calculator, deadlines. What\'s your gig job?',
      systemPrompt: `You are a strict, professional tax assistant for 1099Deductions.com. You help U.S. gig workers find every IRS tax write-off.
Site navigation:
- Home: hero section with savings estimator calculator on the right side
- By Job Type: deduction checklists for Uber, DoorDash, Etsy, Airbnb, OnlyFans, Instacart, Amazon Flex, Freelance, and more
- Calculator: tax savings estimator — user picks job, enters annual gig income, picks state → sees estimated tax savings
- Deadlines: 2026 quarterly tax payment dates (Q1: Apr 15, Q2: Jun 16, Q3: Sep 15, Q4: Jan 15 2027)
- Blog: tax articles and guides
- Find My Deductions button: takes user to the deduction finder tool

How the calculator works: Select gig job from dropdown → enter annual income → select state → click "Calculate My Tax Savings" → see estimated deductions and savings amount.

Key features: Free deduction checklists, IRS Schedule C compliant, all 50 states, 2026 tax rules, free PDF export, no registration ever.

Common deductions by job:
- All drivers (Uber/DoorDash/Lyft): mileage ($0.70/mile 2026), phone, insurance
- Etsy/freelance: home office, supplies, software, shipping
- Airbnb: utilities %, repairs, cleaning, supplies
- OnlyFans: equipment, internet, home studio, subscriptions

Self-employment tax: 15.3% on net profit. You deduct half on Form 1040.
Q1 2026 estimated tax deadline: April 15, 2026.

Rules: Answer in 1-3 SHORT sentences max. Ask ONE specific follow-up question. Be professional and strict — no fluff. Match user language (EN/ES/UK/etc). Never give generic advice — always tie to specific job or feature on the site. If user asks something unrelated to taxes/this site, politely redirect.`
    },
    'default': {
      name: 'Site AI',
      greeting: 'Hi! How can I help you today?',
      systemPrompt: `You are a helpful website assistant. Answer in 1-3 SHORT sentences. Then ask ONE guiding question. Be professional and direct. Match user language.`
    }
  };

  function getSiteConfig() {
    const host = window.location.hostname.replace('www.', '');
    return SITE_CONFIGS[host] || SITE_CONFIGS['default'];
  }

  function playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      [0, 0.15].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = i === 0 ? 880 : 1100;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.25, now + delay + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + delay + 0.25);
        osc.start(now + delay);
        osc.stop(now + delay + 0.3);
      });
    } catch (e) {}
  }

  const config = getSiteConfig();
  let messages = [];
  let isMinimized = true;
  let glowInterval = null;

  const style = document.createElement('style');
  style.textContent = `
    #ai-chat-widget * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

    /* FAB — smaller, less aggressive glow */
    #ai-chat-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f5a623, #e8890a);
      border: none;
      cursor: pointer;
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 12px rgba(245,166,35,0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #ai-chat-fab:hover { transform: scale(1.08); }
    #ai-chat-fab svg { width: 22px; height: 22px; fill: white; }

    #ai-chat-fab.glow-pulse {
      animation: fabGlow 1.8s ease-in-out infinite;
    }
    @keyframes fabGlow {
      0%   { box-shadow: 0 3px 12px rgba(245,166,35,0.4); }
      50%  { box-shadow: 0 0 20px 6px rgba(245,166,35,0.6), 0 0 40px 12px rgba(245,166,35,0.25); }
      100% { box-shadow: 0 3px 12px rgba(245,166,35,0.4); }
    }

    #ai-chat-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: #ff3b30;
      border-radius: 50%;
      border: 2px solid white;
      display: none;
    }
    #ai-chat-badge.show { display: block; }

    /* Chat window — compact, mobile-first */
    #ai-chat-window {
      position: fixed;
      bottom: 78px;
      right: 16px;
      width: 320px;
      max-width: calc(100vw - 24px);
      background: #1a2035;
      border-radius: 14px;
      box-shadow: 0 6px 30px rgba(0,0,0,0.45);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: opacity 0.2s ease, transform 0.2s ease;
      /* thin border */
      border: 1px solid rgba(255,255,255,0.08);
    }
    #ai-chat-window.hidden {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
      pointer-events: none;
    }

    /* Header — compact */
    #ai-chat-header {
      background: linear-gradient(135deg, #1e2d50, #243660);
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    #ai-chat-header-dot {
      width: 8px; height: 8px;
      background: #4cd964;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 0 5px #4cd964;
    }
    #ai-chat-header-title { flex: 1; }
    #ai-chat-header-title .name {
      color: #f5a623;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.2;
    }
    #ai-chat-header-title .sub {
      color: rgba(255,255,255,0.5);
      font-size: 11px;
      line-height: 1.2;
      margin-top: 1px;
    }
    #ai-chat-minimize-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      border-radius: 6px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      padding: 0 0 2px 0;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    #ai-chat-minimize-btn:hover { background: rgba(255,255,255,0.2); }

    /* Messages — more space inside, thin walls */
    #ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px 10px 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 220px;
      min-height: 80px;
    }
    #ai-chat-messages::-webkit-scrollbar { width: 3px; }
    #ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }

    .ai-msg {
      max-width: 90%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      color: white;
      word-break: break-word;
    }
    .ai-msg.bot {
      background: rgba(255,255,255,0.09);
      align-self: flex-start;
      border-bottom-left-radius: 3px;
    }
    .ai-msg.user {
      background: linear-gradient(135deg, #f5a623, #e8890a);
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }
    .ai-msg.typing {
      background: rgba(255,255,255,0.06);
      align-self: flex-start;
      font-size: 18px;
      letter-spacing: 3px;
      padding: 6px 14px;
    }

    /* Input area — compact */
    #ai-chat-input-area {
      padding: 8px 10px 10px;
      display: flex;
      gap: 7px;
      border-top: 1px solid rgba(255,255,255,0.07);
      background: rgba(0,0,0,0.18);
    }
    #ai-chat-input {
      flex: 1;
      background: rgba(255,255,255,0.09);
      border: 1px solid rgba(255,255,255,0.13);
      border-radius: 10px;
      padding: 8px 12px;
      color: white;
      font-size: 14px;
      outline: none;
      resize: none;
      line-height: 1.4;
    }
    #ai-chat-input::placeholder { color: rgba(255,255,255,0.35); }
    #ai-chat-input:focus { border-color: rgba(245,166,35,0.5); background: rgba(255,255,255,0.12); }

    #ai-chat-send {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #f5a623, #e8890a);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      align-self: flex-end;
      transition: opacity 0.15s, transform 0.15s;
    }
    #ai-chat-send:hover { opacity: 0.85; transform: scale(1.05); }
    #ai-chat-send:disabled { opacity: 0.4; cursor: default; }
    #ai-chat-send svg { width: 17px; height: 17px; fill: white; }

    /* Mobile: chat stays small, doesn't cover screen */
    @media (max-width: 480px) {
      #ai-chat-window {
        bottom: 74px;
        right: 10px;
        left: 10px;
        width: auto;
        max-height: 55vh;
      }
      #ai-chat-messages {
        max-height: 160px;
      }
      .ai-msg { font-size: 13px; }
      #ai-chat-input { font-size: 14px; }
    }
  `;
  document.head.appendChild(style);

  // Fix horizontal scroll on mobile — add to body/html
  const noScrollStyle = document.createElement('style');
  noScrollStyle.textContent = `html, body { max-width: 100%; overflow-x: hidden; }`;
  document.head.appendChild(noScrollStyle);

  // FAB
  const fab = document.createElement('button');
  fab.id = 'ai-chat-fab';
  fab.setAttribute('aria-label', 'Open chat');
  fab.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    <span id="ai-chat-badge"></span>
  `;
  document.body.appendChild(fab);

  // Chat window
  const win = document.createElement('div');
  win.id = 'ai-chat-window';
  win.className = 'hidden';
  win.innerHTML = `
    <div id="ai-chat-header">
      <div id="ai-chat-header-dot"></div>
      <div id="ai-chat-header-title">
        <div class="name">${config.name}</div>
        <div class="sub">Online · Fast replies</div>
      </div>
      <button id="ai-chat-minimize-btn" title="Minimize">−</button>
    </div>
    <div id="ai-chat-messages"></div>
    <div id="ai-chat-input-area">
      <input id="ai-chat-input" placeholder="Ask a question..." maxlength="300" autocomplete="off" />
      <button id="ai-chat-send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(win);

  const msgContainer = document.getElementById('ai-chat-messages');
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');
  const badge = document.getElementById('ai-chat-badge');

  function startGlow() {
    fab.classList.add('glow-pulse');
    badge.classList.add('show');
  }
  function stopGlow() {
    fab.classList.remove('glow-pulse');
    badge.classList.remove('show');
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;
    div.textContent = text;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ai-msg typing';
    div.id = 'ai-typing-indicator';
    div.textContent = '···';
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('ai-typing-indicator');
    if (t) t.remove();
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    messages.push({ role: 'user', content: text });
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: config.systemPrompt, messages })
      });
      const data = await res.json();
      removeTyping();
      const reply = data.response || 'Sorry, please try again.';
      addMessage(reply, 'bot');
      messages.push({ role: 'assistant', content: reply });
    } catch (e) {
      removeTyping();
      addMessage('Connection error. Please try again.', 'bot');
    }
    sendBtn.disabled = false;
  }

  function openChat() {
    win.classList.remove('hidden');
    isMinimized = false;
    stopGlow();
    // Don't auto-focus on mobile (prevents keyboard popup)
    if (window.innerWidth > 480) input.focus();
  }

  function minimizeChat() {
    win.classList.add('hidden');
    isMinimized = true;
    startGlow();
  }

  fab.addEventListener('click', () => {
    if (isMinimized) openChat();
  });

  document.getElementById('ai-chat-minimize-btn').addEventListener('click', minimizeChat);

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // Auto-open after 6s — but only on desktop
  setTimeout(() => {
    playNotificationSound();
    startGlow();
    // Auto-open only on desktop (>768px)
    if (window.innerWidth > 768) {
      setTimeout(() => {
        openChat();
        addMessage(config.greeting, 'bot');
        messages.push({ role: 'assistant', content: config.greeting });
      }, 600);
    }
    // On mobile: just glow, user taps to open
  }, 6000);

  // When user opens manually and no messages yet — show greeting
  fab.addEventListener('click', () => {
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(config.greeting, 'bot');
        messages.push({ role: 'assistant', content: config.greeting });
      }, 150);
    }
  });

})();
