import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertOctagon,
  Trash2,
  Mail,
  Clock,
  CheckSquare,
  Folder,
  MoreVertical,
  X,
  Star,
  Smile,
  CornerUpLeft,
  CornerUpRight,
  ChevronDown,
  Paperclip,
  Minus,
  Check,
  Sparkles
} from 'lucide-react';
import type { AiraScenarioId } from '../services/airaIntelligence';
import {
  MOCK_THREADS,
  analyzeThread
} from '../services/airaIntelligence';
import { AiraContextualNudge } from './AiraContextualNudge';

interface EmailDetailViewProps {
  onBack: () => void;
  onSendFollowUp?: () => void;
}

export const EmailDetailView: React.FC<EmailDetailViewProps> = ({ onBack }) => {
  const activeScenario: AiraScenarioId = 'delayed_response';
  const [dismissedScenarios, setDismissedScenarios] = useState<Record<string, boolean>>({});
  const [showComposerPopup, setShowComposerPopup] = useState(false);
  const [composerDraft, setComposerDraft] = useState('');
  const [showSentSuccessBanner, setShowSentSuccessBanner] = useState(false);
  const [sentRecipient, setSentRecipient] = useState('');

  const currentThread = MOCK_THREADS[activeScenario];
  const airaSignal = analyzeThread(currentThread);
  const isNudgeDismissed = dismissedScenarios[activeScenario];

  const handleNudgeAction = (_actionType: string, draftText: string) => {
    setComposerDraft(draftText);
    setShowComposerPopup(true);
  };

  const handleDismissNudge = () => {
    setDismissedScenarios((prev) => ({ ...prev, [activeScenario]: true }));
  };

  const handleSendDraft = () => {
    setShowComposerPopup(false);
    setSentRecipient(currentThread.messages[0]?.sender || 'Navatej Kumar');
    setShowSentSuccessBanner(true);
  };

  return (
    <div className="flex-1 bg-[#F6F8FC] flex flex-col min-w-0 overflow-y-auto no-scrollbar p-4 text-[#1F1F1F]">
      {/* TOP ACTION TOOLBAR */}
      <div className="flex items-center justify-between py-2 px-1 mb-3 text-gray-600 text-xs shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer text-gray-700"
            title="Back to inbox"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-4 border-r border-gray-300 mx-1" />
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="Report spam">
            <AlertOctagon className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="Mark as unread">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="Snooze">
            <Clock className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="Add to tasks">
            <CheckSquare className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="Move to">
            <Folder className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/80 rounded-full transition-colors cursor-pointer" title="More options">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <span>1 of 4</span>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-200/80 rounded-full cursor-pointer text-gray-400">&lt;</button>
            <button className="p-1 hover:bg-gray-200/80 rounded-full cursor-pointer text-gray-700">&gt;</button>
          </div>
        </div>
      </div>

      {/* EMAIL SUBJECT LINE ROW */}
      <div className="px-2 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-normal text-gray-900 tracking-tight">
          {currentThread.subject}
        </h1>
        <div className="flex items-center gap-2">
          <span className="bg-[#D3E3FD] text-[#041E49] px-2.5 py-0.5 rounded-md text-xs font-medium flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Inbox
            <X className="w-3 h-3 cursor-pointer hover:text-black ml-0.5" />
          </span>
        </div>
      </div>

      {/* THREAD MESSAGES */}
      <div className="space-y-4 mb-4 max-w-4xl">
        {currentThread.messages.map((msg) => (
          <div key={msg.id} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {msg.sender.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-gray-900 text-sm">{msg.sender}</span>
                    <span className="text-xs text-gray-500 font-normal">&lt;{msg.senderEmail}&gt;</span>
                  </div>
                  <div className="text-xs text-gray-500 font-normal flex items-center gap-1 mt-0.5">
                    <span>to me</span>
                    <ChevronDown className="w-3 h-3 text-gray-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-500 text-xs">
                <span>{msg.timestamp}</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer" title="Star">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer" title="Reply">
                    <CornerUpLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-800 space-y-2 font-normal leading-relaxed">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTEXTUAL AIRA NUDGE INJECTION (Pertains to Principle: AIRA appears INSIDE thread) */}
      {!isNudgeDismissed && (
        <AiraContextualNudge
          signal={airaSignal}
          onAction={handleNudgeAction}
          onDismiss={handleDismissNudge}
        />
      )}

      {/* GREEN SENT SUCCESS BANNER */}
      {showSentSuccessBanner && (
        <div className="bg-[#EDFDF2] border border-[#DCFCE7] rounded-xl px-4 py-3 my-3 flex items-center justify-between max-w-4xl text-xs text-[#166534] font-medium shadow-2xs transition-all">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534] stroke-[2.5]" />
            <span>Your message was sent to {sentRecipient}.</span>
          </div>
          <button
            onClick={() => setShowSentSuccessBanner(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* NATIVE GMAIL REPLY BUTTON BAR */}
      <div className="flex items-center gap-3 max-w-4xl mt-2">
        <button
          onClick={() => {
            setComposerDraft('');
            setShowComposerPopup(true);
          }}
          className="border border-gray-300 rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer flex items-center gap-2"
        >
          <CornerUpLeft className="w-3.5 h-3.5 text-gray-600" />
          Reply
        </button>
        <button
          onClick={() => {
            setComposerDraft('');
            setShowComposerPopup(true);
          }}
          className="border border-gray-300 rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer flex items-center gap-2"
        >
          <CornerUpRight className="w-3.5 h-3.5 text-gray-600" />
          Forward
        </button>
        <button
          onClick={() => {
            setComposerDraft(airaSignal.suggestedDraft || 'Hi Navatej, following up on this.');
            setShowComposerPopup(true);
          }}
          className="bg-[#5B3DF5] hover:bg-[#4C2EE3] text-white rounded-full px-4.5 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-98 ml-1"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>Send follow-up</span>
          <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* GMAIL AIRA SUGGESTED DRAFT COMPOSER POPUP WINDOW */}
      {showComposerPopup && (
        <div className="fixed bottom-0 right-12 w-[520px] bg-white rounded-t-2xl shadow-2xl border border-gray-300 z-50 overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-5 font-sans">
          {/* Top Header Bar */}
          <div className="bg-[#363636] text-white px-4 py-3 flex items-center justify-between text-xs font-semibold rounded-t-2xl select-none">
            <span>New Message</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowComposerPopup(false)} className="p-1 hover:bg-gray-700/60 rounded text-gray-300 hover:text-white cursor-pointer" title="Minimize">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setShowComposerPopup(false)} className="p-1 hover:bg-gray-700/60 rounded text-gray-300 hover:text-white cursor-pointer" title="Close">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Header Fields */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center text-xs">
            <span className="w-16 text-gray-500 font-medium shrink-0">To</span>
            <span className="text-gray-900 font-medium truncate">{currentThread.messages[0]?.senderEmail || 'navatej@novacommunicate.com'}</span>
          </div>
          <div className="px-4 py-2 border-b border-gray-100 flex items-center text-xs">
            <span className="w-16 text-gray-500 font-medium shrink-0">Subject</span>
            <span className="text-gray-900 font-medium truncate">Re: {currentThread.subject}</span>
          </div>

          {/* AIRA Suggested Draft Banner */}
          {composerDraft && (
            <div className="px-4 pt-3 pb-1 flex items-center gap-2">
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-md px-2.5 py-1 inline-flex items-center gap-1.5 text-xs text-[#B45309] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706] fill-[#F59E0B]" />
                <span>AIRA suggested draft</span>
              </div>
              <span className="text-xs text-gray-500 font-normal">Edit before sending</span>
            </div>
          )}

          {/* Message Body Area */}
          <div className="p-4 flex-1">
            <textarea
              value={composerDraft}
              onChange={(e) => setComposerDraft(e.target.value)}
              placeholder="Write your response..."
              rows={7}
              className="w-full border-none outline-none text-xs text-gray-800 leading-relaxed font-normal resize-none bg-transparent"
            />
          </div>

          {/* Bottom Send & Tools Bar */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendDraft}
                className="px-6 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full text-xs font-semibold cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer" title="Attach file">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer" title="Insert emoji">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowComposerPopup(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
              title="Discard draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
