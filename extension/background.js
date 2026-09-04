/**
 * AIRA Chrome Extension - Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[AIRA Extension] Background Service Worker installed');
});

// Listener for messages from extension popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'OK', timestamp: new Date().toISOString() });
  }
  return true;
});
