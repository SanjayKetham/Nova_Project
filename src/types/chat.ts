export type AiraNudgeState = 'UNCLEAR' | 'OPTIONS' | 'CONFIRMING' | 'CONFIRMED' | 'DISMISSED';

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  avatarBg: string;
  text: string;
  time: string;
  isSystemAction?: boolean;
}

export interface CandidateOption {
  id: string;
  name: string;
  avatarBg: string;
  color: string;
}
