import React, { useState } from 'react';
import {
  Menu,
  Search,
  SlidersHorizontal,
  HelpCircle,
  Sun,
  LayoutGrid,
  Pencil,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  Mail,
  MessageSquare,
  Video,
  Calendar,
  Lightbulb,
  CheckSquare,
  User,
  Plus
} from 'lucide-react';
import { FullChatView } from './FullChatView';
import { ChatPopUpWidget } from './ChatPopUpWidget';
import { EmailDetailView } from './EmailDetailView';

interface EmailThread {
  id: string;
  sender: string;
  badge: 'NEEDS REPLY' | 'ACTION REQ' | 'FYI';
  subject: string;
  time: string;
  unread?: boolean;
}

const EMAIL_LIST: EmailThread[] = [
  { id: '0', sender: 'Navatej Kumar', badge: 'NEEDS REPLY', subject: 'Updated needed on Gmail feedback', time: '11:38 AM', unread: true },
  { id: '1', sender: 'shiwani', badge: 'NEEDS REPLY', subject: 'Meet the Plansom team at T-Hub | 17–18 Aug', time: '1:27 PM', unread: true },
  { id: '2', sender: 'me, Sahana 9', badge: 'ACTION REQ', subject: 'Nova – UX Design Trainee (Graduation Project Review)', time: '11:27 AM', unread: true },
  { id: '3', sender: 'Geetika M (via Goog.)', badge: 'FYI', subject: 'Spreadsheet shared with you: "Merai tesing" – Q3 Budgeting', time: '10:38 AM', unread: false },
  { id: '4', sender: 'Navatej Kumar', badge: 'NEEDS REPLY', subject: 'Fwd: Application fro UI/UX design intern – Naresh V', time: '10:15 AM', unread: true },
  { id: '5', sender: 'T-Hub', badge: 'ACTION REQ', subject: 'Gentle Reminder: Submit your project details for Demo Day', time: '9:45 AM', unread: true },
  { id: '6', sender: 'T-Hub', badge: 'ACTION REQ', subject: 'Register for upcoming mentor session this Friday with VCs', time: '9:20 AM', unread: true },
  { id: '7', sender: 'Navatej, venkataraju 3', badge: 'FYI', subject: 'Re: Nova redesign approval & component library tokens', time: '8:50 AM', unread: false },
  { id: '8', sender: 'Keerthi Reddy', badge: 'FYI', subject: 'Checklist for upcoming design review session with leadership', time: '8:30 AM', unread: false },
  { id: '9', sender: 'Keerthi Reddy (via .)', badge: 'FYI', subject: 'Document shared with you: "Nova Design Specs v2.4"', time: '8:15 AM', unread: false },
  { id: '10', sender: 'Thanmay .. koushik 5', badge: 'FYI', subject: 'Request for feedback on landing page wireframes & flow', time: '8:00 AM', unread: false },
  { id: '11', sender: 'Navatej Kumar (via .)', badge: 'FYI', subject: 'Spreadsheet shared with you: "Project Sprint Roadmap 2026"', time: '7:45 AM', unread: false },
  { id: '12', sender: 'Figma Notifications', badge: 'FYI', subject: 'Sahana commented on "NOVA Front-End Engineering TASK"', time: 'Yesterday', unread: false },
  { id: '13', sender: 'Google Cloud Team', badge: 'ACTION REQ', subject: 'Action Required: Verify production GCP service quotas', time: 'Aug 15', unread: false },
  { id: '14', sender: 'GitHub Notifications', badge: 'NEEDS REPLY', subject: '[nova-app] PR #42 merged: Feature/aira-nudge-widget', time: 'Aug 14', unread: false },
  { id: '15', sender: 'Slack Weekly Digest', badge: 'FYI', subject: 'Weekly summary from #engineering-general and #design-system', time: 'Aug 14', unread: false },
  { id: '16', sender: 'Ananya Sharma', badge: 'NEEDS REPLY', subject: 'Re: Design Handoff & Asset Exports for iOS/Android', time: 'Aug 13', unread: false },
  { id: '17', sender: 'Vercel Deployments', badge: 'FYI', subject: 'Deployment successful: nova-frontend-app.vercel.app', time: 'Aug 12', unread: false }
];

const GmailLogo = () => (
  <div className="w-[112.28px] h-[32px] flex items-center gap-2 select-none shrink-0">
    <svg className="w-8 h-6 shrink-0" viewBox="0 0 24 19" fill="none">
      <path d="M1.5 16.5V4.5C1.5 3.4 2.4 2.5 3.5 2.5H6.5V10.5L12 14.5L17.5 10.5V2.5H20.5C21.6 2.5 22.5 3.4 22.5 4.5V16.5C22.5 17.6 21.6 18.5 20.5 18.5H17.5V11.5L12 15.5L6.5 11.5V18.5H3.5C2.4 18.5 1.5 17.6 1.5 16.5Z" fill="#4285F4"/>
      <path d="M17.5 2.5L12 6.5L6.5 2.5H3.5C2.4 2.5 1.5 3.4 1.5 4.5V5.5L12 13.5L22.5 5.5V4.5C22.5 3.4 21.6 2.5 20.5 2.5H17.5Z" fill="#EA4335"/>
      <path d="M1.5 5.5V16.5C1.5 17.6 2.4 18.5 3.5 18.5H6.5V10.5L1.5 6.5V5.5Z" fill="#FBBC04"/>
      <path d="M17.5 10.5V18.5H20.5C21.6 18.5 22.5 17.6 22.5 16.5V5.5L17.5 9.5V10.5Z" fill="#34A853"/>
    </svg>
    <span className="text-[22px] font-normal text-[#444746] font-sans tracking-tight leading-none">Gmail</span>
  </div>
);

