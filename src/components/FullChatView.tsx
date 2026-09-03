import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Phone,
  Folder,
  Zap,
  Pin,
  MessageSquare,
  Home,
  AtSign,
  Star,
  Plus,
  Smile,
  Upload,
  Send,
  Sparkles,
  Calendar,
  Lightbulb,
  CheckSquare,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  time: string;
  text: string;
}

const GEETIKA_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'Navatej kumar', time: '12.55pm', text: 'Hey Tushara, can you send me the revised investor deck?' },
  { id: '2', sender: 'Tushara Sree', time: '12.56pm', text: "Yes, I'll update it and share it by EOD." },
  { id: '3', sender: 'Navatej kumar', time: '12.56pm', text: 'Great, thanks!' },
  { id: '4', sender: 'Navatej kumar', time: '12.56pm', text: "Also, let's include the new metrics we discussed." },
  { id: '5', sender: 'Tushara Sree', time: '12.57pm', text: "Sure, I'll update , anything specific you want me to highlight?" },
  { id: '6', sender: 'Navatej kumar', time: '12.57pm', text: 'The updated ARR forecast & customer accquisition tred, Make sure to highlight the Q3 number.' },
  { id: '7', sender: 'Tushara Sree', time: '12.55pm', text: 'Got it. Will do.' },
  { id: '8', sender: 'Navatej kumar', time: '12.55pm', text: "Perfect, let me know once it's ready." }
];

