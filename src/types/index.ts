export interface ChatHistory {
  [x: string]: never[];
  id: string;
  title: string;
  timestamp: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: string;
}