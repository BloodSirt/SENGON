import React, { useState } from 'react';
import {
  MessageSquare,
  Code2,
  Image as ImageIcon,
  Smile,
  Bold,
  AtSign,
  Send,
  Heart,
  CornerDownRight,
  Sparkles,
  CheckCircle2,
  Languages,
  ChevronDown,
  ThumbsUp
} from 'lucide-react';
import type { Comment, CommentReply } from '../types';

interface CommentsForumProps {
  comments: Comment[];
  totalCommentsCount: number;
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
  onNotify: (message: string) => void;
}

export const CommentsForum: React.FC<CommentsForumProps> = ({
  comments,
  totalCommentsCount,
  onAddComment,
  onAddReply,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'top' | 'newest' | 'staff'>('top');
  const [composerText, setComposerText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; isLiked: boolean }>>({});
  const [translatedComments, setTranslatedComments] = useState<Record<string, boolean>>({});
  const [displayCount, setDisplayCount] = useState(3);

  // Sorting logic
  const getSortedComments = () => {
    let sorted = [...comments];
    if (activeTab === 'staff') {
      sorted = sorted.filter((c) => c.isStaffPick);
    } else if (activeTab === 'newest') {
      sorted.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      // top by default
      sorted.sort((a, b) => b.likes - a.likes);
    }
    return sorted.slice(0, displayCount);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    onAddComment(composerText.trim());
    setComposerText('');
    onNotify('Response posted to discussion! 💬');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;

    onAddReply(commentId, replyText.trim());
    setReplyText('');
    setActiveReplyId(null);
    onNotify('Reply posted successfully!');
  };

  const handleToggleLike = (commentId: string, initialCount: number) => {
    setCommentLikes((prev) => {
      const current = prev[commentId] || { count: initialCount, isLiked: false };
      const nextLiked = !current.isLiked;
      return {
        ...prev,
        [commentId]: {
          count: nextLiked ? current.count + 1 : current.count - 1,
          isLiked: nextLiked,
        },
      };
    });
  };

  const handleToggleTranslate = (commentId: string) => {
    setTranslatedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleInsertToolTag = (tag: string) => {
    setComposerText((prev) => prev + tag);
  };

  const visibleComments = getSortedComments();
  const remainingCount = Math.max(0, totalCommentsCount - visibleComments.length);

  return (
    <section id="discussion-forum" className="mt-8 pt-4 space-y-6">
      {/* Header & Sorting Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#737686]/20">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Discussion
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#161a29] border border-[#737686]/40 text-[#40c2fd] text-xs font-mono font-bold">
            {totalCommentsCount}
          </span>
        </div>

        {/* Sorting Tabs: Top / Newest / Staff Picks */}
        <div className="flex items-center p-1 rounded-xl bg-[#10121d] border border-[#737686]/25 self-start sm:self-auto">
          {(
            [
              { id: 'top', label: 'Top' },
              { id: 'newest', label: 'Newest' },
              { id: 'staff', label: 'Staff Picks' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#004ac6] to-[#1d68ff] text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#181b28]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Comment Composer */}
      <div className="p-4 rounded-2xl bg-[#10131f] border border-[#737686]/25 shadow-xl relative focus-within:border-[#40c2fd]/60 transition-colors">
        <form onSubmit={handlePostComment} className="space-y-3">
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="You"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#004ac6]/40 shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Share your thoughts, architectural feedback, or benchmark insights..."
                rows={3}
                className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Composer Tools & Respond Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#737686]/20">
            <div className="flex items-center gap-1 text-gray-400">
              <button
                type="button"
                onClick={() => handleInsertToolTag(' ```code``` ')}
                className="p-1.5 rounded-lg hover:text-[#40c2fd] hover:bg-[#181c2b] transition-colors"
                title="Code block"
              >
                <Code2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertToolTag(' **bold** ')}
                className="p-1.5 rounded-lg hover:text-[#40c2fd] hover:bg-[#181c2b] transition-colors"
                title="Bold format"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertToolTag(' ⚡️ ')}
                className="p-1.5 rounded-lg hover:text-[#40c2fd] hover:bg-[#181c2b] transition-colors"
                title="Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertToolTag(' @marcus_dev ')}
                className="p-1.5 rounded-lg hover:text-[#40c2fd] hover:bg-[#181c2b] transition-colors"
                title="Mention author"
              >
                <AtSign className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNotify('Image upload dialog simulated 📸')}
                className="p-1.5 rounded-lg hover:text-[#40c2fd] hover:bg-[#181c2b] transition-colors"
                title="Attach Diagram/Screenshot"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!composerText.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#004ac6] to-[#1d68ff] hover:from-[#1d68ff] hover:to-[#40c2fd] disabled:opacity-40 disabled:hover:from-[#004ac6] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#004ac6]/30 transition-all hover:shadow-[#1d68ff]/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Respond</span>
            </button>
          </div>
        </form>
      </div>

      {/* Threaded Comments List */}
      <div className="space-y-4">
        {visibleComments.map((comment) => {
          const likeState = commentLikes[comment.id] || { count: comment.likes, isLiked: false };
          const isTranslated = !!translatedComments[comment.id];

          return (
            <div
              key={comment.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0f111c] border border-[#737686]/20 space-y-3 hover:border-[#737686]/40 transition-colors"
            >
              {/* Comment Author Identity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white hover:text-[#40c2fd] cursor-pointer">
                        {comment.author.name}
                      </span>
                      {comment.author.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#40c2fd]" />
                      )}
                      {comment.author.verifiedLabel && (
                        <span className="px-2 py-0.5 rounded-full bg-[#171b2a] border border-[#40c2fd]/30 text-[10px] font-medium text-[#40c2fd]">
                          {comment.author.verifiedLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{comment.author.handle}</span>
                      <span>•</span>
                      <span>{comment.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {comment.isStaffPick && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ab0b1c]/15 border border-[#ff2d55]/30 text-[#ff2d55] text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>Staff Pick</span>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="text-sm text-gray-200 leading-relaxed pl-12">
                <p>
                  {isTranslated
                    ? `[Translated to EN]: ${comment.content}`
                    : comment.content}
                </p>
              </div>

              {/* Actions Bar: Like / Reply / Translate */}
              <div className="flex items-center justify-between pl-12 pt-1 text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(comment.id, comment.likes)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      likeState.isLiked ? 'text-[#ff2d55]' : 'hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likeState.isLiked ? 'fill-[#ff2d55]' : ''
                      }`}
                    />
                    <span className="font-mono">{likeState.count}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveReplyId(
                        activeReplyId === comment.id ? null : comment.id
                      )
                    }
                    className="flex items-center gap-1.5 hover:text-[#40c2fd] transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => handleToggleTranslate(comment.id)}
                    className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{isTranslated ? 'Original' : 'Translate'}</span>
                  </button>
                </div>
              </div>

              {/* Nested Reply Composer */}
              {activeReplyId === comment.id && (
                <div className="ml-10 mt-3 p-3 rounded-xl bg-[#141726] border border-[#40c2fd]/30 space-y-2 animate-in fade-in duration-200">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author.name}...`}
                    rows={2}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1 rounded-full text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handlePostReply(comment.id)}
                      className="px-3.5 py-1 rounded-full bg-[#1d68ff] hover:bg-[#40c2fd] text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Nested Replies Rendering (with indentation & thread line) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 sm:ml-10 pl-4 border-l-2 border-[#1d68ff]/30 space-y-3.5 mt-3 pt-1">
                  {comment.replies.map((reply) => {
                    const replyLikeState = commentLikes[reply.id] || {
                      count: reply.likes,
                      isLiked: false,
                    };

                    return (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-xl bg-[#121522] border border-[#737686]/20 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white">
                                  {reply.author.name}
                                </span>
                                {reply.author.verified && (
                                  <CheckCircle2 className="w-3 h-3 text-[#40c2fd]" />
                                )}
                                {reply.author.verifiedLabel && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#004ac6]/30 text-[#40c2fd] text-[9px] font-bold">
                                    {reply.author.verifiedLabel}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-500">
                                {reply.timeAgo}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed">
                          {reply.content}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400">
                          <button
                            onClick={() =>
                              handleToggleLike(reply.id, reply.likes)
                            }
                            className={`flex items-center gap-1 ${
                              replyLikeState.isLiked
                                ? 'text-[#ff2d55]'
                                : 'hover:text-white'
                            }`}
                          >
                            <Heart
                              className={`w-3 h-3 ${
                                replyLikeState.isLiked ? 'fill-[#ff2d55]' : ''
                              }`}
                            />
                            <span className="font-mono">{replyLikeState.count}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load Remaining Comments Button */}
      {remainingCount > 0 && (
        <button
          onClick={() => {
            setDisplayCount((prev) => prev + 3);
            onNotify('Loaded more architectural discussions ⚡️');
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#11131e] hover:bg-[#181b2a] border border-[#737686]/30 hover:border-[#40c2fd]/50 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md group"
        >
          <span>Load remaining {remainingCount} comments</span>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#40c2fd] group-hover:translate-y-0.5 transition-all" />
        </button>
      )}
    </section>
  );
};
