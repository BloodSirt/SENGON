import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Send,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { ChatConversation } from '../types/social';

interface WhatsAppInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContactChat: (newConversation: ChatConversation) => void;
  onNotify: (msg: string) => void;
}

export const WhatsAppInviteModal: React.FC<WhatsAppInviteModalProps> = ({
  isOpen,
  onClose,
  onAddContactChat,
  onNotify,
}) => {
  const { currentUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate a distinct room ID based on the phone number or timestamp
  const cleanPhone = (countryCode + phoneNumber).replace(/[^0-9]/g, '');
  const roomId = cleanPhone ? `room_${cleanPhone}` : `room_${Date.now()}`;
  
  // Real invite URL that opens directly into this exact room
  const directRoomUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}&host=${encodeURIComponent(currentUser.name)}`;

  const defaultInviteText = `Hey ${contactName ? contactName : ''}! Join my private chat room on Sengon so we can chat and call directly: ${directRoomUrl}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(directRoomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onNotify('Direct room link copied! Send it to your friend 📋');
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    // Create the real synchronized room in our local list
    const newConv: ChatConversation = {
      id: roomId,
      participant: {
        id: `user-${cleanPhone}`,
        name: contactName.trim() || `Friend (${countryCode} ${phoneNumber})`,
        handle: '@' + (contactName.trim().toLowerCase().replace(/\s+/g, '_') || `user_${cleanPhone.slice(-4)}`),
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        role: 'Live Peer',
        status: 'online',
        verified: true
      },
      lastMessage: 'Waiting for friend to open room link...',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `m-sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          senderAvatar: '',
          text: `Room created! Send this link to your friend to chat live: ${directRoomUrl}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: false,
          status: 'read'
        }
      ]
    };

    onAddContactChat(newConv);

    // Open WhatsApp directly with the pre-filled direct room link
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(defaultInviteText)}`;
    window.open(waUrl, '_blank');

    onNotify(`WhatsApp invite opened! Your friend can click the link to chat with you.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0f111c] border border-[#25D366]/40 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        
        {/* Glow WhatsApp Green */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-[#737686]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Invite Real Friend via WhatsApp
              </h2>
              <p className="text-[11px] text-gray-400">Creates a real-time room your friend can join and chat with you</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time sync explanation */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#141926] border border-[#25D366]/30 flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-[#25D366]/20 text-[#25D366] shrink-0 mt-0.5">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-xs text-gray-300 leading-relaxed space-y-1">
            <p className="font-semibold text-white">No Bots — Real Peer-to-Peer Live Chat</p>
            <p className="text-gray-400">
              When your friend clicks the WhatsApp invite link, they will enter this exact room. Every message you send will appear live on their screen!
            </p>
          </div>
        </div>

        <form onSubmit={handleSendViaWhatsApp} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Friend's Name</label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. John or Sarah"
              className="w-full px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Friend's WhatsApp Number</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 px-2 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white focus:outline-none focus:border-[#25D366]"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+234">🇳🇬 +234</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+62">🇮🇩 +62</option>
                <option value="+86">🇨🇳 +86</option>
              </select>

              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Mobile number..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          {/* Direct Link Preview */}
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Direct Chat Room Link</label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#141726] border border-[#737686]/25">
              <LinkIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <input
                readOnly
                value={directRoomUrl}
                className="bg-transparent text-[11px] text-gray-400 font-mono w-full focus:outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="p-1 px-2.5 rounded-lg bg-[#1e2338] hover:bg-[#25D366]/20 text-gray-200 hover:text-[#25D366] text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#737686]/20">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1ebd5d] hover:to-[#0f7a6d] text-white font-bold text-xs shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp Message & Open Room</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
