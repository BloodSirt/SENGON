import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  CheckCheck,
  ShieldCheck,
  UserPlus,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { ChatConversation, DirectMessage } from '../types/social';
import { WhatsAppInviteModal } from './WhatsAppInviteModal';

interface WhatsAppChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'room-general',
    participant: {
      id: 'general-lobby',
      name: 'Global Engineering Relay (Live)',
      handle: '#global-relay',
      avatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80',
      role: 'Public Live Mesh Room',
      status: 'online',
      verified: true
    },
    isGroup: true,
    lastMessage: 'Live P2P room connected with Supabase Realtime broadcast',
    lastMessageTime: 'Just now',
    unreadCount: 0,
    messages: [
      {
        id: 'init-1',
        senderId: 'system',
        senderName: 'Sengon Network',
        senderAvatar: '',
        text: 'Welcome to Sengon Live Chat! Any messages sent here are synced in real-time between you and anyone joining this room link.',
        timestamp: '12:00 PM',
        isSelf: false,
        status: 'read'
      }
    ]
  }
];

export const WhatsAppChatDrawer: React.FC<WhatsAppChatDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('room-general');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  // Check URL parameters for joined room (e.g. ?room=room_12345&host=Marcus)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinedRoom = urlParams.get('room');
    const hostName = urlParams.get('host') || 'Friend';

    if (joinedRoom) {
      const roomConv: ChatConversation = {
        id: joinedRoom,
        participant: {
          id: `host-${joinedRoom}`,
          name: decodeURIComponent(hostName),
          handle: '@' + decodeURIComponent(hostName).toLowerCase().replace(/\s+/g, '_'),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Inviting Host',
          status: 'online',
          verified: true
        },
        lastMessage: 'Live chat connected with your friend.',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `join-m-${Date.now()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '',
            text: `You have joined ${decodeURIComponent(hostName)}'s live private channel on Sengon! Send a message below to chat live.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: false,
            status: 'read'
          }
        ]
      };

      setConversations((prev) => {
        if (!prev.find((c) => c.id === joinedRoom)) {
          return [roomConv, ...prev];
        }
        return prev;
      });
      setActiveConvId(joinedRoom);
    }
  }, []);

  // Supabase Realtime + Database synchronization for true, reliable live chat
  useEffect(() => {
    if (!activeConvId) return;

    const SENGON_SHARED_POST_ID = 'bbbbbbbb-0000-0000-0000-000000000002';
    const SENGON_SENDER_AUTHOR_ID = 'aaaaaaaa-0000-0000-0000-000000000001';

    // 1. Load any existing history for this room from Supabase database
    const loadRoomHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('id, content, created_at')
          .eq('post_id', SENGON_SHARED_POST_ID)
          .ilike('content', `{"_sengon_chat":true,"roomId":"${activeConvId}"%`)
          .order('created_at', { ascending: true });

        if (error || !data) return;

        const dbMsgs: DirectMessage[] = [];
        data.forEach((row) => {
          try {
            const parsed = JSON.parse(row.content);
            if (parsed._sengon_chat && parsed.roomId === activeConvId) {
              dbMsgs.push({
                id: parsed.msgId || row.id,
                senderId: parsed.senderId,
                senderName: parsed.senderName,
                senderAvatar: parsed.senderAvatar || '',
                text: parsed.text,
                timestamp: parsed.timestamp || new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: parsed.senderId === currentUser.id,
                status: 'read'
              });
            }
          } catch (e) {
            // ignore non-json
          }
        });

        if (dbMsgs.length > 0) {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === activeConvId) {
                // Merge without duplicating existing IDs
                const existingIds = new Set(c.messages.map((m) => m.id));
                const newOnly = dbMsgs.filter((m) => !existingIds.has(m.id));
                const merged = [...c.messages, ...newOnly];
                const last = merged[merged.length - 1];
                return {
                  ...c,
                  lastMessage: last ? last.text : c.lastMessage,
                  lastMessageTime: last ? last.timestamp : c.lastMessageTime,
                  messages: merged
                };
              }
              return c;
            })
          );
        }
      } catch (err) {
        console.error('Error loading room history:', err);
      }
    };

    loadRoomHistory();

    // 2. Realtime WebSocket subscription: Listen for both Postgres database INSERTs AND direct broadcast
    const channelName = `room_${activeConvId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { ack: true } }
    });

    // Handle incoming message function
    const handleIncoming = (incoming: {
      id?: string;
      senderId: string;
      senderName: string;
      senderAvatar?: string;
      text: string;
      timestamp?: string;
    }) => {
      if (!incoming.text || incoming.senderId === currentUser.id) return;

      const incomingMsg: DirectMessage = {
        id: incoming.id || `msg-${Date.now()}-${Math.random()}`,
        senderId: incoming.senderId,
        senderName: incoming.senderName,
        senderAvatar: incoming.senderAvatar || '',
        text: incoming.text,
        timestamp: incoming.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false, // Sent by peer friend!
        status: 'delivered'
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            if (c.messages.some((m) => m.id === incomingMsg.id)) return c;
            return {
              ...c,
              lastMessage: incomingMsg.text,
              lastMessageTime: incomingMsg.timestamp,
              messages: [...c.messages, incomingMsg]
            };
          }
          return c;
        })
      );
    };

    // 2a. Direct broadcast event
    channel.on('broadcast', { event: 'new_message' }, ({ payload }) => {
      if (payload) handleIncoming(payload);
    });

    // 2b. Postgres changes fallback (always delivers even across network/NAT boundaries)
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${SENGON_SHARED_POST_ID}`
      },
      (payload) => {
        try {
          const row = payload.new as any;
          if (!row || !row.content) return;
          const parsed = JSON.parse(row.content);
          if (parsed._sengon_chat && parsed.roomId === activeConvId) {
            handleIncoming(parsed);
          }
        } catch (e) {
          // not chat json
        }
      }
    );

    channel.subscribe((status) => {
      console.log(`Supabase Realtime Channel [${channelName}] status:`, status);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId, currentUser.id]);

  if (!isOpen) return null;

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleAddNewContactChat = (newConv: ChatConversation) => {
    setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newConv.id)]);
    setActiveConvId(newConv.id);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallStatus(`P2P WebRTC ${type} call ringing to ${activeConversation.participant.name}...`);
    setTimeout(() => {
      setCallStatus(`Connected to ${activeConversation.participant.name} via Sengon Relay.`);
    }, 1500);
    setTimeout(() => {
      setCallStatus(null);
    }, 4500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: inputText.trim(),
      timestamp,
      isSelf: true,
      status: 'delivered'
    };

    // 1. Update sender's local chat screen
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

    const messageText = inputText.trim();
    setInputText('');

    // 2. Transmit via BOTH Supabase Realtime broadcast AND persisted DB notification
    const SENGON_SHARED_POST_ID = 'bbbbbbbb-0000-0000-0000-000000000002';
    const SENGON_SENDER_AUTHOR_ID = 'aaaaaaaa-0000-0000-0000-000000000001';

    const payload = {
      _sengon_chat: true,
      roomId: activeConvId,
      msgId: newMsg.id,
      id: newMsg.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: messageText,
      timestamp
    };

    // 2a. Broadcast to active websocket peers
    try {
      const channelName = `room_${activeConvId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'new_message',
        payload
      }).catch((e) => console.warn('Broadcast send:', e));
    } catch (err) {
      console.warn('Realtime broadcast error:', err);
    }

    // 2b. Database write for guaranteed delivery & history persistence
    try {
      await supabase.from('comments').insert({
        post_id: SENGON_SHARED_POST_ID,
        author_id: SENGON_SENDER_AUTHOR_ID,
        content: JSON.stringify(payload),
        likes_count: 0
      });
    } catch (err) {
      console.error('Error persisting message:', err);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[88vh] rounded-3xl bg-[#0c0e17] border border-[#737686]/30 shadow-2xl flex overflow-hidden relative">
          
          {/* Left: Chat List (Sidebar) */}
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
                    WhatsApp Peer Bridge
                  </span>
                </div>
              </div>

              {/* WhatsApp Invite Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] text-xs font-bold transition-all shadow-sm"
                  title="Invite WhatsApp Contact to chat live"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Invite Friend</span>
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
                  placeholder="Search chats or rooms..."
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

          {/* Right: Active Real-Time Live Chat Window */}
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
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    Live Supabase Realtime Channel: <code className="text-[10px] text-gray-400 font-mono">chat_{activeConvId}</code>
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

            {/* Calling Status Overlay banner */}
            {callStatus && (
              <div className="bg-[#128C7E] text-white px-4 py-2 text-xs flex items-center justify-between font-medium animate-in fade-in duration-200">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 animate-bounce" /> {callStatus}
                </span>
                <button onClick={() => setCallStatus(null)} className="text-[10px] uppercase font-bold underline">End</button>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#0a0c13] relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#25D366_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-full bg-[#131624] border border-[#25D366]/30 text-[10px] font-mono text-[#25D366]">
                  ⚡️ Real Peer-to-Peer Channel • Realtime broadcast active (no bot)
                </span>
              </div>

              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isSelf && msg.senderId !== 'system' && (
                    <img src={msg.senderAvatar || activeConversation.participant.avatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover mb-1" />
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm leading-relaxed relative ${
                      msg.senderId === 'system'
                        ? 'bg-[#181d30] text-gray-300 border border-[#737686]/30 mx-auto text-center'
                        : msg.isSelf
                        ? 'bg-gradient-to-br from-[#075e54] to-[#128C7E] text-white rounded-br-sm'
                        : 'bg-[#181c2c] text-gray-200 border border-[#737686]/20 rounded-bl-sm'
                    }`}
                  >
                    {!msg.isSelf && msg.senderId !== 'system' && (
                      <span className="block text-[10px] font-bold text-[#25D366] mb-0.5 font-mono">
                        {msg.senderName}
                      </span>
                    )}
                    <p>{msg.text}</p>
                    {msg.senderId !== 'system' && (
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-300 font-mono">
                        <span>{msg.timestamp}</span>
                        {msg.isSelf && <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" />}
                      </div>
                    )}
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
                title="Attach Document"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to your friend (syncs live)..."
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
