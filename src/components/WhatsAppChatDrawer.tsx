import React, { useState } from 'react';
import {
  X,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Check,
  Circle,
  Users,
  ShieldCheck,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { ChatConversation, DirectMessage } from '../types/social';
import { WhatsAppInviteModal } from './WhatsAppInviteModal';

interface WhatsAppChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-marcus',
    participant: {
      id: 'user-marcus',
      name: 'Marcus Chen',
      handle: '@marcus_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Principal Architect @ Veloce Labs',
      status: 'online',
      verified: true
    },
    lastMessage: 'Check out slide 2 on the CRDT vector clock compression.',
    lastMessageTime: '12:42 PM',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'user-marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Hey! Did you check out the 14ms latency benchmark on our edge mesh?',
        timestamp: '12:38 PM',
        isSelf: false,
        status: 'read'
      },
      {
        id: 'm2',
        senderId: 'self',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Yes! The memory footprint drop of 34% in slide 1 was unbelievable. Are you deploying to Frankfurt next?',
        timestamp: '12:40 PM',
        isSelf: true,
        status: 'read'
      },
      {
        id: 'm3',
        senderId: 'user-marcus',
        senderName: 'Marcus Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Check out slide 2 on the CRDT vector clock compression.',
        timestamp: '12:42 PM',
        isSelf: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-group-crdt',
    participant: {
      id: 'group-crdt',
      name: 'CRDT & Edge Protocol WG',
      handle: '#group-crdt',
      avatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80',
      role: 'Working Group (24 members)',
      status: 'online'
    },
    isGroup: true,
    lastMessage: 'Elena: RFC-84 is merged for peer-to-peer gossip relays.',
    lastMessageTime: '11:15 AM',
    unreadCount: 3,
    messages: [
      {
        id: 'gm1',
        senderId: 'user-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Elena: RFC-84 is merged for peer-to-peer gossip relays.',
        timestamp: '11:15 AM',
        isSelf: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-elena',
    participant: {
      id: 'user-elena',
      name: 'Elena Rostova',
      handle: '@elena_systems',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'Consensus Engineer',
      status: 'online',
      verified: true
    },
    lastMessage: 'Shared telemetry logs from the Tokyo cluster.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'em1',
        senderId: 'user-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Shared telemetry logs from the Tokyo cluster.',
        timestamp: 'Yesterday',
        isSelf: false,
        status: 'read'
      }
    ]
  }
];

export const WhatsAppChatDrawer: React.FC<WhatsAppChatDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-marcus');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleAddNewContactChat = (newConv: ChatConversation) => {
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallStatus(`Connecting encrypted P2P ${type} call to ${activeConversation.participant.name}...`);
    setTimeout(() => {
      setCallStatus(`Calling ${activeConversation.participant.name} (${activeConversation.participant.status})...`);
    }, 1000);
    setTimeout(() => {
      setCallStatus(null);
    }, 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      status: 'delivered'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: inputText.trim(),
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    setInputText('');

    // Simulated reply after 1.5 seconds for true dynamic social feel
    setTimeout(() => {
      const replyMsg: DirectMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: activeConversation.participant.id,
        senderName: activeConversation.participant.name,
        senderAvatar: activeConversation.participant.avatar,
        text: 'Received! Running the simulation through the edge network right now ⚡️',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
        status: 'delivered'
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              lastMessageTime: 'Just now',
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[88vh] rounded-3xl bg-[#0c0e17] border border-[#737686]/30 shadow-2xl flex overflow-hidden relative">
          
          {/* Left: WhatsApp Style Chat List (Sidebar) */}
          <div className="w-80 sm:w-96 border-r border-[#737686]/20 bg-[#10121d] flex flex-col shrink-0">
            
            {/* Header */}
            <div className="p-4 border-b border-[#737686]/20 flex items-center justify-between bg-[#131625]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img src={currentUser.avatar} alt="You" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#40c2fd]/50" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#10121d]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{currentUser.name}</h3>
                  <span className="text-[10px] text-[#25D366] font-mono flex items-center gap-1 font-bold">
                    WhatsApp Connected
                  </span>
                </div>
              </div>

              {/* WhatsApp Invite Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-[11px] font-bold transition-all shadow-sm"
                  title="Invite WhatsApp Contact directly"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add/Invite</span>
                </button>

                <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 sm:hidden">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="p-3 border-b border-[#737686]/15">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-gray-500 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search chats or phone numbers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#171a2b] border border-[#737686]/25 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#737686]/10">
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#181d30] border-l-4 border-[#25D366]' : 'hover:bg-[#141724]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={conv.participant.avatar} alt={conv.participant.name} className="w-11 h-11 rounded-full object-cover ring-1 ring-white/10" />
                      {conv.participant.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#10121d]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-white truncate">{conv.participant.name}</span>
                          {conv.participant.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#40c2fd] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">{conv.lastMessageTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400 truncate pr-2">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#25D366] text-[#090a10] font-mono text-[10px] font-bold shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active WhatsApp Chat Window */}
          <div className="flex-1 flex flex-col bg-[#0b0d15] relative">
            
            {/* Active Chat Top Bar */}
            <div className="p-3.5 px-5 border-b border-[#737686]/20 bg-[#101320] flex items-center justify-between z-10 shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={activeConversation.participant.avatar} alt={activeConversation.participant.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#101320]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">{activeConversation.participant.name}</h4>
                    {activeConversation.participant.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#40c2fd]" />}
                  </div>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Sengon P2P Lattice Encrypted
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400">
                <button
                  onClick={() => handleStartCall('audio')}
                  className="p-2 rounded-xl hover:text-[#25D366] hover:bg-white/5 transition-colors"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStartCall('video')}
                  className="p-2 rounded-xl hover:text-[#25D366] hover:bg-white/5 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calling Status Overlay banner if triggered */}
            {callStatus && (
              <div className="bg-[#128C7E] text-white px-4 py-2 text-xs flex items-center justify-between font-medium animate-in fade-in duration-200">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 animate-bounce" /> {callStatus}
                </span>
                <button onClick={() => setCallStatus(null)} className="text-[10px] uppercase font-bold underline">End</button>
              </div>
            )}

            {/* Messages Stream (WhatsApp Wallpaper styling) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#0a0c13] relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#25D366_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-full bg-[#131624] border border-[#737686]/20 text-[10px] font-mono text-gray-400">
                  🔒 WhatsApp Bridge Active • End-to-end encrypted room on Sengon
                </span>
              </div>

              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isSelf && (
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover mb-1" />
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm leading-relaxed relative ${
                      msg.isSelf
                        ? 'bg-gradient-to-br from-[#075e54] to-[#128C7E] text-white rounded-br-sm'
                        : 'bg-[#181c2c] text-gray-200 border border-[#737686]/20 rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-300 font-mono">
                      <span>{msg.timestamp}</span>
                      {msg.isSelf && <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#101320] border-t border-[#737686]/20 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-[#25D366] transition-colors"
                title="Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-[#25D366] transition-colors"
                title="Attach Document / Code RFC"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message on Sengon (offline from WhatsApp)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#171a2b] border border-[#737686]/30 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white disabled:opacity-40 hover:scale-105 transition-all shadow-md shadow-[#25D366]/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>
      </div>

      {/* WhatsApp Invite Modal Popup */}
      <WhatsAppInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onAddContactChat={handleAddNewContactChat}
        onNotify={(msg) => alert(msg)}
      />
    </>
  );
};
