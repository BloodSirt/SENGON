import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Send,
  UserPlus,
  Sparkles,
  ArrowRight,
  ShieldCheck
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
  const [customMessage, setCustomMessage] = useState(
    `Hey! I'm chatting on Sengon, the decentralized engineering network. Join our encrypted P2P channel here: ${window.location.origin}`
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullNumberClean = (countryCode + phoneNumber).replace(/[^0-9]/g, '');

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?ref=${currentUser.handle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onNotify('Invitation link copied to clipboard! 📋');
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    // 1. Create a dynamic conversation room on Sengon immediately
    const formattedHandle = '@' + (contactName.trim().toLowerCase().replace(/\s+/g, '_') || `user_${phoneNumber.slice(-4)}`);
    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      participant: {
        id: `contact-${Date.now()}`,
        name: contactName.trim() || `Contact (${countryCode} ${phoneNumber})`,
        handle: formattedHandle,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
        role: 'Invited Member (Pending Join)',
        status: 'online',
        verified: false
      },
      lastMessage: 'Invite sent via WhatsApp. Waiting for connection...',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `m-invite-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `WhatsApp Invitation dispatched to ${countryCode} ${phoneNumber}. Room initialized on Sengon lattice.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: true,
          status: 'sent'
        }
      ]
    };

    onAddContactChat(newConv);

    // 2. Open WhatsApp API directly to send the message with 1 click
    const encodedText = encodeURIComponent(
      `Hey ${contactName ? contactName : 'there'}! ${customMessage}`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=${fullNumberClean}&text=${encodedText}`;

    window.open(waUrl, '_blank');

    onNotify(`WhatsApp invitation launched for ${contactName || phoneNumber}! Room created on Sengon.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0f111c] border border-[#25D366]/40 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        
        {/* Glow WhatsApp Green / Sengon Cyan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-[#737686]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Invite Contact from WhatsApp
              </h2>
              <p className="text-[11px] text-gray-400">Bridge WhatsApp contacts directly into your Sengon Social chat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Explainer Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#141926] border border-[#25D366]/30 flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-[#25D366]/20 text-[#25D366] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Enter their phone number to ping them an automated invite on WhatsApp. Once sent, a dedicated encrypted room opens here on <b>Sengon</b> so you can transition your conversation completely off WhatsApp!
          </p>
        </div>

        <form onSubmit={handleSendViaWhatsApp} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Contact Name (Optional)</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Sarah Connor or Dev Friend"
              className="w-full px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Phone Number</label>
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
                placeholder="234 567 8901"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Invitation Message</label>
            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#25D366] resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#737686]/20">
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141726] hover:bg-[#1a1f33] border border-[#737686]/30 text-xs text-gray-300 hover:text-white transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link!' : 'Copy Direct Link'}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1ebd5d] hover:to-[#0f7a6d] text-white font-bold text-xs shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp Invite & Open Chat</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
