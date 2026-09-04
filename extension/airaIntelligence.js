/**
 * AIRA Intelligence Engine for Chrome Extension
 * Dynamic Analysis Engine for Gmail Content Script environment.
 */
(function(global) {
  const SAMPLE_CANDIDATES = [
    { id: 'navatej', name: 'Navatej', initials: 'NK', avatarBg: '#5B3DF5', email: 'navatej@novacommunicate.com' },
    { id: 'sarah', name: 'Sarah', initials: 'SP', avatarBg: '#D94E40', email: 'sarah@novacommunicate.com' },
    { id: 'rahul', name: 'Rahul', initials: 'RK', avatarBg: '#34A853', email: 'rahul@novacommunicate.com' }
  ];

  const SCENARIOS = {
    delayed_response: {
      scenarioId: 'delayed_response',
      signal: 'delayed_response',
      confidence: 'high',
      intervention: 'nudge',
      title: 'This might need a follow-up',
      context: 'No response for ~6h · this thread usually moves faster',
      message: 'This might need a follow-up',
      reason: 'No response for ~6h · this thread usually moves faster',
      whyTitle: 'Why am I seeing this?',
      whyReasons: [
        'No response in the last 6 hours.',
        'Similar conversations usually move faster.',
        'This may delay the next step.'
      ],
      action: 'follow_up',
      actionLabel: 'Follow up',
      suggestedDraft: 'Hi Sarah,\n\nJust following up on this. Could you confirm whether we should proceed with the API changes?'
    },

    missing_ownership: {
      scenarioId: 'missing_ownership',
      signal: 'missing_ownership',
      confidence: 'medium',
      intervention: 'nudge',
      title: 'This may need an owner',
      context: 'No clear owner for the next step',
      message: 'This may need an owner',
      reason: 'No clear owner for the next step',
      whyTitle: 'Why am I seeing this?',
      whyReasons: [
        'Conversation concluded with an action item ("get this done this week")',
        'No specific participant was tagged or assigned as owner',
        'Assigning ownership ensures task completion before sprint end'
      ],
      action: 'clarify_ownership',
      actionLabel: 'Clarify ownership',
      suggestedDraft: 'Sarah, could you take this forward?',
      candidates: SAMPLE_CANDIDATES
    },

    conversation_loop: {
      scenarioId: 'conversation_loop',
      signal: 'conversation_loop',
      confidence: 'high',
      intervention: 'nudge',
      title: "This conversation isn't converging",
      context: 'Multiple replies without a clear decision',
      message: "This conversation isn't converging",
      reason: 'Multiple replies without a clear decision',
      whyTitle: 'Why am I seeing this?',
      whyReasons: [
        'Multiple back-and-forth replies exchanged over 24 hours',
        'Participants are weighing options without picking a final path',
        'Summarizing next steps will break the decision loop'
      ],
      action: 'summarize',
      actionLabel: 'Summarize next step',
      suggestedDraft: 'Hi team, to make sure we\'re aligned and moving forward:\n1. We will proceed with the blue/green migration path.\n2. Sarah will draft the execution plan by tomorrow 2 PM.'
    },

    normal_progress: {
      scenarioId: 'normal_progress',
      signal: 'none',
      confidence: 'low',
      intervention: 'invisible',
      title: '',
      context: '',
      message: '',
      reason: '',
      whyTitle: '',
      whyReasons: [],
      action: 'none',
      actionLabel: '',
      suggestedDraft: ''
    }
  };

  /**
   * DYNAMIC ANALYSIS ENGINE:
   * Extracts real-time thread parameters (sender, subject, text features)
   * and dynamically builds contextual nudges and personalized reply drafts!
   */
  function analyzeGmailThread(parsedData, overrideScenario) {
    // 1. Manual Scenario Override (for testing prototype states)
    if (overrideScenario && SCENARIOS[overrideScenario]) {
      return SCENARIOS[overrideScenario];
    }

    const subject = (parsedData.subject || '').trim();
    const body = (parsedData.body || '').trim();
    const sender = (parsedData.sender || 'Team').trim();
    const fullText = (subject + ' ' + body).toLowerCase();

    // Extract first name of sender dynamically from email header/signature
    const firstName = sender.split(' ')[0] || 'there';

    // 2. Dynamic Rule 1: Action items without assigned owner
    if (fullText.includes("let's get") || fullText.includes('next steps') || fullText.includes('who can take') || fullText.includes('action item')) {
      return {
        ...SCENARIOS.missing_ownership,
        context: `Action item detected · No owner assigned yet`,
        whyReasons: [
          `Email contains pending action items ("${subject || 'next steps'}")`,
          `No specific person assigned to own the deliverable`,
          `AIRA recommends assigning an explicit owner`
        ],
        suggestedDraft: `Hi ${firstName}, could you take ownership of this deliverable and confirm the timeline?`
      };
    }

    // 3. Dynamic Rule 2: Unanswered questions or delayed responses
    if (fullText.includes('?') || fullText.includes('confirm') || fullText.includes('update') || fullText.includes('interested')) {
      return {
        ...SCENARIOS.delayed_response,
        context: `Pending question for ${firstName} · No response received`,
        whyReasons: [
          `Thread contains an open question ("${subject || 'inquiry'}")`,
          `Conversation has been idle with no reply from recipient`,
          `AIRA generated a polite follow-up draft for ${firstName}`
        ],
        suggestedDraft: `Hi ${firstName}, just following up regarding "${subject || 'our previous conversation'}". Let me know if you need any additional details to move forward!`
      };
    }

    // 4. Dynamic Rule 3: High message count without resolution
    if ((parsedData.messageCount || 1) >= 3 || fullText.includes('migration') || fullText.includes('options')) {
      return {
        ...SCENARIOS.conversation_loop,
        context: `Multiple exchanges detected · Decision needed`,
        whyReasons: [
          `Multiple replies exchanged regarding "${subject || 'topic'}"`,
          `Thread requires convergence on clear next steps`,
          `AIRA prepared a structured summary draft`
        ],
        suggestedDraft: `Hi ${firstName}, to summarize our options and confirm next steps for "${subject}":\n1. Proceed with the proposed approach.\n2. Review and finalize by end of day.`
      };
    }

    // 5. Default Dynamic Fallback for any opened email thread
    return {
      ...SCENARIOS.delayed_response,
      context: `Dynamic Thread Observer Active · Follow-up suggested`,
      whyReasons: [
        `AIRA dynamically observed thread: "${subject || 'Email Conversation'}"`,
        `Extracted recipient context for ${firstName}`,
        `Suggested response pre-filled for quick reply`
      ],
      suggestedDraft: `Hi ${firstName}, thanks for reaching out! I've reviewed your message regarding "${subject || 'this email'}" and will get back to you shortly.`
    };
  }

  /**
   * OPTIONAL ASYNC API HOOK (for connecting a real Gemini / Claude LLM Backend API)
   */
  async function analyzeGmailThreadAsync(parsedData, apiEndpoint = 'https://api.nova.ai/v1/aira/analyze') {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[AIRA Engine] Fallback to local dynamic analyzer:', e);
    }
    return analyzeGmailThread(parsedData, null);
  }

  global.AiraEngine = {
    analyzeGmailThread,
    analyzeGmailThreadAsync,
    SCENARIOS,
    SAMPLE_CANDIDATES
  };
})(typeof window !== 'undefined' ? window : this);
