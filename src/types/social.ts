export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  isAdmin?: boolean;
  verified?: boolean;
  verifiedLabel?: string;
  bio?: string;
  status?: 'online' | 'offline' | 'busy';
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup?: boolean;
  messages: DirectMessage[];
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  messagesSent: number;
  activeSessions: number;
  serverUptime: string;
  systemLoad: string;
}

