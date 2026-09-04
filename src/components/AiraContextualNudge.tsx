import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Mail, Check, UserCheck } from 'lucide-react';
import type { AiraSignal, CandidateOption } from '../services/airaIntelligence';

interface AiraContextualNudgeProps {
  signal: AiraSignal;
  onAction: (actionType: string, draftText: string) => void;
  onDismiss: () => void;
}

export const AiraContextualNudge: React.FC<AiraContextualNudgeProps> = ({
  signal,
  onAction,
  onDismiss
}) => {
  const [showWhy, setShowWhy] = useState(false);
  const [showOwnershipPicker, setShowOwnershipPicker] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateOption | null>(null);

  if (!signal || signal.intervention === 'invisible') {
    return null;
  }

  const handlePrimaryActionClick = () => {
    if (signal.action === 'clarify_ownership') {
      setShowOwnershipPicker(!showOwnershipPicker);
    } else {
      onAction(signal.action, signal.suggestedDraft);
    }
  };

  const handleSelectCandidate = (cand: CandidateOption) => {
    setSelectedCandidate(cand);
  };

  const handleConfirmOwnership = () => {
    if (selectedCandidate) {
      const customDraft = `${selectedCandidate.name}, could you take this forward and coordinate the next steps?`;
      onAction('clarify_ownership', customDraft);
      setShowOwnershipPicker(false);
    }
  };

  return (
    <div className="relative font-sans my-4">
      {/* FLOATING AIRA INSIGHT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-[340px] bg-white border border-purple-100 rounded-3xl p-4 shadow-xl mb-4"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#5B3DF5] to-[#7C3AED] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#5B3DF5] text-sm leading-tight">AIRA Insight</h3>
              <p className="text-[11px] text-purple-400 font-medium">Predictive Follow-up</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="text-gray-300 hover:text-gray-500 p-1 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlighted Insight Content Box */}
        <div className="bg-[#F5F3FF] rounded-2xl p-3.5 my-3">
          <p className="font-bold text-gray-900 text-xs">
            {signal.title || 'No response for 2 days.'}
          </p>
          <p className="text-[#6D28D9] text-xs mt-0.5 font-normal">
            {signal.context || 'A quick follow-up may keep this moving.'}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handlePrimaryActionClick}
          className="w-full bg-[#5B3DF5] hover:bg-[#4C2EE3] text-white rounded-full py-2.5 px-4 font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          {signal.action === 'clarify_ownership' ? (
            <UserCheck className="w-4 h-4" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          <span>{signal.actionLabel || 'Send follow-up'}</span>
        </button>

        {/* Action Options Row */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full py-1.5 px-3 text-gray-600 font-medium text-xs text-center cursor-pointer transition-all"
          >
            Remind me later
          </button>
          <button
            type="button"
            onClick={() => setShowWhy(!showWhy)}
            className="bg-white hover:bg-purple-50 border border-gray-200 rounded-full py-1.5 px-4 text-[#5B3DF5] font-semibold text-xs text-center cursor-pointer transition-all"
          >
            Why?
          </button>
        </div>

        {/* Expandable Why Drawer */}
        <AnimatePresence>
          {showWhy && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-3 pt-3 border-t border-purple-100 overflow-hidden"
            >
              <p className="font-semibold text-gray-800 text-[11px] mb-1.5">Why AIRA surfaced this context:</p>
              <ul className="space-y-1 pl-1">
                {signal.whyReasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B3DF5] mt-1 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candidate Ownership Selector */}
        <AnimatePresence>
          {showOwnershipPicker && signal.action === 'clarify_ownership' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-3 pt-3 border-t border-purple-100 overflow-hidden"
            >
              <p className="text-xs font-semibold text-gray-800 mb-2">Who should take this forward?</p>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                {signal.candidates?.map((cand) => {
                  const isSelected = selectedCandidate?.id === cand.id;
                  return (
                    <button
                      key={cand.id}
                      type="button"
                      onClick={() => handleSelectCandidate(cand)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]'
                          : 'bg-white text-[#5B3DF5] border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${cand.avatarBg}`}>
                        {cand.initials}
                      </span>
                      <span>{cand.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!selectedCandidate}
                  onClick={handleConfirmOwnership}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full shadow-2xs transition-all cursor-pointer flex items-center gap-1 ${
                    selectedCandidate
                      ? 'bg-[#5B3DF5] text-white hover:bg-[#4C2EE3]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm & Draft Reply</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* BOTTOM LEFT FOOTER NUDGE LINE */}
      <div className="flex flex-col gap-0.5 mt-2">
        <div className="flex items-center gap-2 text-xs font-medium text-purple-700">
          <Sparkles className="w-3.5 h-3.5 text-[#5B3DF5] fill-[#5B3DF5]" />
          <span>AIRA suggests following up · No response for 2 days</span>
          <button
            type="button"
            onClick={() => setShowWhy(!showWhy)}
            className="text-[#5B3DF5] underline hover:text-[#4C2EE3] font-semibold cursor-pointer ml-1"
          >
            Why?
          </button>
        </div>
        <p className="text-[10px] text-slate-400 italic">AI can make mistakes</p>
      </div>
    </div>
  );
};
