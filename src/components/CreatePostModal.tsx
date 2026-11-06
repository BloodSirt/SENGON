import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, Sparkles, Layers, Tag, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Post, PostSlide } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPost: Post) => void;
  onNotify: (msg: string) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  onNotify,
}) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [categoryTag, setCategoryTag] = useState('Engineering');
  const [summary, setSummary] = useState('');
  const [hashtags, setHashtags] = useState('#SystemArchitecture, #DistributedSystems, #WebGPU');
  const [slideTitle, setSlideTitle] = useState('Core Architecture Diagram');
  const [slideTagline, setSlideTagline] = useState('P2P edge sync with latency benchmarks under 15ms');
  const [slideImageUrl, setSlideImageUrl] = useState(
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=85'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const tagsArray = hashtags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdSlide: PostSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: slideImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=85',
      altText: slideTitle,
      slideLabel: 'SLIDE 01 / 01',
      captionTitle: slideTitle,
      badgeText: 'Verified Benchmark',
      badgeIcon: 'bolt',
      tagline: slideTagline,
      tags: ['WASM', 'Edge Relay', 'Lattice Node'],
      metrics: [
        { label: 'Throughput', value: '110k ops/s', change: '+35%' },
        { label: 'Sync Latency', value: '12.4 ms', change: 'Optimal' },
        { label: 'Memory', value: '3.8 MB', change: '-28%' }
      ]
    };

    const newPost: Post = {
      id: String(Math.floor(10000 + Math.random() * 90000)),
      categoryBreadcrumb: `${categoryTag} & Distributed Systems`,
      creator: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        verified: currentUser.verified || true,
        roleLine: currentUser.role,
        location: 'Global Edge Relay',
        bio: currentUser.bio || 'Architect on Sengon network',
        followers: '12.4K',
        following: '280',
        views: '450K',
        mutuals: {
          text: 'Followed by Elena Rostova, Marcus Chen, and 12 mutual engineers',
          avatars: [
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
          ]
        }
      },
      categoryTag,
      timeAgo: 'Just now',
      title: title.trim(),
      summary: summary.trim(),
      hashtags: tagsArray,
      slides: [createdSlide],
      stats: {
        likes: 1,
        comments: 0,
        reposts: 0,
        bookmarks: 0,
        views: '1.2K'
      },
      reactedAvatars: ['JD', 'AL']
    };

    onPublish(newPost);
    onNotify('Post published live to Sengon stream! 🚀');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0f111c] border border-[#737686]/30 shadow-2xl p-6 sm:p-7 overflow-y-auto relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#737686]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-[#004ac6] to-[#40c2fd] flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Technical Post</h2>
              <p className="text-[11px] text-gray-400">Publish architectural insights with interactive slides</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Category Tag & Title */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-44">
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">Category</label>
              <select
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white focus:outline-none focus:border-[#40c2fd]"
              >
                <option value="Engineering">Engineering</option>
                <option value="Architecture">Architecture</option>
                <option value="Distributed">Distributed</option>
                <option value="WebGPU">WebGPU</option>
                <option value="Rust/WASM">Rust / WASM</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">Headline / Post Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scaling CRDT state lattices across 48 edge POPs ⚡️"
                className="w-full px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
              />
            </div>
          </div>

          {/* Summary / Body */}
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Summary & Technical Overview</label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Explain the architectural breakdown, stress tests, benchmark results..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd] resize-none"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Hashtag Tags (comma separated)</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#WebPerf, #RustLang, #Systems"
              className="w-full px-3.5 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
            />
          </div>

          {/* Slide Configuration Box */}
          <div className="p-4 rounded-2xl bg-[#131626] border border-[#737686]/25 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#40c2fd] block">
              Slide 1 Visualization Configuration:
            </span>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Slide Title</label>
              <input
                type="text"
                value={slideTitle}
                onChange={(e) => setSlideTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#181d30] border border-[#737686]/30 text-xs text-white focus:outline-none focus:border-[#40c2fd]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Slide Caption / Tagline</label>
              <input
                type="text"
                value={slideTagline}
                onChange={(e) => setSlideTagline(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#181d30] border border-[#737686]/30 text-xs text-white focus:outline-none focus:border-[#40c2fd]"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Image URL (Unsplash or direct image)</label>
              <input
                type="text"
                value={slideImageUrl}
                onChange={(e) => setSlideImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#181d30] border border-[#737686]/30 text-xs text-white focus:outline-none focus:border-[#40c2fd]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#737686]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#004ac6] to-[#1d68ff] hover:from-[#1d68ff] hover:to-[#40c2fd] text-white font-bold text-xs shadow-lg shadow-[#004ac6]/30 transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
