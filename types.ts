
export type PageView = 'landing' | 'about' | 'blog' | 'learn' | 'dashboard' | 'admin' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface BlogPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Report {
  id: string;
  userId?: string;
  isAnonymous: boolean;
  name?: string;
  contact?: string;
  type: string;
  description: string;
  date: string;
  location?: { lat: number; lng: number };
  submittedAt: string;
  status: 'received' | 'reviewing' | 'action_taken' | 'resolved';
  adminResponse?: string;
  accessCode?: string; // Used for guest tracking
}

export interface DonationRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'funded' | 'rejected';
  timestamp: string;
}