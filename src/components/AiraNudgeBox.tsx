import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import type { AiraNudgeState, CandidateOption } from '../types/chat';

interface AiraNudgeBoxProps {
  onConfirmAssignment: (ownerName: string) => void;
  onDismiss: () => void;
}

interface ExtendedCandidateOption extends CandidateOption {
  initials: string;
}

const CANDIDATES: ExtendedCandidateOption[] = [
  { id: 'dinesh', name: 'Dinesh', initials: 'DP', avatarBg: 'bg-[#D94E40]', color: '#D94E40' },
  { id: 'sathvika', name: 'Sathvika', initials: 'SR', avatarBg: 'bg-[#F5B041]', color: '#F5B041' }
];

export const AiraNudgeBox: React.FC<AiraNudgeBoxProps> = ({
  onConfirmAssignment,
  onDismiss
}) => {
  const [state, setState] = useState<AiraNudgeState>('UNCLEAR');
  const [selectedCandidate, setSelectedCandidate] = useState<ExtendedCandidateOption>(CANDIDATES[0]);

  const handleClarifyClick = () => {
    setState('OPTIONS');
    setSelectedCandidate(CANDIDATES[0]);
  };

  const handleSelectCandidate = (candidate: ExtendedCandidateOption) => {
    setSelectedCandidate(candidate);
  };

  const handleConfirm = () => {
    if (selectedCandidate) {
      onConfirmAssignment(selectedCandidate.name + ' Patel');
      setState('CONFIRMED');
    }
  };

  if (state === 'DISMISSED' || state === 'CONFIRMED') {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="mx-0 my-1 p-3 bg-[#FFFBF0] border border-[#FDE047]/80 rounded-2xl shadow-2xs text-xs text-[#78350F] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {state === 'UNCLEAR' && (
          <motion.div
            key="unclear"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="flex items-start justify-between gap-1.5"
          >
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1 font-semibold text-[#B45309] mb-0.5 text-[11.5px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span>AIRA</span>
                <span className="text-amber-400">•</span>
                <span className="font-medium text-[#78350F] truncate">Owner unclear</span>
              </div>
              <p className="text-[#78350F]/90 text-[11px] leading-tight font-normal">
                It's not clear who will take the landing page.
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              <button
                type="button"
                onClick={handleClarifyClick}
                className="px-2.5 py-1 bg-white border border-[#FCD34D] rounded-full font-medium text-[#B45309] hover:bg-amber-50 hover:border-amber-400 active:scale-95 transition-all cursor-pointer text-[10.5px] flex items-center gap-1 shrink-0"
              >
                Clarify owner
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="p-0.5 text-amber-600/70 hover:text-amber-900 hover:bg-amber-200/40 rounded-full transition-colors cursor-pointer shrink-0"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {(state === 'OPTIONS' || state === 'CONFIRMING') && (
          <motion.div
            key="options"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5"
          >
            {/* Header */}
            <div className="flex items-center gap-1.5 text-xs text-gray-800">
              <svg className="w-3.5 h-3.5 text-[#DF8A57] fill-[#DF8A57] shrink-0" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-bold text-[#DF8A57]">AIRA</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-700 font-normal">Who should own the landing page?</span>
            </div>

            {/* Candidate options */}
            <div className="flex items-center gap-2 pt-0.5">
              {CANDIDATES.map((cand) => {
                const isSelected = selectedCandidate?.id === cand.id;
                return (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => handleSelectCandidate(cand)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#DF8A57] text-white border-[#DF8A57] shadow-2xs'
                        : 'bg-white text-[#DF8A57] border-[#DF8A57] hover:bg-amber-50/50 shadow-2xs'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${cand.avatarBg} shrink-0`}
                    >
                      {cand.initials}
                    </span>
                    <span>{cand.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Confirm button - exactly matching 'Confirm' label & terracotta pill styling */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-1 bg-[#DF8A57] hover:bg-[#D47E45] text-white font-medium text-xs rounded-full shadow-2xs transition-all cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