export const GmailBackground: React.FC = () => {
  const [activeApp, setActiveApp] = useState<'Mail' | 'Chat' | 'Meet'>('Mail');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen bg-[#F6F8FC] flex flex-col font-sans select-none overflow-hidden text-[#1F1F1F]">
      {/* TOP HEADER BAR */}
      <header className="h-14 px-4 flex items-center justify-between bg-[#F6F8FC] shrink-0 gap-4">
        {/* Left side menu & logo */}
        <div className="flex items-center gap-4 w-56 shrink-0">
          <button className="p-2 hover:bg-gray-200/70 rounded-full transition-colors text-gray-600 cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <GmailLogo />
        </div>

        {/* Center Search Bar - Matching Figma Specs (763px x 48px, rounded 24px, bg #EAF1FB) */}
        <div className="w-[763px] h-[48px] px-4 bg-[#EAF1FB] focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-300 rounded-[24px] flex items-center gap-3 transition-all shrink-0">
          <Search className="w-5 h-5 text-gray-600 shrink-0" />
          <input
            type="text"
            placeholder="Search mail"
            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-500 font-normal"
          />
          <button className="p-1 hover:bg-gray-200/50 rounded-full text-gray-600 shrink-0 cursor-pointer" title="Search options">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Right side controls - Matching Figma Specs (280.2px width, 40px height, 4px right padding) */}
        <div className="w-[280.2px] h-[40px] pr-[4px] flex items-center justify-end gap-2.5 text-gray-600 shrink-0">
          {/* Active status pill with green dot & schedule icon */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300/90 rounded-full cursor-pointer hover:bg-gray-50 transition-all text-xs text-gray-700 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] shrink-0" />
            {/* Schedule / Status window icon */}
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-0.5" />
          </div>

          {/* Help circle icon */}
          <button className="p-2 hover:bg-gray-200/70 rounded-full transition-colors cursor-pointer" title="Help">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Theme sun icon */}
          <button className="p-2 hover:bg-gray-200/70 rounded-full transition-colors cursor-pointer" title="Theme">
            <Sun className="w-5 h-5 text-gray-600" />
          </button>

          {/* Four-box (2x2) Grid icon */}
          <button className="p-2 hover:bg-gray-200/70 rounded-full transition-colors cursor-pointer" title="Google apps">
            <LayoutGrid className="w-5 h-5 text-gray-600" />
          </button>

          {/* User profile capsule: 'nova N' */}
          <div className="flex items-center gap-2 pl-3 pr-1 py-1 border border-gray-300/90 rounded-full bg-white text-xs text-gray-700 font-medium cursor-pointer hover:bg-gray-50 shadow-2xs transition-all">
            <span>nova</span>
            <div className="w-7 h-7 rounded-full bg-[#5C6BC0] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              N
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* FAR LEFT APP SWITCHER SIDEBAR - Matching Figma Specs (75px width, 0.8px border #E8EAED, 6px top padding, 2px gap) */}
        <aside className="w-[75px] bg-[#F6F8FC] pt-[6px] pb-3 flex flex-col items-center gap-[2px] shrink-0 text-gray-600 text-[11px] font-medium border-r border-[#E8EAED]">
          {/* Mail app */}
          <button
            onClick={() => setActiveApp('Mail')}
            className="flex flex-col items-center gap-0.5 group cursor-pointer w-full py-1"
          >
            <div className={`w-[52px] h-[32px] rounded-full flex items-center justify-center transition-all ${
              activeApp === 'Mail' ? 'bg-[#C2E7FF] text-[#001D35]' : 'hover:bg-gray-200/60 text-gray-600'
            }`}>
              <Mail className="w-5 h-5" />
            </div>
            <span className={activeApp === 'Mail' ? 'text-[#001D35] font-semibold' : 'text-gray-600'}>Mail</span>
          </button>

          {/* Chat app */}
          <button
            onClick={() => setActiveApp('Chat')}
            className="flex flex-col items-center gap-0.5 group cursor-pointer w-full py-1"
          >
            <div className={`w-[52px] h-[32px] rounded-full flex items-center justify-center transition-all ${
              activeApp === 'Chat' ? 'bg-[#C2E7FF] text-[#001D35]' : 'hover:bg-gray-200/60 text-gray-600'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className={activeApp === 'Chat' ? 'text-[#001D35] font-semibold' : 'text-gray-600'}>Chat</span>
          </button>

          {/* Meet app */}
          <button
            onClick={() => setActiveApp('Meet')}
            className="flex flex-col items-center gap-0.5 group cursor-pointer w-full py-1"
          >
            <div className={`w-[52px] h-[32px] rounded-full flex items-center justify-center transition-all ${
              activeApp === 'Meet' ? 'bg-[#C2E7FF] text-[#001D35]' : 'hover:bg-gray-200/60 text-gray-600'
            }`}>
              <Video className="w-5 h-5" />
            </div>
            <span className={activeApp === 'Meet' ? 'text-[#001D35] font-semibold' : 'text-gray-600'}>Meet</span>
          </button>
        </aside>

        {activeApp === 'Chat' ? (
          <FullChatView />
        ) : (
          <>
            {/* LEFT NAVIGATION DRAWER */}
            <aside className="w-56 bg-[#F6F8FC] p-2 pr-3 flex flex-col gap-3 shrink-0">
              {/* Compose button */}
              <button className="flex items-center gap-3 px-5 py-3.5 bg-[#C2E7FF] hover:bg-[#b0dcff] hover:shadow-md text-[#001D35] rounded-2xl font-medium text-sm transition-all shadow-xs cursor-pointer w-fit my-1">
                <Pencil className="w-5 h-5 text-[#001D35]" />
                <span>Compose</span>
              </button>

          {/* Nav links */}
          <nav className="space-y-0.5 text-xs text-gray-700 font-medium">
            <div className="flex items-center justify-between px-4 py-2 bg-[#D3E3FD] text-[#041E49] rounded-r-full font-bold cursor-pointer">
              <div className="flex items-center gap-4">
                <Inbox className="w-4 h-4 text-[#041E49]" />
                <span>Inbox</span>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors">
              <Star className="w-4 h-4 text-gray-500" />
              <span>Starred</span>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Snoozed</span>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors">
              <Send className="w-4 h-4 text-gray-500" />
              <span>Sent</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors">
              <div className="flex items-center gap-4">
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Drafts</span>
              </div>
              <span className="text-xs font-semibold text-gray-600">1</span>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors pt-1">
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              <span>Categories</span>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700 transition-colors">
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              <span>More</span>
            </div>
          </nav>

          {/* Labels section */}
          <div className="mt-4 px-4 flex items-center justify-between text-xs text-gray-600 font-medium">
            <span>Labels</span>
            <button className="p-1 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </aside>

        {/* EMAIL CONTAINER */}
        <main className="flex-1 bg-white rounded-2xl mb-2 mr-2 border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col">
          {selectedEmailId !== null ? (
            <EmailDetailView
              onBack={() => setSelectedEmailId(null)}
              onSendFollowUp={() => {
                setActiveApp('Chat');
                setSelectedEmailId(null);
              }}
            />
          ) : (
            <>
              {/* Action Toolbar */}
              <div className="px-4 py-2 border-b border-gray-200/70 flex items-center justify-between text-gray-600 text-xs shrink-0 bg-white">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="rounded border-gray-300 cursor-pointer accent-blue-600" />
                  <button className="hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer">
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button className="hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button className="hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer">
                    <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-gray-500 text-xs">
                  <span>1-50 of 379</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Rows - Hidden Scrollbar */}
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-100">
                {EMAIL_LIST.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmailId(email.id)}
                    className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50/90 hover:shadow-2xs cursor-pointer transition-all text-xs group"
                  >
                    <input type="checkbox" onClick={(e) => e.stopPropagation()} className="rounded border-gray-300 cursor-pointer opacity-50 group-hover:opacity-100 accent-blue-600" />
                    <Star className="w-4 h-4 text-gray-300 hover:text-amber-400 cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()} />

                    {/* Sender Name */}
                    <div className={`w-44 font-medium truncate shrink-0 ${email.unread ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                      {email.sender}
                    </div>

                    {/* Status Badge with Dot */}
                    <div className="w-32 shrink-0 flex items-center">
                      {email.badge === 'NEEDS REPLY' && (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 uppercase tracking-tight">
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                          NEEDS REPLY
                        </span>
                      )}
                      {email.badge === 'ACTION REQ' && (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 uppercase tracking-tight">
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                          ACTION REQ
                        </span>
                      )}
                      {email.badge === 'FYI' && (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-tight">
                          <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                          FYI
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div className={`flex-1 truncate ${email.unread ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                      {email.subject}
                    </div>

                    {/* Date / Time */}
                    <div className={`text-[11px] shrink-0 ${email.unread ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                      {email.time}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* RIGHTSIDE APP BAR - Matching Figma Specs (40px x 205px, rounded-[20px]) */}
        <aside className="w-[40px] h-[205px] bg-[#F6F8FC] py-3 my-2 mr-2 flex flex-col items-center justify-between shrink-0 text-gray-600 rounded-[20px]">
          <button className="p-1.5 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer text-red-500" title="Calendar">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer text-amber-500" title="Keep">
            <Lightbulb className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer text-blue-600" title="Tasks">
            <CheckSquare className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer text-blue-500" title="Contacts">
            <User className="w-4 h-4" />
          </button>
        </aside>
            {selectedEmailId === null && <ChatPopUpWidget />}
          </>
        )}
      </div>
    </div>
  );
};