export const FullChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(GEETIKA_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showPurpleAira, setShowPurpleAira] = useState(true);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Tushara Sree',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim()
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!textToSend) setInputText('');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F6F8FC]">
      {/* LEFT NAVIGATION DRAWER FOR CHAT */}
      <aside className="w-56 bg-[#F6F8FC] p-2 pr-3 flex flex-col gap-3 shrink-0">
        {/* New Chat Button */}
        <button className="flex items-center gap-3 px-5 py-3.5 bg-[#C2E7FF] hover:bg-[#b0dcff] hover:shadow-md text-[#001D35] rounded-2xl font-medium text-sm transition-all shadow-xs cursor-pointer w-fit my-1">
          <MessageSquare className="w-5 h-5 text-[#001D35]" />
          <span>New Chat</span>
        </button>

        <nav className="space-y-3 text-xs text-gray-700 font-medium">
          {/* Shortcuts */}
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-gray-800 font-bold cursor-pointer">
              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              <span>Shortcuts</span>
            </div>
            <div className="pl-4 space-y-0.5 mt-0.5">
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700">
                <Home className="w-4 h-4 text-gray-600" />
                <span>Home</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700">
                <AtSign className="w-4 h-4 text-gray-600" />
                <span>Mentions</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700">
                <Star className="w-4 h-4 text-gray-600" />
                <span>Starred</span>
              </div>
            </div>
          </div>

          {/* Direct messages */}
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-gray-800 font-bold cursor-pointer">
              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              <span>Direct messages</span>
            </div>
            <div className="pl-4 space-y-0.5 mt-0.5">
              {/* Geetika M (Active) */}
              <div className="flex items-center gap-3 px-3 py-2 bg-[#D3E3FD] text-[#041E49] rounded-r-full font-bold cursor-pointer">
                <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />
                <span>Geetika M</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700">
                <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />
                <span>Navatej Kumar</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200/60 rounded-r-full cursor-pointer text-gray-700">
                <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />
                <span>Sathvika</span>
              </div>
            </div>
          </div>

          {/* Spaces */}
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-gray-800 font-bold cursor-pointer">
              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              <span>Spaces</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* CHAT MAIN CONTENT AREA */}
      <main className="flex-1 bg-white rounded-2xl mb-2 mr-2 border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col">
        {/* Chat Thread Header */}
        <div className="px-5 py-3 border-b border-gray-200/70 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-lg cursor-pointer">
              <span>Geetika M</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600 ml-1">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600">
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          </div>

          {/* Right side Action Group Pill - Matching Figma Specs (141px x 36px, 1px gap, rounded-full) */}
          <div className="w-[141px] h-[36px] px-1 bg-[#E2E7EC] rounded-full flex items-center justify-between gap-[1px] text-gray-700 shrink-0">
            <button className="p-1.5 hover:bg-gray-300/60 rounded-full transition-colors cursor-pointer" title="Call">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-300/60 rounded-full transition-colors cursor-pointer" title="Folder">
              <Folder className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-300/60 rounded-full transition-colors cursor-pointer" title="Zap">
              <Zap className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-300/60 rounded-full transition-colors cursor-pointer" title="Pin">
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Thread Messages Stream - Matching Figma Specs (max-w-[665px], 20px gap, no scrollbar) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-[20px] max-w-[665px] bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-xs">{msg.sender}</span>
                  <span className="text-[11px] text-gray-500 font-normal">{msg.time}</span>
                </div>
                <div className="bg-[#F0F4F9] text-gray-800 px-3.5 py-2 rounded-2xl w-fit max-w-xl text-xs leading-relaxed font-normal">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Quick Smart Reply Pills */}
          <div className="flex items-center gap-2 pt-2 pl-11">
            <button
              onClick={() => handleSendMessage('Yes, I can.')}
              className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-all shadow-2xs"
            >
              Yes, I can.
            </button>
            <button
              onClick={() => handleSendMessage('Yes')}
              className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-all shadow-2xs"
            >
              Yes
            </button>
            <button
              onClick={() => handleSendMessage('Working on it.')}
              className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-all shadow-2xs"
            >
              Working on it.
            </button>
          </div>

          {/* AIRA SUGGESTED DRAFT CARD - Matching Figma Specs */}
          {showPurpleAira && (
            <div className="mt-4 ml-11 max-w-[665px] p-4 bg-[#F9F0FF] border border-[#E7D0FF] rounded-[20px] text-xs shadow-2xs">
              {/* Header */}
              <div className="flex items-center gap-1.5 text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-[#7C3AED] text-[#7C3AED]" />
                <span className="font-bold text-[#7C3AED]">AIRA</span>
                <span className="text-gray-500 font-normal">· Suggested draft</span>
              </div>

              {/* Quote box */}
              <div className="bg-white rounded-xl p-3 my-2.5 border border-purple-100/80 text-xs text-gray-800 font-normal leading-relaxed">
                "Hi Navatej, quick follow-up on the revised investor deck. I'll include the updated metrics (ARR forecast and customer acquisition trend) and share it shortly."
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => {
                    setInputText("Hi Navatej, quick follow-up on the revised investor deck. I'll include the updated metrics (ARR forecast and customer acquisition trend) and share it shortly.");
                    setShowPurpleAira(false);
                  }}
                  className="px-4 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-full text-xs cursor-pointer transition-all shadow-2xs"
                >
                  Insert into composer
                </button>
                <button
                  onClick={() => setShowPurpleAira(false)}
                  className="text-gray-600 hover:text-gray-900 font-medium text-xs cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CHAT INPUT BAR - Matching Figma Pixel Reference */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="w-full max-w-[898px] h-[75px] px-4 bg-white border-t border-gray-100/60 flex items-center gap-[16px] shrink-0"
        >
          {/* Vertical Pill Plus Button */}
          <button
            type="button"
            className="w-[36px] h-[52px] rounded-full bg-[#D3E3FD] text-[#001D35] flex items-center justify-center hover:bg-[#c2d7f8] transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Main Input Capsule */}
          <div className="flex-1 h-[52px] bg-[#EEF2FA] rounded-[24px] px-5 flex items-center justify-between gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="History is on"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-600 font-normal focus:outline-none"
            />

            {/* Inner action icons */}
            <div className="flex items-center gap-4 text-gray-600 shrink-0">
              <button type="button" className="hover:text-gray-900 cursor-pointer" title="Formatting">
                <span className="font-semibold text-base text-gray-700 underline decoration-2 underline-offset-2">A</span>
              </button>
              <button type="button" className="hover:text-gray-900 cursor-pointer" title="Emoji">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <button type="button" className="hover:text-gray-900 cursor-pointer" title="GIF">
                <span className="border-2 border-gray-600 text-gray-700 font-bold text-[10px] px-1 py-0.2 rounded-md">GIF</span>
              </button>
              <button type="button" className="hover:text-gray-900 cursor-pointer" title="Upload">
                <Upload className="w-5 h-5 text-gray-600" />
              </button>
              <button type="button" className="hover:text-gray-900 cursor-pointer" title="Record">
                <span className="w-4 h-4 rounded-full border-2 border-gray-600 block" />
              </button>
            </div>
          </div>

          {/* Right Split Send Button Container */}
          <div className="flex items-center h-[52px] border border-[#747775]/50 rounded-[20px] bg-[#F3F3F3] overflow-hidden shrink-0">
            <button
              type="button"
              className="w-[38px] h-full flex items-center justify-center hover:bg-gray-200/80 border-r border-[#747775]/40 text-gray-700 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 fill-gray-700 text-gray-700" />
            </button>
            <button
              type="submit"
              className="w-[52px] h-full flex items-center justify-center hover:bg-gray-200/80 text-gray-400 cursor-pointer"
            >
              <Send className="w-5 h-5 text-gray-400 -rotate-12" />
            </button>
          </div>
        </form>
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
    </div>
  );
};
