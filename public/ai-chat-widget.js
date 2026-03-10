(function () {
  const WORKER_URL = 'https://dry-flower-b3e7.dev-qrcraft.workers.dev/';

  const SITE_CONFIGS = {
    'privatepaycheck.com': {
      name: 'Paycheck AI',
      greeting: 'Hi! I\'m your Paycheck Assistant. I know this site inside out — calculator, all 50 states, tax rules. What would you like to know?',
      systemPrompt: `You are a friendly, professional paycheck assistant for PrivatePaycheck.com. 
Site navigation: Home (hero + calculator), Calculator (main tool), All States (state tax info for all 50 states), Blog (tax articles).
Key features: Free paycheck calculator, federal + state taxes, 2026 IRS rules, no data stored, no registration.
Rules: Answer in 1-2 SHORT sentences max. Then ask ONE guiding question to help the user. Be warm but efficient. Match user's language (English/Spanish/etc). Never give long paragraphs.`
    },
    'gigwisetax.com': {
      name: 'GigWise AI',
      greeting: 'Hi! I\'m your GigWise Tax Assistant. Ask me anything about gig taxes, deductions, or quarterly payments!',
      systemPrompt: `You are a friendly tax assistant for GigWiseTax.com — a site for gig workers (Uber, DoorDash, freelancers).
Site navigation: Home, Tax Calculator, Deductions, Quarterly Taxes, Blog.
Key features: Gig economy tax calculator, self-employment deductions, quarterly estimated tax guide.
Rules: Answer in 1-2 SHORT sentences max. Then ask ONE guiding question. Be warm but efficient. Match user's language. Never give long paragraphs.`
    },
    'compressto20kb.com': {
      name: 'Compress AI',
      greeting: 'Hi! I\'m your image compression assistant. I can help you compress images fast. What are you trying to compress today?',
      systemPrompt: `You are a helpful assistant for CompressTo20KB.com — a free image compression tool.
Site navigation: Home (upload & compress), Blog.
Key features: Free image compression, compress to any size (20KB, 50KB, etc.), supports JPG/PNG/WebP, no registration.
Rules: Answer in 1-2 SHORT sentences max. Then ask ONE guiding question. Be warm but efficient. Match user's language. Never give long paragraphs.`
    },
    'default': {
      name: 'Site AI',
      greeting: 'Hi! I\'m your assistant. How can I help you today?',
      systemPrompt: `You are a helpful website assistant. Answer in 1-2 SHORT sentences max. Then ask ONE guiding question. Be warm but efficient. Match user's language.`
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
      // Two-tone notification (like a message ping)
      [0, 0.15].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = i === 0 ? 880 : 1100;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.3, now + delay + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + delay + 0.3);
        osc.start(now + delay);
        osc.stop(now + delay + 0.35);
      });
    } catch (e) {}
  }

  const config = getSiteConfig();
  let messages = [];
  let isMinimized = true;
  let glowInterval = null;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #ai-chat-widget * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    
    #ai-chat-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f5a623, #e8890a);
      border: none;
      cursor: pointer;
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(245,166,35,0.5);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #ai-chat-fab:hover { transform: scale(1.1); }
    #ai-chat-fab svg { width: 28px; height: 28px; fill: white; }

    #ai-chat-fab.glow-pulse {
      animation: fabGlow 1.2s ease-in-out infinite;
    }
    @keyframes fabGlow {
      0%   { box-shadow: 0 4px 20px rgba(245,166,35,0.5); transform: scale(1); }
      50%  { box-shadow: 0 0 30px 10px rgba(245,166,35,0.85), 0 0 60px 20px rgba(245,166,35,0.4); transform: scale(1.08); }
      100% { box-shadow: 0 4px 20px rgba(245,166,35,0.5); transform: scale(1); }
    }

    #ai-chat-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: #ff3b30;
      border-radius: 50%;
      border: 2px solid white;
      display: none;
    }
    #ai-chat-badge.show { display: block; }

    #ai-chat-window {
      position: fixed;
      bottom: 94px;
      right: 16px;
      width: 360px;
      max-width: calc(100vw - 32px);
      background: #1a2035;
      border-radius: 18px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #ai-chat-window.hidden {
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      pointer-events: none;
    }

    #ai-chat-header {
      background: linear-gradient(135deg, #1e2d50, #243660);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    #ai-chat-header-dot {
      width: 10px; height: 10px;
      background: #4cd964;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 0 6px #4cd964;
    }
    #ai-chat-header-title {
      flex: 1;
    }
    #ai-chat-header-title .name {
      color: #f5a623;
      font-size: 17px;
      font-weight: 700;
      line-height: 1.2;
    }
    #ai-chat-header-title .sub {
      color: rgba(255,255,255,0.55);
      font-size: 13px;
      line-height: 1.2;
      margin-top: 2px;
    }
    #ai-chat-minimize-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      font-size: 22px;
      cursor: pointer;
      border-radius: 8px;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      padding: 0 0 3px 0;
      transition: background 0.15s;
    }
    #ai-chat-minimize-btn:hover { background: rgba(255,255,255,0.2); }

    #ai-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 300px;
      min-height: 120px;
    }
    #ai-chat-messages::-webkit-scrollbar { width: 4px; }
    #ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

    .ai-msg {
      max-width: 88%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 15px;
      line-height: 1.55;
      color: white;
      word-break: break-word;
    }
    .ai-msg.bot {
      background: rgba(255,255,255,0.1);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .ai-msg.user {
      background: linear-gradient(135deg, #f5a623, #e8890a);
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .ai-msg.typing {
      background: rgba(255,255,255,0.07);
      align-self: flex-start;
      font-size: 20px;
      letter-spacing: 4px;
      padding: 8px 16px;
    }

    #ai-chat-input-area {
      padding: 10px 12px 12px;
      display: flex;
      gap: 8px;
      border-top: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.2);
    }
    #ai-chat-input {
      flex: 1;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 10px 14px;
      color: white;
      font-size: 15px;
      outline: none;
      resize: none;
      line-height: 1.4;
    }
    #ai-chat-input::placeholder { color: rgba(255,255,255,0.4); }
    #ai-chat-input:focus { border-color: rgba(245,166,35,0.6); background: rgba(255,255,255,0.13); }

    #ai-chat-send {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #f5a623, #e8890a);
      border: none;
      border-radius: 12px;
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
    #ai-chat-send svg { width: 20px; height: 20px; fill: white; }

    @media (max-width: 480px) {
      #ai-chat-window { bottom: 84px; right: 12px; left: 12px; width: auto; }
      .ai-msg { font-size: 15px; }
      #ai-chat-input { font-size: 15px; }
    }
  `;
  document.head.appendChild(style);

  // FAB button
  const fab = document.createElement('button');
  fab.id = 'ai-chat-fab';
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
      <input id="ai-chat-input" placeholder="Ask a question..." maxlength="300" />
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
    input.focus();
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

  // Auto-open after 5 seconds with sound and greeting
  setTimeout(() => {
    playNotificationSound();
    startGlow();
    setTimeout(() => {
      openChat();
      addMessage(config.greeting, 'bot');
      messages.push({ role: 'assistant', content: config.greeting });
    }, 600);
  }, 5000);

})();
