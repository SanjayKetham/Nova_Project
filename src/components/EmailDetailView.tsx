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
  Sparkles,
  ChevronDown,
  Paperclip,
  Minus,
  Check
} from 'lucide-react';

interface EmailDetailViewProps {
  onBack: () => void;
  onSendFollowUp?: () => void;
}

export const EmailDetailView: React.FC<EmailDetailViewProps> = ({ onBack }) => {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showWhyTooltip, setShowWhyTooltip] = useState(false);
  const [showAiraInsightPopover, setShowAiraInsightPopover] = useState(true);
  const [showComposerPopup, setShowComposerPopup] = useState(false);
  const [showSentSuccessBanner, setShowSentSuccessBanner] = useState(false);
  const [showSnoozedPopover, setShowSnoozedPopover] = useState(false);
  const [composerText, setComposerText] = useState(
    `Hi Navatej,\n\nJust following up on my end — wanted to give you a quick status update.\n\nWe're currently reviewing the revised Gmail feedback experience designs. I'll have a full update to share with you shortly.`
  );

  const handleQuickReply = (text: string) => {
    setReplyText(text);
    setShowReplyComposer(true);
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
          <span>1 of 3</span>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-200/80 rounded-full cursor-pointer text-gray-400">
              &lt;
            </button>
            <button className="p-1 hover:bg-gray-200/80 rounded-full cursor-pointer text-gray-700">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* EMAIL SUBJECT LINE ROW */}
      <div className="px-2 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-normal text-gray-900 tracking-tight">
          Updated needed on Gmail feedback
        </h1>
        <div className="flex items-center gap-2">
          <span className="bg-[#D3E3FD] text-[#041E49] px-2.5 py-0.5 rounded-md text-xs font-medium flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Inbox
            <X className="w-3 h-3 cursor-pointer hover:text-black ml-0.5" />
          </span>
        </div>
      </div>

      {/* MAIN EMAIL CARD */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs mb-6 max-w-4xl">
        {/* SENDER HEADER ROW */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            {/* Navatej Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-300/80 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
                alt="Navatej Kumar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-gray-900 text-sm">Navatej Kumar</span>
                <span className="text-xs text-gray-500 font-normal">&lt;navatej@novacommunicate.com&gt;</span>
              </div>
              <div className="text-xs text-gray-500 font-normal flex items-center gap-1 mt-0.5">
                <span>to me</span>
                <ChevronDown className="w-3 h-3 text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>11:38 AM (8 minutes ago)</span>
            <div className="flex items-center gap-1 text-gray-500">
              <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer" title="Star">
                <Star className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer" title="Add reaction">
                <Smile className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer" title="Reply">
                <CornerUpLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer" title="More options">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* EMAIL BODY TEXT */}
        <div className="text-sm text-gray-800 space-y-4 font-normal leading-relaxed mb-8">
          <p>Hi Tushara,</p>
          <p>Following up on this. What's the status of the revised Gmail feedback experience designs?</p>
          <p>Let me know.</p>
        </div>

        {/* SENDER EMAIL SIGNATURE BLOCK */}
        <div className="pt-4 border-t border-gray-100 flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-300/60 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
              alt="Navatej Kumar Headshot"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border-l-2 border-blue-600 pl-3.5 py-0.5 flex-1 text-xs">
            <h4 className="font-bold text-gray-900 text-sm">Navatej Kumar</h4>
            <p className="text-gray-600 font-medium">Founder &amp; CEO</p>
            <p className="text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">E:</span> navatej@novacommunicate.com | novacommunicate.com
            </p>
            <p className="text-gray-500">Hyderabad, Telangana | India</p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="w-4 h-4 bg-[#0A66C2] rounded text-white font-bold text-[9px] flex items-center justify-center">
                in
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GREEN SENT SUCCESS BANNER */}
      {showSentSuccessBanner && (
        <div className="bg-[#EDFDF2] border border-[#DCFCE7] rounded-xl px-4 py-3 mb-4 flex items-center justify-between max-w-4xl text-xs text-[#166534] font-medium shadow-2xs transition-all">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534] stroke-[2.5]" />
            <span>Your follow-up was sent to Navatej Kumar.</span>
          </div>
          <button
            onClick={() => setShowSentSuccessBanner(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SMART QUICK REPLY CHIPS */}
      <div className="flex items-center gap-3 mb-6 max-w-4xl">
        <button
          onClick={() => handleQuickReply('Yes, I am working on it.')}
          className="px-4 py-2 border border-gray-300 rounded-full text-xs text-blue-600 font-medium hover:bg-blue-50/80 transition-all cursor-pointer shadow-2xs"
        >
          Yes, I am working on it.
        </button>
        <button
          onClick={() => handleQuickReply("Yes, it's done.")}
          className="px-4 py-2 border border-gray-300 rounded-full text-xs text-blue-600 font-medium hover:bg-blue-50/80 transition-all cursor-pointer shadow-2xs"
        >
          Yes, it's done.
        </button>
        <button
          onClick={() => handleQuickReply('No feedback yet.')}
          className="px-4 py-2 border border-gray-300 rounded-full text-xs text-blue-600 font-medium hover:bg-blue-50/80 transition-all cursor-pointer shadow-2xs"
        >
          No feedback yet.
        </button>
      </div>

      {/* REPLY ACTION BUTTONS & PURPLE AIRA NUDGE ROW */}
      <div className="flex flex-col gap-3 max-w-4xl">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowReplyComposer(true)}
            className="border border-gray-300 rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer flex items-center gap-2"
          >
            <CornerUpLeft className="w-3.5 h-3.5 text-gray-600" />
            Reply
          </button>
          <button
            onClick={() => setShowReplyComposer(true)}
            className="border border-gray-300 rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer flex items-center gap-2"
          >
            <CornerUpLeft className="w-3.5 h-3.5 text-gray-600" />
            Reply all
          </button>
          <button
            onClick={() => setShowReplyComposer(true)}
            className="border border-gray-300 rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer flex items-center gap-2"
          >
            <CornerUpRight className="w-3.5 h-3.5 text-gray-600" />
            Forward
          </button>
          <button className="border border-gray-300 rounded-full p-2 text-gray-600 hover:bg-gray-100/80 transition-colors cursor-pointer">
            <Smile className="w-4 h-4" />
          </button>

          {/* PURPLE AIRA SEND FOLLOW-UP BUTTON WRAPPER WITH POPOVER */}
          <div className="relative inline-block ml-1">
            {/* FLOATING SNOOZED POPOVER CARD */}
            {showSnoozedPopover && (
              <div className="absolute bottom-full mb-3 right-0 w-[260px] bg-white border border-purple-200/90 rounded-[20px] p-4 shadow-xl z-30 transition-all">
                <div className="flex items-center gap-2 mb-1.5 text-gray-900 font-bold text-xs">
                  <Clock className="w-4 h-4 text-[#5B3DF5]" />
                  <span>Snoozed for 1 hour.</span>
                </div>
                <p className="text-xs text-gray-600 font-normal leading-relaxed">
                  AIRA will remind you to follow up at 3:30 PM.
                </p>
                <button
                  onClick={() => {
                    setShowSnoozedPopover(false);
                    setShowAiraInsightPopover(true);
                  }}
                  className="mt-3 text-xs text-[#5B3DF5] font-semibold cursor-pointer hover:underline block"
                >
                  Undo
                </button>
              </div>
            )}

            {/* FLOATING AIRA INSIGHT POPOVER CARD */}
            {showAiraInsightPopover && !showSnoozedPopover && (
              <div className="absolute bottom-full mb-3 right-0 w-[300px] bg-white border border-purple-200/90 rounded-[20px] p-4 shadow-xl z-30 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED] shrink-0">
                      <Sparkles className="w-4 h-4 fill-[#7C3AED] text-[#7C3AED]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#5B3DF5] text-sm leading-tight">AIRA Insight</h4>
                      <span className="text-[11px] text-purple-400 font-normal">Predictive Follow-up</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAiraInsightPopover(false)}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Box */}
                <div className="bg-[#F9F0FF] rounded-xl p-3 mb-3 border border-purple-100/70">
                  <p className="font-semibold text-gray-900 text-xs mb-0.5">
                    No response for 2 days.
                  </p>
                  <p className="text-xs text-gray-600 font-normal leading-snug">
                    A quick follow-up may keep this moving.
                  </p>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => {
                    setShowComposerPopup(true);
                    setShowAiraInsightPopover(false);
                  }}
                  className="w-full py-2 mb-2.5 bg-[#5B3DF5] hover:bg-[#4C2EE3] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Mail className="w-4 h-4 stroke-[2]" />
                  <span>Send follow-up</span>
                </button>

                {/* Secondary Action Pills */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setShowAiraInsightPopover(false);
                      setShowSnoozedPopover(true);
                    }}
                    className="flex-1 py-1 px-3 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-50 text-center cursor-pointer font-normal"
                  >
                    Remind me later
                  </button>
                  <button
                    onClick={() => setShowWhyTooltip(!showWhyTooltip)}
                    className="py-1 px-4 border border-purple-200 rounded-full text-xs text-[#5B3DF5] hover:bg-purple-50 text-center cursor-pointer font-medium"
                  >
                    Why?
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (showAiraInsightPopover) {
                  setShowComposerPopup(true);
                  setShowAiraInsightPopover(false);
                } else {
                  setShowAiraInsightPopover(true);
                }
              }}
              className="px-5 py-2.5 bg-[#5B3DF5] hover:bg-[#4C2EE3] text-white rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 fill-white text-white" />
              <span>Send follow-up</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AIRA SUGGESTION NUDGE NOTE */}
        <div className="mt-1">
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 fill-[#7C3AED] text-[#7C3AED]" />
            <span className="font-semibold text-[#7C3AED]">AIRA suggests following up</span>
            <span className="text-gray-500 font-normal">· No response for 2 days</span>
            <button
              onClick={() => setShowWhyTooltip(!showWhyTooltip)}
              className="text-[#7C3AED] font-semibold underline text-xs cursor-pointer ml-1"
            >
              Why?
            </button>
          </div>
          <p className="text-[10px] text-gray-400 italic mt-0.5">
            AI can make mistakes
          </p>

          {showWhyTooltip && (
            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 max-w-md shadow-2xs">
              AIRA detected that Navatej asked for the revised Gmail feedback experience designs 2 days ago and no reply has been sent yet.
            </div>
          )}
        </div>

        {/* INLINE REPLY COMPOSER BOX */}
        {showReplyComposer && (
          <div className="mt-4 bg-white border border-gray-300 rounded-2xl p-4 shadow-md max-w-4xl">
            <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
              <span>To: Navatej Kumar &lt;navatej@novacommunicate.com&gt;</span>
              <button onClick={() => setShowReplyComposer(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full border-none outline-none text-xs text-gray-800 placeholder-gray-400 resize-none font-normal"
            />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  alert('Reply sent!');
                  setShowReplyComposer(false);
                  setReplyText('');
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-xs cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GMAIL AIRA SUGGESTED DRAFT COMPOSER POPUP WINDOW */}
      {showComposerPopup && (
        <div className="fixed bottom-0 right-12 w-[520px] bg-white rounded-t-2xl shadow-2xl border border-gray-300 z-50 overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-5">
          {/* Dark Charcoal Top Header Bar */}
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

          {/* Header Fields: To & Subject */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center text-xs">
            <span className="w-16 text-gray-500 font-medium shrink-0">To</span>
            <span className="text-gray-900 font-medium truncate">navatej@novacommunicate.com</span>
          </div>
          <div className="px-4 py-2 border-b border-gray-100 flex items-center text-xs">
            <span className="w-16 text-gray-500 font-medium shrink-0">Subject</span>
            <span className="text-gray-900 font-medium truncate">Re: Updated needed on Gmail feedback</span>
          </div>

          {/* AIRA Suggested Draft Chip Banner */}
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <div className="bg-[#F3E8FF] rounded-md px-2.5 py-1 inline-flex items-center gap-1.5 text-xs text-[#7C3AED] font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-[#7C3AED] text-[#7C3AED]" />
              <span>AIRA suggested draft</span>
            </div>
            <span className="text-xs text-gray-400 font-normal">Edit before sending</span>
          </div>

          {/* Message Body Area */}
          <div className="p-4 flex-1">
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              rows={7}
              className="w-full border-none outline-none text-xs text-gray-800 leading-relaxed font-normal resize-none bg-transparent"
            />
          </div>

          {/* Bottom Send & Tools Bar */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowComposerPopup(false);
                  setShowAiraInsightPopover(false);
                  setShowSnoozedPopover(false);
                  setShowSentSuccessBanner(true);
                }}
                className="px-6 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full text-xs font-semibold cursor-pointer shadow-md transition-all"
              >
                Send
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer" title="Attach file">
                <Paperclip className="w-4 h-4" />
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
