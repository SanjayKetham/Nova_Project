const fs = require('fs');

const airaNudgeCode = import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check } from 'lucide-react';
import { AiraNudgeState, CandidateOption } from '../types/chat';

interface AiraNudgeBoxProps {
  onConfirmAssignment: (ownerName: string) => void;
  onDismiss: () => void;
}

const CANDIDATES: CandidateOption[] = [
  { id: 'dinesh', name: 'Dinesh', avatarBg: 'bg-rose-500', color: '#f43f5e' },
  { id: 'sathvika', name: 'Sathvika', avatarBg: 'bg-amber-500', color: '#f59e0b' }
];

export const AiraNudgeBox: React.FC<AiraNudgeBoxProps> = ({
  onConfirmAssignment,
  onDismiss
}) => {
  const [state, setState] = useState<AiraNudgeState>('UNCLEAR');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateOption | null>(null);

  const handleClarifyClick = () => {
    setState('OPTIONS');
  };

  const handleSelectCandidate = (candidate: CandidateOption) => {
    if (selectedCandidate?.id === candidate.id) {
      setSelectedCandidate(null);
      setState('OPTIONS');
    } else {
      setSelectedCandidate(candidate);
      setState('CONFIRMING');
    }
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
      className= mx-3 my-2 p-3.5 bg-gradient-to-r from-[#FFFBF0] via-[#FFF9E6] to-[#FFF4D6] border border-[#FCD34D] rounded-2xl shadow-sm text-xs text-[#78350F] relative overflow-hidden
    >
      <div className=absolute -right-4 -top-4 w-16 h-16 bg-amber-200/40 rounded-full blur-xl pointer-events-none />

      <AnimatePresence mode=wait>
        {state === 'UNCLEAR' && (
          <motion.div
            key=unclear
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className=flex items-start justify-between gap-2
          >
            <div className=flex-1 pr-2>
              <div className=flex items-center gap-1.5 font-semibold text-[#B45309] mb-1>
                <Sparkles className=w-3.5 h-3.5 text-amber-500 fill-amber-400 />
                <span>AIRA</span>
                <span className=text-amber-400>·</span>
                <span className=font-medium text-[#78350F]>Owner unclear</span>
              </div>
              <p className=text-[#78350F]/90 text-[11.5px] leading-relaxed font-normal>
                It's not clear who will take the landing page.
              </p>
            </div>

            <div className=flex items-center gap-1.5 shrink-0 pt-0.5>
              <button
                onClick={handleClarifyClick}
                className=px-3 py-1.5 bg-white border border-[#FCD34D] rounded-full font-medium text-[#B45309] hover:bg-amber-50 hover:border-amber-400 active:scale-95 transition-all shadow-2xs cursor-pointer text-[11px] flex items-center gap-1
              >
                Clarify owner
              </button>
              <button
                onClick={onDismiss}
                className=p-1 text-amber-600/70 hover:text-amber-900 hover:bg-amber-200/40 rounded-full transition-colors cursor-pointer
                title=Dismiss
              >
                <X className=w-3.5 h-3.5 />
              </button>
            </div>
          </motion.div>
        )}

        {(state === 'OPTIONS' || state === 'CONFIRMING') && (
          <motion.div
            key=options
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className=space-y-2.5
          >
            <div className=flex items-center justify-between>
              <div className=flex items-center gap-1.5 font-medium text-[#78350F]>
                <Sparkles className=w-3.5 h-3.5 text-amber-500 fill-amber-400 />
                <span className=font-bold text-[#B45309]>AIRA</span>
                <span className=text-amber-400>·</span>
                <span>Who should own the landing page?</span>
              </div>
              <button
                onClick={onDismiss}
                className=p-1 text-amber-600/70 hover:text-amber-900 hover:bg-amber-200/40 rounded-full transition-colors cursor-pointer
              >
                <X className=w-3.5 h-3.5 />
              </button>
            </div>

            <div className=flex items-center gap-2 pt-0.5>
              {CANDIDATES.map((cand) => {
                const isSelected = selectedCandidate?.id === cand.id;
                return (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectCandidate(cand)}
                    className={\lex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all duration-200 \\}
                  >
                    <span
                      className={\w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white \\}
                    >
                      {cand.name[0]}
                    </span>
                    <span>{cand.name}</span>
                    {isSelected && <Check className=w-3 h-3 text-white ml-0.5 />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {state === 'CONFIRMING' && selectedCandidate && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className=pt-1
                >
                  <button
                    onClick={handleConfirm}
                    className=w-full py-1.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium text-[11.5px] rounded-lg shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer
                  >
                    <span>Confirm assignment</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
;

const gmailBackgroundCode = import React from 'react';
import {
  Menu,
  Search,
  SlidersHorizontal,
  HelpCircle,
  Settings,
  Grid,
  Pencil,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  ChevronDown,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EmailThread {
  id: string;
  sender: string;
  badge?: string;
  badgeColor?: string;
  subject: string;
  time: string;
}

const EMAIL_LIST: EmailThread[] = [
  { id: '1', sender: 'shiwani', badge: 'NEEDS REPLY', badgeColor: 'bg-rose-100 text-rose-700', subject: 'Meet the Plansom team at T-Hub | 17–18 Aug', time: '1:27 PM' },
  { id: '2', sender: 'me, Sahana 9', badge: 'ACTION REQ', badgeColor: 'bg-rose-100 text-rose-700', subject: 'Nova - UX Design Trainee (Graduation Project)', time: '11:27 AM' },
  { id: '3', sender: 'Geetika M (via Goog.)', badge: 'FYI', badgeColor: 'bg-gray-100 text-gray-700', subject: 'Spreadsheet shared with you: Merai testing -', time: '10:38 AM' },
  { id: '4', sender: 'Navatej Kumar', badge: 'NEEDS REPLY', badgeColor: 'bg-rose-100 text-rose-700', subject: 'Fwd: Application from UI/UX design intern - N', time: '10:15 AM' },
  { id: '5', sender: 'T-Hub', badge: 'ACTION REQ', badgeColor: 'bg-rose-100 text-rose-700', subject: 'Gentle Reminder: Submit your project details for', time: '9:45 AM' },
  { id: '6', sender: 'T-Hub', badge: 'ACTION REQ', badgeColor: 'bg-rose-100 text-rose-700', subject: 'Register for upcoming mentor session this Friday', time: '9:20 AM' },
  { id: '7', sender: 'Navatej, venkataraju 3', badge: 'FYI', badgeColor: 'bg-gray-100 text-gray-700', subject: 'Re: Nova redesign approval & component library', time: '8:50 AM' },
  { id: '8', sender: 'Keerthi Reddy', badge: 'FYI', badgeColor: 'bg-gray-100 text-gray-700', subject: 'Checklist for upcoming design review session', time: '8:30 AM' }
];

export const GmailBackground: React.FC = () => {
  return (
    <div className=min-h-screen bg-[#F6F8FC] flex flex-col font-sans select-none overflow-hidden text-[#1F1F1F]>
      <header className=h-16 px-4 flex items-center justify-between bg-[#F6F8FC] border-b border-gray-200/60 shrink-0>
        <div className=flex items-center gap-4 w-60>
          <button className=p-2 hover:bg-gray-200/60 rounded-full transition-colors text-gray-600>
            <Menu className=w-5 h-5 />
          </button>
          <div className=flex items-center gap-2>
            <div className=w-8 h-8 flex items-center justify-center font-bold text-lg tracking-tighter>
              <span className=text-blue-600>G</span>
              <span className=text-red-500>m</span>
              <span className=text-amber-500>a</span>
              <span className=text-blue-600>i</span>
              <span className=text-green-600>l</span>
            </div>
            <span className=text-xl font-medium text-gray-700>Gmail</span>
          </div>
        </div>

        <div className=flex-1 max-w-2xl mx-4>
          <div className=flex items-center gap-3 px-4 py-2.5 bg-[#EAF1FB] focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-300 rounded-full transition-all>
            <Search className=w-5 h-5 text-gray-500 />
            <input
              type=text
              placeholder=Search mail
              className=w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-500
            />
            <SlidersHorizontal className=w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-800 />
          </div>
        </div>

        <div className=flex items-center gap-1.5 text-gray-600>
          <button className=p-2 hover:bg-gray-200/60 rounded-full transition-colors>
            <HelpCircle className=w-5 h-5 />
          </button>
          <button className=p-2 hover:bg-gray-200/60 rounded-full transition-colors>
            <Settings className=w-5 h-5 />
          </button>
          <button className=p-2 hover:bg-gray-200/60 rounded-full transition-colors>
            <Grid className=w-5 h-5 />
          </button>
          <div className=ml-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-sm shadow-2xs cursor-pointer>
            N
          </div>
        </div>
      </header>

      <div className=flex-1 flex overflow-hidden>
        <aside className=w-60 bg-[#F6F8FC] p-3 flex flex-col gap-4 shrink-0>
          <button className=flex items-center gap-3 px-6 py-3.5 bg-[#C2E7FF] hover:bg-[#b0dcff] hover:shadow-md text-[#001D35] rounded-2xl font-medium text-sm transition-all shadow-xs cursor-pointer w-fit>
            <Pencil className=w-5 h-5 />
            <span>Compose</span>
          </button>

          <nav className=space-y-0.5 text-xs text-gray-700 font-medium>
            <div className=flex items-center justify-between px-4 py-2 bg-[#D3E3FD] text-[#041E49] rounded-r-full font-semibold cursor-pointer>
              <div className=flex items-center gap-4>
                <Inbox className=w-4 h-4 text-[#041E49] />
                <span>Inbox</span>
              </div>
              <span className=text-xs font-bold>12</span>
            </div>

            <div className=flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors>
              <Star className=w-4 h-4 text-gray-500 />
              <span>Starred</span>
            </div>

            <div className=flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors>
              <Clock className=w-4 h-4 text-gray-500 />
              <span>Snoozed</span>
            </div>

            <div className=flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors>
              <Send className=w-4 h-4 text-gray-500 />
              <span>Sent</span>
            </div>

            <div className=flex items-center justify-between px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors>
              <div className=flex items-center gap-4>
                <FileText className=w-4 h-4 text-gray-500 />
                <span>Drafts</span>
              </div>
              <span className=text-xs text-gray-500>1</span>
            </div>

            <div className=flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors pt-2>
              <ChevronDown className=w-4 h-4 text-gray-500 />
              <span>More</span>
            </div>
          </nav>
        </aside>

        <main className=flex-1 bg-white rounded-2xl m-2 ml-0 border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col>
          <div className=px-4 py-2.5 border-b border-gray-200/70 flex items-center justify-between text-gray-600 text-xs shrink-0>
            <div className=flex items-center gap-4>
              <input type=checkbox className=rounded border-gray-300 cursor-pointer />
              <button className=hover:bg-gray-100 p-1.5 rounded-full transition-colors>
                <RefreshCw className=w-3.5 h-3.5 />
              </button>
              <button className=hover:bg-gray-100 p-1.5 rounded-full transition-colors>
                <MoreVertical className=w-3.5 h-3.5 />
              </button>
            </div>

            <div className=flex items-center gap-3 text-gray-500>
              <span>1–50 of 379</span>
              <div className=flex items-center gap-1>
                <button className=p-1 hover:bg-gray-100 rounded-full>
                  <ChevronLeft className=w-4 h-4 />
                </button>
                <button className=p-1 hover:bg-gray-100 rounded-full>
                  <ChevronRight className=w-4 h-4 />
                </button>
              </div>
            </div>
          </div>

          <div className=flex-1 overflow-y-auto divide-y divide-gray-100>
            {EMAIL_LIST.map((email) => (
              <div
                key={email.id}
                className=px-4 py-3 flex items-center gap-4 hover:bg-gray-50/80 hover:shadow-2xs cursor-pointer transition-all text-xs group
              >
                <input type=checkbox className=rounded border-gray-300 cursor-pointer opacity-60 group-hover:opacity-100 />
                <Star className=w-4 h-4 text-gray-300 hover:text-amber-400 cursor-pointer shrink-0 />

                <div className=w-44 font-semibold text-gray-900 truncate shrink-0>
                  {email.sender}
                </div>

                {email.badge && (
                  <span className={\px-2 py-0.5 rounded text-[10px] font-bold shrink-0 \\}>
                    {email.badge}
                  </span>
                )}

                <div className=flex-1 text-gray-700 font-medium truncate>
                  {email.subject}
                </div>

                <div className=text-gray-400 text-[11px] font-normal shrink-0>
                  {email.time}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
;

fs.writeFileSync('src/components/AiraNudgeBox.tsx', airaNudgeCode, 'utf8');
fs.writeFileSync('src/components/GmailBackground.tsx', gmailBackgroundCode, 'utf8');
console.log('Files created successfully');
