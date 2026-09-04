document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.scenario-btn');
  const resetBtn = document.getElementById('reset-aira-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const scenarioId = btn.dataset.scenario;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetScenario = scenarioId === 'auto_detect' ? null : scenarioId;

      // Send scenario override message to active Gmail tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'SET_SCENARIO',
            scenarioId: targetScenario
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.log('Not on active Gmail tab or content script not ready.');
            } else {
              console.log('Scenario override acknowledged:', response);
            }
          });
        }
      });
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'RESET_AIRA'
          }, (response) => {
            console.log('AIRA reset acknowledged:', response);
          });
        }
      });
    });
  }
});
