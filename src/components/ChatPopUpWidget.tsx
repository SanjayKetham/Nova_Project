import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MoreVertical,
  Plus,
  Smile,
  Pencil,
  Send,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Upload
} from 'lucide-react';
import { AiraNudgeBox } from './AiraNudgeBox';
import type { ChatMessage } from '../types/chat';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '0',
    sender: 'Dinesh Patel',
    avatar: 'DP',
    avatarBg: 'bg-[#C0392B]',
    text: 'I thought you were doing it?',
    time: '9:03 AM'
  },
  {
    id: '1',
    sender: 'Dinesh Patel',
    avatar: 'DP',
    avatarBg: 'bg-[#C0392B]',
    text: 'Oh okay, no worries.',
    time: '9:03 AM'
  },
  {
    id: '2',
    sender: 'Sathvika Rao',
    avatar: 'SR',
    avatarBg: 'bg-[#D97706]',
    text: 'I can do it as well.',
    time: '9:04 AM'
  },
  {
    id: '3',
    sender: 'Navatej Kumar',
    avatar: 'NK',
    avatarBg: 'bg-[#2563EB]',
    text: 'Either of you is fine.',
    time: '9:05 AM'
  }
];

export const ChatPopUpWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showAiraNudge, setShowAiraNudge] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 36;
    }
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: 'ME',
      avatarBg: 'bg-emerald-600',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleConfirmAssignment = (ownerName: string) => {
    const systemMessage: ChatMessage = {
      id: 'assignment-' + Date.now(),
      sender: 'AIRA Assistant',
      avatar: '★',
      avatarBg: 'bg-amber-500',
      text: `${ownerName} is assigned to the landing page.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemAction: true
    };

    setMessages((prev) => [...prev, systemMessage]);
    setShowAiraNudge(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed bottom-4 right-16 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden font-sans text-gray-900 select-none w-[345px] h-[375px]"
    >
      {/* CHAT POP-UP HEADER */}
      <div className="px-3.5 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between shadow-2xs shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1 font-bold text-gray-900 text-xs tracking-tight cursor-pointer">
              <span>Marketing Campaign</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <p className="text-[11px] text-gray-500 font-normal leading-none mt-0.5">
              12 members
            </p>
          </div>
        </div>

        {/* Header Icons: ONLY Search & More options */}
        <div className="flex items-center gap-1 text-gray-500">
          <button className="p-1.5 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" title="Search">
            <Search className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" title="More options">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CHAT BODY CONTENT WITH HIDDEN SCROLLBAR & PRE-SCROLLED POSITION */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-3 space-y-2.5 bg-white"
      >
        {messages.map((msg) => {
          if (msg.isSystemAction) {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="my-2 p-2 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-[11px] font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{msg.text}</span>
              </motion.div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2 text-xs">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${msg.avatarBg} shadow-2xs mt-0.5`}
              >
                {msg.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-gray-800 text-[11.5px]">{msg.sender}</span>
                  <span className="text-[10px] text-gray-400 font-normal">{msg.time}</span>
                </div>
                <p className="text-gray-700 text-[11.5px] leading-snug mt-0.5 font-normal">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {showAiraNudge && (
          <AiraNudgeBox
            onConfirmAssignment={handleConfirmAssignment}
            onDismiss={() => setShowAiraNudge(false)}
          />
        )}
      </div>

      {/* INPUT FORM AREA */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-gray-100 shrink-0">
        <div className="bg-white border border-gray-300/80 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-2xs">
          {/* Blue plus icon */}
          <button type="button" className="text-blue-600 hover:text-blue-700 p-0.5 cursor-pointer shrink-0">
            <Plus className="w-4 h-4 text-blue-600" />
          </button>

          {/* Input with 'History is on' placeholder */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="History is on"
            className="flex-1 min-w-0 bg-transparent text-xs text-gray-800 placeholder-gray-400 font-normal focus:outline-none py-0.5"
          />

          {/* Action icons on right */}
          <div className="flex items-center gap-2 text-gray-500 shrink-0">
            <button type="button" className="p-0.5 hover:text-gray-700 transition-colors cursor-pointer" title="Formatting">
              <span className="font-bold text-xs font-sans text-gray-600">Tt</span>
            </button>
            <button type="button" className="p-0.5 hover:text-gray-700 transition-colors cursor-pointer" title="Emoji">
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
            <button type="button" className="p-0.5 hover:text-gray-700 transition-colors cursor-pointer" title="Edit">
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button type="button" className="p-0.5 hover:text-gray-700 transition-colors cursor-pointer" title="Upload">
              <Upload className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="submit"
              className="p-0.5 text-blue-600 hover:text-blue-700 transition-all cursor-pointer"
              title="Send"
            >
              <Send className="w-4 h-4 fill-blue-600 text-blue-600" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
