export type AiraScenarioId = 'delayed_response' | 'missing_ownership' | 'conversation_loop' | 'normal_progress';

export type InterventionLevel = 'invisible' | 'nudge' | 'escalation';

export interface CandidateOption {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  color: string;
  email: string;
}

export interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  recipientEmail: string;
  timestamp: string;
  hoursAgo: number;
  text: string;
  hasQuestion?: boolean;
}

export interface EmailThreadData {
  id: string;
  subject: string;
  participants: CandidateOption[];
  messages: EmailMessage[];
  scenarioId: AiraScenarioId;
}

export interface AiraSignal {
  scenarioId: AiraScenarioId;
  signal: string;
  confidence: 'high' | 'medium' | 'low';
  intervention: InterventionLevel;
  title: string;
  context: string;
  message: string;
  reason: string;
  whyTitle: string;
  whyReasons: string[];
  action: 'follow_up' | 'clarify_ownership' | 'summarize_next_step' | 'summarize' | 'none';
  actionLabel: string;
  suggestedDraft: string;
  candidates?: CandidateOption[];
}

export const SAMPLE_CANDIDATES: CandidateOption[] = [
  { id: 'navatej', name: 'Navatej', initials: 'NK', avatarBg: 'bg-[#5B3DF5]', color: '#5B3DF5', email: 'navatej@novacommunicate.com' },
  { id: 'sarah', name: 'Sarah', initials: 'SP', avatarBg: 'bg-[#D94E40]', color: '#D94E40', email: 'sarah@novacommunicate.com' },
  { id: 'rahul', name: 'Rahul', initials: 'RK', avatarBg: 'bg-[#34A853]', color: '#34A853', email: 'rahul@novacommunicate.com' }
];

export const MOCK_THREADS: Record<AiraScenarioId, EmailThreadData> = {
  delayed_response: {
    id: 'thread_delayed',
    subject: 'Confirmation needed: API schema changes for v2 endpoint',
    scenarioId: 'delayed_response',
    participants: SAMPLE_CANDIDATES,
    messages: [
      {
        id: 'msg_1',
        sender: 'Sarah Patel',
        senderEmail: 'sarah@novacommunicate.com',
        recipientEmail: 'me@novacommunicate.com',
        timestamp: '6 hours ago',
        hoursAgo: 6,
        text: 'Can you confirm whether we should proceed with the API changes?',
        hasQuestion: true
      }
    ]
  },

  missing_ownership: {
    id: 'thread_ownership',
    subject: 'Landing page overhaul & UI component library sync',
    scenarioId: 'missing_ownership',
    participants: SAMPLE_CANDIDATES,
    messages: [
      {
        id: 'msg_10',
        sender: 'Navatej Kumar',
        senderEmail: 'navatej@novacommunicate.com',
        recipientEmail: 'me@novacommunicate.com',
        timestamp: '3 hours ago',
        hoursAgo: 3,
        text: 'Okay, let\'s get this done this week.'
      }
    ]
  },

  conversation_loop: {
    id: 'thread_loop',
    subject: 'Database migration strategy for multi-region deployment',
    scenarioId: 'conversation_loop',
    participants: SAMPLE_CANDIDATES,
    messages: [
      {
        id: 'msg_20',
        sender: 'Sarah Patel',
        senderEmail: 'sarah@novacommunicate.com',
        recipientEmail: 'me@novacommunicate.com',
        timestamp: '1 day ago',
        hoursAgo: 24,
        text: 'Should we use zero-downtime blue/green migration or schema maintenance window?'
      },
      {
        id: 'msg_21',
        sender: 'Rahul K',
        senderEmail: 'rahul@novacommunicate.com',
        recipientEmail: 'sarah@novacommunicate.com',
        timestamp: '18 hours ago',
        hoursAgo: 18,
        text: 'Blue/green is safer but takes longer to set up.'
      },
      {
        id: 'msg_22',
        sender: 'Navatej Kumar',
        senderEmail: 'navatej@novacommunicate.com',
        recipientEmail: 'team@novacommunicate.com',
        timestamp: '12 hours ago',
        hoursAgo: 12,
        text: 'Maintenance window is faster, but affects US users.'
      },
      {
        id: 'msg_23',
        sender: 'Sarah Patel',
        senderEmail: 'sarah@novacommunicate.com',
        recipientEmail: 'team@novacommunicate.com',
        timestamp: '4 hours ago',
        hoursAgo: 4,
        text: 'What if we do it in off-peak hours over the weekend?'
      }
    ]
  },

  normal_progress: {
    id: 'thread_normal',
    subject: 'Updated design specs for Q3 sprint',
    scenarioId: 'normal_progress',
    participants: SAMPLE_CANDIDATES,
    messages: [
      {
        id: 'msg_30',
        sender: 'Keerthi Reddy',
        senderEmail: 'keerthi@novacommunicate.com',
        recipientEmail: 'me@novacommunicate.com',
        timestamp: '30 mins ago',
        hoursAgo: 0.5,
        text: 'Hi team, here are the updated design specs for the Q3 sprint. Everything is synced in Figma.'
      },
      {
        id: 'msg_31',
        sender: 'Me',
        senderEmail: 'me@novacommunicate.com',
        recipientEmail: 'keerthi@novacommunicate.com',
        timestamp: '10 mins ago',
        hoursAgo: 0.1,
        text: 'Thanks Keerthi! Reviewing now and will integrate into the sprint board.'
      }
    ]
  }
};

/**
 * Pure Intelligence Evaluator
 * Takes thread parsed data and outputs signal & intervention decision.
 * Decoupled from UI rendering.
 */
export function analyzeThread(thread: EmailThreadData): AiraSignal {
  const scenario = thread.scenarioId;

  if (scenario === 'delayed_response') {
    return {
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
    };
  }

  if (scenario === 'missing_ownership') {
    return {
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
    };
  }

  if (scenario === 'conversation_loop') {
    return {
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
    };
  }

  // Scenario 4 — Normal progress (Silence is part of the product!)
  return {
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
  };
}
