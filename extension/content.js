/**
 * AIRA Chrome Extension - Content Script for Gmail & Google Chat
 * Dynamic routing based on Gmail view:
 * - Inbox list view (#inbox): Renders Marketing Campaign Chatbox Pop View with 2-Step Clarify Owner Flow
 * - Email thread view (#inbox/THREAD_ID): Renders Gmail Email Nudge View
 */

(function () {
  console.log('[AIRA Extension] Content script loaded for Gmail & Google Chat');

  let activeOverrideScenario = null;
  let isGmailNudgeDismissed = false;
  let isChatNudgeDismissed = false;
  let chatNudgeState = 'initial'; // 'initial' -> 'ask_name' -> 'confirmed'
  let selectedOwner = 'Dinesh'; // 'Dinesh' | 'Sathvika'
  let isWidgetMinimized = false;

  window.escapeHtml = function(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  const escapeHtml = window.escapeHtml;

  function getFormattedSnoozeTime() {
    const date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  // Listen for scenario overrides from Extension Popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'SET_SCENARIO') {
        activeOverrideScenario = request.scenarioId;
        isGmailNudgeDismissed = false;
        isChatNudgeDismissed = false;
        chatNudgeState = 'initial';
        console.log('[AIRA Extension] Scenario set to:', activeOverrideScenario);
        checkAndInjectAll();
        sendResponse({ success: true, activeScenario: activeOverrideScenario });
      } else if (request.type === 'RESET_AIRA') {
        isGmailNudgeDismissed = false;
        isChatNudgeDismissed = false;
        chatNudgeState = 'initial';
        activeOverrideScenario = null;
        console.log('[AIRA Extension] Reset AIRA state');
        checkAndInjectAll();
        sendResponse({ success: true });
      }
    });
  }

  // Observe DOM changes and URL Hash changes
  const observer = new MutationObserver(debounce(() => {
    checkAndInjectAll();
  }, 400));

  window.addEventListener('hashchange', () => {
    checkAndInjectAll();
  });

  function startObserver() {
    observer.observe(document.body, { childList: true, subtree: true });
    checkAndInjectAll();
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function checkAndInjectAll() {
    if (isGoogleChatView()) {
      removeFloatingChatWidget();
      removeExistingGmailAiraNudge();
      checkAndInjectGoogleChatAira();
    } else if (isEmailThreadOpen()) {
      // 1. Thread Viewer View (#inbox/THREAD_ID): Show ONLY Gmail Email Nudge
      removeFloatingChatWidget();
      checkAndInjectGmailAira();
    } else {
      // 2. Main Inbox View (#inbox): Show Marketing Campaign Chatbox Pop View
      removeExistingGmailAiraNudge();
      ensureGmailChatPopupWidget();
    }
  }

  function removeFloatingChatWidget() {
    const widget = document.getElementById('aira-gmail-floating-chat-widget');
    if (widget) widget.remove();
  }

  function isGoogleChatView() {
    if (window.location.hostname === 'chat.google.com') return true;
    const hash = window.location.hash || '';
    if (hash.includes('#chat/') || hash.includes('#dm/') || hash.includes('#space/')) {
      return true;
    }
    return false;
  }

  // STRICT DETECTION: Only returns true when an actual email thread (message viewer) is active
  function isEmailThreadOpen() {
    const hash = window.location.hash || '';

    if (!hash || hash === '#inbox' || hash === '#all' || hash === '#starred' || hash === '#snoozed' || hash === '#sent' || hash === '#drafts' || hash.startsWith('#inbox?')) {
      return false;
    }

    if (/#(inbox|all|starred|snoozed|sent|drafts|search|label\/[^/]+)\/[A-Za-z0-9_-]{8,}/.test(hash)) {
      return true;
    }

    const messageBody = document.querySelector('.ii.gt');
    const subjectEl = document.querySelector('h2.hP');
    if (messageBody && subjectEl && subjectEl.innerText.trim().toLowerCase() !== 'inbox') {
      return true;
    }

    return false;
  }

  // --------------------------------------------------------------------------
  // INBOX VIEW: MARKETING CAMPAIGN CHATBOX POPUP WIDGET (VERSION 3.0)
  // --------------------------------------------------------------------------

  function ensureGmailChatPopupWidget() {
    let widget = document.getElementById('aira-gmail-floating-chat-widget');
    
    // Force re-render if version != '3.0'
    if (widget && widget.dataset.version === '3.0' && widget.dataset.minimized === String(isWidgetMinimized)) {
      return;
    }

    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'aira-gmail-floating-chat-widget';
      document.body.appendChild(widget);
    }

    widget.dataset.version = '3.0';
    widget.dataset.minimized = String(isWidgetMinimized);

    if (isWidgetMinimized) {
      widget.style.cssText = `
        position: fixed;
        bottom: 12px;
        right: 80px;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 9999px;
        padding: 8px 18px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        z-index: 999990;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      widget.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #D97706;"></span>
        <span style="font-weight: 700; font-size: 12.5px; color: #1E293B;">Marketing Campaign</span>
        <span style="font-size: 11px; color: #64748B;">(12 members)</span>
      `;
      widget.onclick = () => {
        isWidgetMinimized = false;
        widget.remove();
        ensureGmailChatPopupWidget();
      };
      return;
    }

    widget.onclick = null;
    widget.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 80px;
      width: 360px;
      height: 380px;
      background: #FFFFFF;
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
      z-index: 999990;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid #E2E8F0;
      overflow: hidden;
    `;

    widget.innerHTML = `
      <!-- Widget Header -->
      <div style="padding: 10px 14px; background: #FFFFFF; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color:#64748B; font-size: 14px; cursor: pointer;">←</span>
          <div>
            <div style="font-weight: 700; font-size: 13px; color: #0F172A; display: flex; align-items: center; gap: 4px;">
              <span>Marketing Campaign</span>
              <span style="font-size: 10px; color: #64748B;">▾</span>
            </div>
            <div style="font-size: 10.5px; color: #64748B;">12 members</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; color: #64748B;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <button type="button" id="aira-chat-minimize-btn" style="background:none; border:none; color:#64748B; cursor:pointer; font-size: 14px; font-weight: 700; padding: 0 4px;" title="Minimize">—</button>
        </div>
      </div>

      <!-- Messages Container with Inner Scrollbar -->
      <div style="flex: 1; padding: 10px 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; scrollbar-width: thin;">
        <div style="display: flex; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #991B1B; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink:0;">DP</div>
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #334155;">Dinesh Patel <span style="font-weight: 400; color: #94A3B8; font-size: 10px; margin-left: 4px;">9:03 AM</span></div>
            <div style="font-size: 11.5px; color: #334155; margin-top: 2px;">I thought you were doing it?</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #991B1B; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink:0;">DP</div>
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #334155;">Dinesh Patel <span style="font-weight: 400; color: #94A3B8; font-size: 10px; margin-left: 4px;">9:03 AM</span></div>
            <div style="font-size: 11.5px; color: #334155; margin-top: 2px;">Oh okay, no worries.</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #EAB308; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink:0;">SR</div>
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #334155;">Sathvika Rao <span style="font-weight: 400; color: #94A3B8; font-size: 10px; margin-left: 4px;">9:04 AM</span></div>
            <div style="font-size: 11.5px; color: #2563EB; margin-top: 2px;">I can do it as well.</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #2563EB; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink:0;">NK</div>
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #334155;">Navatej Kumar <span style="font-weight: 400; color: #94A3B8; font-size: 10px; margin-left: 4px;">9:05 AM</span></div>
            <div style="font-size: 11.5px; color: #334155; margin-top: 2px;">Either of you is fine.</div>
          </div>
        </div>

        <!-- AIRA Person Selection Nudge Card -->
        <div id="aira-chat-widget-nudge-slot" style="margin-top: 4px;"></div>
      </div>

      <!-- Bottom Toolbar Input -->
      <div style="padding: 8px 10px 10px 10px; background: #FFFFFF; border-top: 1px solid #F1F5F9;">
        <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 9999px; padding: 6px 14px;">
          <span style="color: #2563EB; font-weight: 700; font-size: 15px;">+</span>
          <input type="text" id="aira-chat-widget-input" placeholder="History is on" style="border: none; background: transparent; flex: 1; font-size: 11.5px; outline: none; color: #334155;">
          <span style="color: #64748B; font-size: 11px; cursor: pointer;">Tt</span>
          <span style="color: #64748B; font-size: 11px; cursor: pointer;">😊</span>
          <span style="color: #64748B; font-size: 11px; cursor: pointer;">✏️</span>
          <span style="color: #64748B; font-size: 11px; cursor: pointer;">⬆</span>
          <span style="color: #2563EB; font-size: 12px; cursor: pointer; font-weight: 700;">➤</span>
        </div>
      </div>
    `;

    setTimeout(() => {
      const minBtn = widget.querySelector('#aira-chat-minimize-btn');
      if (minBtn) {
        minBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          isWidgetMinimized = true;
          widget.remove();
          ensureGmailChatPopupWidget();
        });
      }

      renderChatWidgetNudgeContent();
    }, 50);
  }

  function renderChatWidgetNudgeContent() {
    const slot = document.getElementById('aira-chat-widget-nudge-slot');
    if (!slot) return;

    if (isChatNudgeDismissed) {
      slot.innerHTML = '';
      return;
    }

    if (chatNudgeState === 'initial') {
      // STEP 1: Initial AIRA Owner Unclear Nudge with "Clarify owner" Button
      slot.innerHTML = `
        <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 8px 12px; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="color: #D97706; font-weight: 700; font-size: 11.5px;">✨ AIRA</span>
              <span style="color: #92400E; font-size: 11.5px; font-weight: 700;">· Owner unclear</span>
            </div>
            <button type="button" id="aira-widget-close-btn" style="background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 0 2px; font-size: 11px;" title="Close">✕</button>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div style="font-size: 10.5px; color: #78350F; font-weight: 400; line-height: 1.25;">
              It's not clear who will take the landing page.
            </div>
            <button type="button" id="aira-widget-clarify-btn" style="background: #FFFFFF; border: 1px solid #D97706; color: #D97706; font-weight: 600; font-size: 10.5px; padding: 3px 10px; border-radius: 9999px; cursor: pointer; white-space: nowrap;">
              Clarify owner
            </button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const closeBtn = slot.querySelector('#aira-widget-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            isChatNudgeDismissed = true;
            renderChatWidgetNudgeContent();
          });
        }

        const clarifyBtn = slot.querySelector('#aira-widget-clarify-btn');
        if (clarifyBtn) {
          clarifyBtn.addEventListener('click', () => {
            chatNudgeState = 'ask_name';
            renderChatWidgetNudgeContent();
          });
        }
      }, 50);

    } else if (chatNudgeState === 'ask_name') {
      // STEP 2: Ask Owner Selection with Person Pills & Confirm Button
      const isDinesh = selectedOwner === 'Dinesh';
      const isSathvika = selectedOwner === 'Sathvika';

      slot.innerHTML = `
        <div style="background-color: #FFFDF5; border: 1.5px solid #FDE68A; border-radius: 16px; padding: 12px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <!-- Title Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="color: #D97706; font-size: 13px; font-weight: 700;">★ AIRA</span>
              <span style="color: #4B5563; font-size: 11.5px; font-weight: 500;">- Who should own the landing page?</span>
            </div>
          </div>

          <!-- Person Selection Pills -->
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <!-- Dinesh Pill -->
            <button type="button" id="aira-select-dinesh" style="
              background: ${isDinesh ? '#DB7040' : '#FFFFFF'};
              color: ${isDinesh ? '#FFFFFF' : '#B45309'};
              border: 1.5px solid ${isDinesh ? '#DB7040' : '#F59E0B'};
              border-radius: 9999px;
              padding: 4px 14px;
              font-size: 11.5px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: all 0.15s ease;
            ">
              <span style="width: 18px; height: 18px; border-radius: 50%; background: ${isDinesh ? '#991B1B' : '#D97706'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 8.5px; font-weight: 700;">DP</span>
              <span>Dinesh</span>
            </button>

            <!-- Sathvika Pill -->
            <button type="button" id="aira-select-sathvika" style="
              background: ${isSathvika ? '#DB7040' : '#FFFFFF'};
              color: ${isSathvika ? '#FFFFFF' : '#B45309'};
              border: 1.5px solid ${isSathvika ? '#DB7040' : '#F59E0B'};
              border-radius: 9999px;
              padding: 4px 14px;
              font-size: 11.5px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: all 0.15s ease;
            ">
              <span style="width: 18px; height: 18px; border-radius: 50%; background: ${isSathvika ? '#991B1B' : '#EAB308'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 8.5px; font-weight: 700;">SR</span>
              <span>Sathvika</span>
            </button>
          </div>

          <!-- Confirm Button -->
          <div>
            <button type="button" id="aira-confirm-owner-btn" style="
              background: #DB7040;
              color: #FFFFFF;
              border: none;
              border-radius: 9999px;
              padding: 6px 20px;
              font-size: 11.5px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(219, 112, 64, 0.3);
              transition: background 0.15s ease;
            ">
              Confirm
            </button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const dineshBtn = slot.querySelector('#aira-select-dinesh');
        if (dineshBtn) {
          dineshBtn.addEventListener('click', () => {
            selectedOwner = 'Dinesh';
            renderChatWidgetNudgeContent();
          });
        }

        const sathvikaBtn = slot.querySelector('#aira-select-sathvika');
        if (sathvikaBtn) {
          sathvikaBtn.addEventListener('click', () => {
            selectedOwner = 'Sathvika';
            renderChatWidgetNudgeContent();
          });
        }

        const confirmBtn = slot.querySelector('#aira-confirm-owner-btn');
        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
            chatNudgeState = 'confirmed';
            const chatInput = document.getElementById('aira-chat-widget-input');
            if (chatInput) {
              chatInput.value = `${selectedOwner} is taking ownership of the landing page.`;
              chatInput.focus();
            }
            renderChatWidgetNudgeContent();
          });
        }
      }, 50);

    } else if (chatNudgeState === 'confirmed') {
      // STEP 3: Confirmed State
      slot.innerHTML = `
        <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 10px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #059669; font-weight: 700; font-size: 12px;">✓ Owner Confirmed:</span>
            <span style="color: #047857; font-size: 12px; font-weight: 600;">${escapeHtml(selectedOwner)}</span>
          </div>
          <button type="button" id="aira-widget-dismiss-link" style="background: none; border: none; color: #059669; font-size: 11px; cursor: pointer; font-weight: 600;">
            Dismiss
          </button>
        </div>
      `;

      setTimeout(() => {
        const dismissLink = slot.querySelector('#aira-widget-dismiss-link');
        if (dismissLink) {
          dismissLink.addEventListener('click', () => {
            isChatNudgeDismissed = true;
            renderChatWidgetNudgeContent();
          });
        }
      }, 50);
    }
  }


  // --------------------------------------------------------------------------
  // STANDALONE GOOGLE CHAT LOGIC (chat.google.com)
  // --------------------------------------------------------------------------

  function findGoogleChatComposerTarget() {
    const mainArea = document.querySelector('div[role="main"]') || 
                     document.querySelector('c-wiz[role="main"]') || 
                     document.body;

    const candidates = Array.from(mainArea.querySelectorAll('div[role="textbox"], div[contenteditable="true"], textarea'));

    const chatInput = candidates.find(el => {
      const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
      const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
      const id = (el.id || '').toLowerCase();
      
      if (ariaLabel.includes('search') || placeholder.includes('search') || id.includes('search')) {
        return false;
      }
      if (el.closest('nav') || el.closest('[role="navigation"]')) {
        return false;
      }
      return true;
    });

    if (!chatInput) return null;

    let container = chatInput;
    let topComposerWrapper = chatInput;

    while (container && container !== mainArea && container !== document.body) {
      const parent = container.parentElement;
      if (!parent || parent === mainArea || parent === document.body) break;

      if (parent.querySelector('button[aria-label*="Send"]') || 
          parent.querySelector('div[aria-label*="History is on"]') ||
          (parent.innerText && parent.innerText.includes('History is on'))) {
        topComposerWrapper = parent;
      }

      container = parent;
    }

    return topComposerWrapper;
  }

  function checkAndInjectGoogleChatAira() {
    if (isChatNudgeDismissed) return;

    const composerTarget = findGoogleChatComposerTarget();
    if (!composerTarget) {
      removeGoogleChatNudge();
      return;
    }

    const existingCard = document.getElementById('aira-chat-nudge-card');
    if (existingCard && document.body.contains(existingCard)) {
      if (existingCard.dataset.state === chatNudgeState) {
        return;
      }
    }

    removeGoogleChatNudge();

    const nudgeCard = renderGoogleChatNudgeCard();
    if (composerTarget.parentNode) {
      composerTarget.parentNode.insertBefore(nudgeCard, composerTarget);
      console.log('[AIRA Extension] Injected AIRA Nudge Card Stage:', chatNudgeState);
    }
  }

  function removeGoogleChatNudge() {
    const existing = document.getElementById('aira-chat-nudge-card');
    if (existing) existing.remove();
  }

  function renderGoogleChatNudgeCard() {
    const card = document.createElement('div');
    card.id = 'aira-chat-nudge-card';
    card.className = 'aira-chat-nudge-card';
    card.dataset.state = chatNudgeState;

    if (chatNudgeState === 'initial') {
      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #7C3AED; font-weight: 700; font-size: 12.5px;">★ AIRA</span>
            <span style="color: #374151; font-size: 12.5px; font-weight: 700;">· Follow up?</span>
          </div>
          <button type="button" id="aira-chat-close-btn" style="background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 0 4px; font-size: 13px;" title="Close">✕</button>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
          <div style="font-size: 11.5px; color: #4B5563; font-weight: 400; line-height: 1.2;">
            Tushara committed to sharing the revised deck.
          </div>
          <button type="button" id="aira-chat-draft-btn" class="aira-chat-outline-btn">
            Draft follow-up
          </button>
        </div>
      `;

      setTimeout(() => {
        const closeBtn = card.querySelector('#aira-chat-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            isChatNudgeDismissed = true;
            removeGoogleChatNudge();
          });
        }

        const draftBtn = card.querySelector('#aira-chat-draft-btn');
        if (draftBtn) {
          draftBtn.addEventListener('click', () => {
            chatNudgeState = 'draft';
            removeGoogleChatNudge();
            checkAndInjectGoogleChatAira();
          });
        }
      }, 50);

    } else if (chatNudgeState === 'draft') {
      const suggestedText = "Hi Navatej, quick follow-up on the revised investor deck. I'll include the updated metrics (ARR forecast and customer acquisition trend) and share it shortly.";

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #7C3AED; font-weight: 700; font-size: 13px;">★ AIRA</span>
            <span style="color: #6B7280; font-size: 12.5px; font-weight: 500;">- Suggested draft</span>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; font-size: 12px; color: #374151; line-height: 1.45; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          "${escapeHtml(suggestedText)}"
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          <button type="button" id="aira-chat-insert-btn" class="aira-chat-solid-btn">
            Insert into composer
          </button>
          <button type="button" id="aira-chat-dismiss-link" style="background: none; border: none; color: #6B7280; font-size: 12.5px; cursor: pointer; font-weight: 500;">
            Dismiss
          </button>
        </div>
      `;

      setTimeout(() => {
        const insertBtn = card.querySelector('#aira-chat-insert-btn');
        if (insertBtn) {
          insertBtn.addEventListener('click', () => {
            insertTextIntoGoogleChatComposer(suggestedText);
            isChatNudgeDismissed = true;
            removeGoogleChatNudge();
          });
        }

        const dismissLink = card.querySelector('#aira-chat-dismiss-link');
        if (dismissLink) {
          dismissLink.addEventListener('click', () => {
            isChatNudgeDismissed = true;
            removeGoogleChatNudge();
          });
        }
      }, 50);
    }

    return card;
  }

  function insertTextIntoGoogleChatComposer(text) {
    const mainArea = document.querySelector('div[role="main"]') || document.body;
    const inputEl = mainArea.querySelector('div[role="textbox"]') ||
                    mainArea.querySelector('div[contenteditable="true"]') ||
                    mainArea.querySelector('textarea');

    if (inputEl) {
      inputEl.focus();
      if (inputEl.isContentEditable) {
        inputEl.innerText = text;
      } else {
        inputEl.value = text;
      }

      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[AIRA Extension] Inserted suggested draft into Google Chat composer');
    } else {
      alert('AIRA Suggested Draft:\n\n' + text);
    }
  }


  // --------------------------------------------------------------------------
  // GMAIL EMAIL THREAD LOGIC
  // --------------------------------------------------------------------------

  function extractThreadData() {
    const subjectEl = document.querySelector('h2.hP') || document.querySelector('.hP');
    const senderEl = document.querySelector('.gD') || document.querySelector('span[email]');
    const messageEls = document.querySelectorAll('.ii.gt, div[dir="ltr"]');

    const subject = subjectEl ? subjectEl.innerText : '';
    const sender = senderEl ? (senderEl.getAttribute('name') || senderEl.innerText) : '';
    let body = '';
    messageEls.forEach(el => {
      body += ' ' + el.innerText;
    });

    return {
      subject,
      body,
      sender,
      messageCount: messageEls.length
    };
  }

  function findGmailReplyTarget() {
    if (!isEmailThreadOpen()) return null;

    const bottomContainer = document.querySelector('div.aDh') ||
                            document.querySelector('div.aa5') ||
                            document.querySelector('.bkH') ||
                            document.querySelector('div[role="main"] .iA') ||
                            document.querySelector('div.gA');

    if (bottomContainer) return bottomContainer;

    const allButtons = Array.from(document.querySelectorAll('div[role="button"], span[role="link"], button, .ams, [aria-label*="Reply"]'));
    const replyBtn = allButtons.reverse().find(el => {
      const text = (el.innerText || el.getAttribute('aria-label') || '').trim().toLowerCase();
      return text === 'reply' || text.startsWith('reply to') || text === 'reply all';
    });

    if (replyBtn) {
      const container = replyBtn.closest('.aDh') ||
                        replyBtn.closest('.aa5') ||
                        replyBtn.closest('.gA') ||
                        replyBtn.closest('.iA') ||
                        replyBtn.parentElement;
      if (container) return container;
    }

    return null;
  }

  function removeExistingGmailAiraNudge() {
    const existingNudge = document.getElementById('aira-nudge-root');
    if (existingNudge) existingNudge.remove();
    const wrapper = document.getElementById('aira-purple-btn-wrapper');
    if (wrapper) wrapper.remove();
  }

  function checkAndInjectGmailAira() {
    if (isGmailNudgeDismissed) return;

    const targetElement = findGmailReplyTarget();
    if (!targetElement) {
      removeExistingGmailAiraNudge();
      return;
    }

    const threadData = extractThreadData();
    const signal = window.AiraEngine ?
      window.AiraEngine.analyzeGmailThread(threadData, activeOverrideScenario) :
      null;

    if (!signal || signal.intervention === 'invisible') {
      removeExistingGmailAiraNudge();
      return;
    }

    const existingNudge = document.getElementById('aira-nudge-root');
    if (existingNudge && existingNudge.dataset.scenario === signal.scenarioId && document.body.contains(existingNudge)) {
      return;
    }

    removeExistingGmailAiraNudge();

    const wrapper = injectInlinePurpleButton(targetElement, signal);

    if (wrapper) {
      const airaNode = renderAiraNudgeElement(signal);
      wrapper.appendChild(airaNode);
      console.log('[AIRA Extension] Injected AIRA popover card anchored above purple button!');
    }
  }

  function injectInlinePurpleButton(container, signal) {
    let wrapper = document.getElementById('aira-purple-btn-wrapper');
    if (wrapper) return wrapper;

    wrapper = document.createElement('div');
    wrapper.id = 'aira-purple-btn-wrapper';
    wrapper.className = 'aira-purple-btn-wrapper';

    const btn = document.createElement('button');
    btn.id = 'aira-inline-purple-btn';
    btn.type = 'button';
    btn.className = 'aira-inline-purple-pill';
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
      </svg>
      <span>${escapeHtml(signal.actionLabel || 'Send follow-up')}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    btn.addEventListener('click', () => {
      const airaCard = document.getElementById('aira-nudge-root');
      if (airaCard) {
        airaCard.style.display = airaCard.style.display === 'none' ? 'block' : 'none';
      } else {
        injectGmailReplyDraft(signal.suggestedDraft);
      }
    });

    wrapper.appendChild(btn);

    const allBtns = Array.from(document.querySelectorAll('.ams, div[role="button"], span[role="link"], button'));

    const replyBtns = allBtns.filter(el => {
      const txt = (el.innerText || el.getAttribute('aria-label') || '').toLowerCase();
      return txt.includes('reply') || txt.includes('forward') || txt.includes('reaction') || txt.includes('emoji');
    });

    if (replyBtns.length > 0) {
      const lastBtn = replyBtns[replyBtns.length - 1];

      let parentPill = lastBtn;
      while (parentPill.parentElement && parentPill.parentElement.children.length === 1 && !parentPill.parentElement.classList.contains('aDh') && !parentPill.parentElement.classList.contains('aa5')) {
        parentPill = parentPill.parentElement;
      }

      parentPill.insertAdjacentElement('afterend', wrapper);
      return wrapper;
    }

    container.appendChild(wrapper);
    return wrapper;
  }

  function renderAiraNudgeElement(signal) {
    const root = document.createElement('div');
    root.id = 'aira-nudge-root';
    root.className = 'aira-inline-nudge-container';
    root.dataset.scenario = signal.scenarioId;

    function renderInsightState() {
      root.innerHTML = `
        <div class="aira-inline-nudge-card">
          <!-- Card Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 12px; background: linear-gradient(135deg, #5B3DF5, #7C3AED); display: flex; align-items: center; justify-content: center; color: white;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                </svg>
              </div>
              <div>
                <div style="font-weight: 700; color: #5B3DF5; font-size: 14px; line-height: 1.2;">AIRA Insight</div>
                <div style="font-size: 11px; color: #A78BFA; font-weight: 500;">Predictive Follow-up</div>
              </div>
            </div>
            <button type="button" id="aira-dismiss-icon-btn" style="background:none; border:none; color:#C4B5FD; cursor:pointer; padding:4px;" title="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Highlighted Inner Box -->
          <div style="background-color: #FAF5FF; border-radius: 14px; padding: 12px 14px; margin-bottom: 12px;">
            <div style="font-weight: 700; color: #1F2937; font-size: 12.5px;">${escapeHtml(signal.title || 'No response for 2 days.')}</div>
            <div style="font-size: 11.5px; color: #6D28D9; margin-top: 2px;">${escapeHtml(signal.context || 'A quick follow-up may keep this moving.')}</div>
          </div>

          <!-- Primary Purple Button -->
          <button type="button" id="aira-primary-btn" style="width: 100%; background: #5B3DF5; color: white; border: none; border-radius: 9999px; padding: 10px 16px; font-weight: 600; font-size: 12.5px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(91, 61, 245, 0.3); margin-bottom: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>${escapeHtml(signal.actionLabel || 'Send follow-up')}</span>
          </button>

          <!-- Action Row -->
          <div style="display: flex; gap: 8px;">
            <button type="button" id="aira-dismiss-btn" style="flex: 1; background: white; border: 1px solid #E5E7EB; border-radius: 9999px; padding: 7px 12px; color: #4B5563; font-size: 11.5px; font-weight: 500; cursor: pointer;">Remind me later</button>
            <button type="button" id="aira-why-btn" style="background: white; border: 1px solid #E5E7EB; border-radius: 9999px; padding: 7px 16px; color: #5B3DF5; font-size: 11.5px; font-weight: 600; cursor: pointer;">Why?</button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const whyBtn = root.querySelector('#aira-why-btn');
        const dismissBtn = root.querySelector('#aira-dismiss-btn');
        const dismissIconBtn = root.querySelector('#aira-dismiss-icon-btn');
        const primaryBtn = root.querySelector('#aira-primary-btn');

        if (whyBtn) {
          whyBtn.addEventListener('click', () => {
            renderWhyState();
          });
        }

        if (dismissBtn) {
          dismissBtn.addEventListener('click', () => {
            renderSnoozedState();
          });
        }

        if (dismissIconBtn) {
          dismissIconBtn.addEventListener('click', () => {
            isGmailNudgeDismissed = true;
            removeExistingGmailAiraNudge();
          });
        }

        if (primaryBtn) {
          primaryBtn.addEventListener('click', () => {
            injectGmailReplyDraft(signal.suggestedDraft);
          });
        }
      }, 50);
    }

    function renderWhyState() {
      root.innerHTML = `
        <div class="aira-inline-nudge-card" style="padding: 16px; width: 340px; box-shadow: 0 12px 30px rgba(91, 61, 245, 0.15);">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="color: #5B3DF5; font-size: 14px; font-weight: 700;">✦</span>
              <span style="color: #5B3DF5; font-size: 13.5px; font-weight: 700;">Why is AIRA suggesting this?</span>
            </div>
            <button type="button" id="aira-why-close-btn" style="background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 2px; font-size: 13px;" title="Close">✕</button>
          </div>

          <!-- Reasons list -->
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; font-size: 12px; color: #4B5563; line-height: 1.45;">
            <div>No reply received in <strong style="color: #1F2937;">2 days</strong></div>
            <div>Thread has an open question about design deliverables</div>
            <div>Sender has responded to follow-ups previously</div>
            <div>Similar threads resolved faster with a follow-up</div>
          </div>

          <!-- Back link -->
          <div>
            <button type="button" id="aira-why-back-btn" style="background: none; border: none; color: #5B3DF5; font-weight: 700; font-size: 12.5px; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 4px;">
              ← Back
            </button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const backBtn = root.querySelector('#aira-why-back-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            renderInsightState();
          });
        }

        const closeBtn = root.querySelector('#aira-why-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            isGmailNudgeDismissed = true;
            removeExistingGmailAiraNudge();
          });
        }
      }, 50);
    }

    function renderSnoozedState() {
      const snoozeTimeStr = getFormattedSnoozeTime();

      root.innerHTML = `
        <div class="aira-inline-nudge-card" style="padding: 14px 18px; width: 280px; box-shadow: 0 10px 25px rgba(91, 61, 245, 0.15);">
          <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
            <div style="color: #5B3DF5; flex-shrink: 0; margin-top: 1px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B3DF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <div style="font-weight: 700; color: #1F2937; font-size: 13px; line-height: 1.3;">Snoozed for 1 hour.</div>
              <div style="font-size: 11.5px; color: #6B7280; margin-top: 4px; line-height: 1.4;">
                AIRA will remind you to follow up at ${escapeHtml(snoozeTimeStr)}.
              </div>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <button type="button" id="aira-snooze-undo-btn" style="background: none; border: none; color: #5B3DF5; font-weight: 700; font-size: 12px; cursor: pointer; padding: 0;">
              Undo
            </button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const undoBtn = root.querySelector('#aira-snooze-undo-btn');
        if (undoBtn) {
          undoBtn.addEventListener('click', () => {
            renderInsightState();
          });
        }
      }, 50);
    }

    renderInsightState();
    return root;
  }

  function injectGmailReplyDraft(draftText) {
    const replyBtn = document.querySelector('.ams') ||
                     document.querySelector('div[role="button"][aria-label*="Reply"]') ||
                     document.querySelector('span[role="link"][aria-label*="Reply"]');

    if (replyBtn) {
      replyBtn.click();
    }

    setTimeout(() => {
      const composeBody = document.querySelector('div[aria-label="Message Body"]') ||
                           document.querySelector('div[contenteditable="true"]');

      if (composeBody) {
        composeBody.focus();
        composeBody.innerText = draftText;
        console.log('[AIRA Extension] Populated Gmail reply box with suggested draft');
      } else {
        alert('AIRA Suggested Draft:\n\n' + draftText);
      }
    }, 300);
  }

  // Initialize script execution when page is ready
  function init() {
    startObserver();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
