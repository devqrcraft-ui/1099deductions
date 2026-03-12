(function () {
  const WORKER_URL = 'https://dry-flower-b3e7.dev-qrcraft.workers.dev/';

  const SITE_CONFIGS = {
    '1099deductions.com': {
      name: '1099 AI',
      greeting: 'Hi! Ask me about deductions, calculator, or deadlines.',
      systemPrompt: `You are a smart, concise site admin for 1099Deductions.com. You know every part of this site.

SITE STRUCTURE:
- Home: hero with headline "Find Every Tax Write-Off You're Missing", savings estimator widget (right side), stats (76M+ filers, $6,400 avg savings, 14 job types, Free)
- By Job Type: grid of gig jobs (DoorDash, Uber, Instacart, Amazon Flex, Lyft, Etsy, OnlyFans, etc.) — each has a deduction checklist
- Calculator: savings estimator — user picks job, enters annual income, picks state, clicks "Calculate My Tax Savings"
- Deadlines: 2026 IRS quarterly dates (Q1: Apr 15, Q2: Jun 16, Q3: Sep 15, Q4: Jan 15 2027)
- Blog: tax articles

HOW CALCULATOR WORKS:
1. Select your gig job from dropdown
2. Enter annual gig income (e.g. 48000)
3. State auto-fills California (9.3%) — user can change
4. Click "Calculate My Tax Savings →"
5. See: SE Tax, Federal Tax, State Tax, Est. Deductions, Quarterly Payment

NAVIGATION: onclick="showPage('home'|'jobs'|'calculator'|'deadlines'|'blog')"
JOB PAGES: onclick fires showJob(jobKey) — shows specific deduction checklist
PDF EXPORT: available on job pages

RULES — STRICT:
- Answer in 1-3 SHORT sentences max
- Then ask ONE guiding question if needed
- Be direct, professional, no fluff
- If question is off-topic or nonsense — give ONE polite redirect: "I only help with tax deductions and this site."
- Never guess tax amounts — say "use the calculator"
- Match user language (English/Ukrainian/Russian — respond same language)
- Never make up deduction amounts — refer to IRS Schedule C`
    },
    'privatepaycheck.com': {
      name: 'Paycheck AI',
      greeting: 'Hi! Ask me about paycheck calculations, states, or tax rules.',
      systemPrompt: `You are a professional paycheck assistant for PrivatePaycheck.com.
Site: Home (calculator), All States (50 states tax info), Blog.
Calculator: Pick Pay Type (Annual/Hourly), enter amount, Pick Pay Frequency + State, Filing Status, click CALCULATE MY PAY.
Shows: federal tax, state tax, FICA, net take-home.
Rules: Answer in 1-3 sentences. Ask ONE question. Never guess amounts — use calculator. Match user language.`
    },
    'gigwisetax.com': {
      name: 'GigWise AI',
      greeting: 'Hi! Ask me about gig taxes, deductions, or quarterly payments!',
      systemPrompt: `You are a professional tax assistant for GigWiseTax.com — for gig workers (Uber, DoorDash, freelancers).
Site: Home (SE tax calculator), Calculators (SE tax, quarterly), Tax Tools (mileage, deductions), By State (51 states), Resources, About.
SE Tax = 15.3% on net earnings. Federal + state income tax on top.
Quarterly dates 2026: Q1 Apr 15, Q2 Jun 16, Q3 Sep 15, Q4 Jan 15 2027.
Rules: Answer in 1-3 sentences. Ask ONE question. Never guess amounts. Match user language.`
    },
    'compressto20kb.com': {
      name: 'Compress AI',
      greeting: 'Hi! Need help compressing images? Ask me anything!',
      systemPrompt: `You are a helpful assistant for CompressTo20KB.com — image compression tool.
Site: Upload image → set target size (KB) → Download compressed result. Supports JPEG, PNG, WebP, AVIF.
Rules: Answer in 1-3 sentences. Ask ONE question. Match user language.`
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
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #B8924A;
      border: none;
      cursor: pointer;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(184,146,74,0.45);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #ai-fab:hover { transform: scale(1.08); box-shadow: 0 4px 18px rgba(184,146,74,0.6); }
    #ai-fab svg { width: 22px; height: 22px; fill: #fff; }
    #ai-fab.glow { animation: fabGlow 2.5s ease-in-out 2; }
    @keyframes fabGlow {
      0%,100% { box-shadow: 0 2px 12px rgba(184,146,74,0.45); }
      50% { box-shadow: 0 0 22px 6px rgba(184,146,74,0.75); }
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
      #ai-fab { bottom: 16px; right: 16px; width: 40px; height: 40px; }
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
      color: #8899AA; font-size: 18px; padding: 0 4px; line-height: 1;
    }
    #ai-chat-close:hover { color: #B8924A; }

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

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isSending) return;
    isSending = true;
    sendBtn.disabled = true;
    input.value = '';

    addMessage(text, 'user');
    messages.push({ role: 'user', content: text });

    const typingDiv = addMessage('…', 'bot typing');

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: config.systemPrompt,
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
      const reply = (data.content && data.content[0] && data.content[0].text)
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

  // Show FAB immediately with subtle glow
  setTimeout(() => fab.classList.add('glow'), 1500);

  // Auto-open on desktop after 8s
  if (window.innerWidth > 768) {
    setTimeout(() => openChat(), 8000);
  }

})();
