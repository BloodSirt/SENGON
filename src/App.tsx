import React, { useState, useEffect, useCallback } from 'react';
import { usePost, useComments, addComment } from './hooks/useSupabase';
import { creatorMorePosts, trendingTopics, whoToFollow, relatedCircles } from './data/mockData';
import { Header } from './components/Header';
import { LeftNav } from './components/LeftNav';
import { RightSidebar } from './components/RightSidebar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { PostCard } from './components/PostCard';
import { CommentsForum } from './components/CommentsForum';
import { LightboxModal } from './components/LightboxModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';
import type { Post, Comment, CommentReply } from './types';

// Map Supabase DB shapes to our existing UI types
function mapDbPostToUiPost(dbPost: any): Post {
  return {
    id: dbPost.short_id,
    categoryBreadcrumb: dbPost.category_breadcrumb,
    creator: {
      name: dbPost.profiles.name,
      handle: dbPost.profiles.handle,
      avatar: dbPost.profiles.avatar_url,
      verified: dbPost.profiles.verified,
      roleLine: dbPost.profiles.role_line || '',
      location: dbPost.profiles.location || '',
      bio: dbPost.profiles.bio || '',
      followers: (dbPost.profiles.followers_count / 1000).toFixed(1) + 'K',
      following: String(dbPost.profiles.following_count),
      views: (dbPost.profiles.total_views / 1000000).toFixed(1) + 'M',
      isFollowing: false,
      mutuals: {
        text: 'Followed by Elena Rostova, David K., and 18 mutual architects',
        avatars: [
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        ],
      },
    },
    categoryTag: dbPost.category_tag,
    timeAgo: formatTimeAgo(dbPost.created_at),
    title: dbPost.title,
    summary: dbPost.summary,
    hashtags: dbPost.hashtags || [],
    slides: (dbPost.slides || []).map((s: any) => ({
      id: s.id,
      imageUrl: s.image_url,
      altText: s.alt_text,
      slideLabel: s.slide_label,
      captionTitle: s.caption_title,
      badgeText: s.badge_text,
      badgeIcon: s.badge_icon,
      tagline: s.tagline,
      tags: s.tags || [],
      metrics: s.metrics || [],
    })),
    stats: {
      likes: dbPost.likes_count,
      comments: dbPost.comments_count,
      reposts: dbPost.reposts_count,
      bookmarks: dbPost.bookmarks_count,
      views: (dbPost.views_count / 1000).toFixed(1) + 'K',
    },
    reactedAvatars: dbPost.reacted_avatars || [],
  };
}

function mapDbCommentsToUiComments(dbComments: any[]): Comment[] {
  return dbComments.map((c: any) => ({
    id: c.id,
    author: {
      name: c.profiles.name,
      handle: c.profiles.handle,
      avatar: c.profiles.avatar_url,
      verified: c.profiles.verified,
      verifiedLabel: c.profiles.verified_label || undefined,
    },
    timeAgo: formatTimeAgo(c.created_at),
    content: c.content,
    likes: c.likes_count,
    isLiked: false,
    isStaffPick: c.is_staff_pick,
    timestamp: new Date(c.created_at).getTime(),
    replies: (c.replies || []).map((r: any) => ({
      id: r.id,
      author: {
        name: r.profiles.name,
        handle: r.profiles.handle,
        avatar: r.profiles.avatar_url,
        verified: r.profiles.verified,
        verifiedLabel: r.profiles.verified_label || undefined,
      },
      timeAgo: formatTimeAgo(r.created_at),
      content: r.content,
      likes: r.likes_count,
      isLiked: false,
    })),
  }));
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function App() {
  const POST_SHORT_ID = '84912';

  // ── Supabase Data ──────────────────────────────────────────
  const { post: dbPost, loading: postLoading, error: postError } = usePost(POST_SHORT_ID);
  const { comments: dbComments, loading: commentsLoading, refetch: refetchComments } = useComments(
    dbPost?.id || ''
  );

  // ── Derived UI State ───────────────────────────────────────
  const post: Post | null = dbPost ? mapDbPostToUiPost(dbPost) : null;
  const comments: Comment[] = mapDbCommentsToUiComments(dbComments);
  const totalCommentsCount = post?.stats.comments ?? 0;

  // ── UI State ───────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'info' }>>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Handlers ───────────────────────────────────────────────
  const handleAddComment = async (content: string) => {
    if (!dbPost) return;
    // Using a demo author ID (in a real app this would be auth.uid())
    const demoAuthorId = '00000000-0000-0000-0000-000000000001';
    const { error } = await addComment(dbPost.id, demoAuthorId, content);
    if (error) {
      addToast(`Error posting comment: ${error.message}`, 'info');
    } else {
      addToast('Response posted to discussion! 💬');
      refetchComments();
    }
  };

  const handleAddReply = async (commentId: string, content: string) => {
    if (!dbPost) return;
    const demoAuthorId = '00000000-0000-0000-0000-000000000001';
    const { error } = await addComment(dbPost.id, demoAuthorId, content, commentId);
    if (error) {
      addToast(`Error posting reply: ${error.message}`, 'info');
    } else {
      addToast('Reply posted successfully!');
      refetchComments();
    }
  };

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Post link copied to clipboard! 📋');
    } else {
      addToast('Share: ' + window.location.href);
    }
  }, [addToast]);

  const scrollToComments = () => {
    document.getElementById('discussion-forum')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Loading / Error states ─────────────────────────────────
  if (postLoading) {
    return (
      <div className="min-h-screen bg-[#08090e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#004ac6] border-t-[#40c2fd] animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-mono">Loading from Supabase...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-[#08090e] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#ab0b1c]/20 border border-[#ff2d55]/30 flex items-center justify-center mx-auto text-3xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-white">Could not load post</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            {postError || 'Post not found. Make sure you have run the schema SQL in your Supabase SQL Editor.'}
          </p>
          <code className="block text-xs font-mono text-[#40c2fd] bg-[#131626] px-4 py-2 rounded-lg border border-[#737686]/30">
            supabase/schema.sql → Run in Supabase Dashboard
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090e] text-[#f0f2f8] selection:bg-[#004ac6] selection:text-white font-sans">

      {/* Fixed Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCreatePost={() => addToast('Opening Post Composer... 🚀')}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />

      {/* 3-Column Layout */}
      <div className="max-w-[1600px] mx-auto pt-16 px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-6 xl:gap-8">

          {/* Left Nav */}
          <LeftNav
            activeNav={activeNav}
            onSelectNav={setActiveNav}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Center: Post + Comments */}
          <main className="flex-1 min-w-0 max-w-4xl py-5 lg:ml-64 xl:mr-[380px]">
            <BreadcrumbBar
              category={post.categoryBreadcrumb}
              postId={post.id}
              onBackToFeed={() => addToast('Navigating back to main feed...')}
              onShare={handleShare}
            />

            <PostCard
              post={post}
              commentsCount={comments.length + (commentsLoading ? 0 : 0)}
              onOpenLightbox={(idx) => setLightboxIndex(idx)}
              onScrollToComments={scrollToComments}
              onSelectHashtag={(tag) => addToast(`Filtering feed by ${tag}`)}
              onShare={handleShare}
              onNotify={addToast}
            />

            <CommentsForum
              comments={comments}
              totalCommentsCount={totalCommentsCount}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onNotify={addToast}
            />
          </main>

          {/* Right Sidebar: Creator Dossier + Trending */}
          <div className="hidden xl:block w-[360px] shrink-0 py-5">
            <div className="sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto pr-1">
              <RightSidebar
                creator={post.creator}
                morePosts={creatorMorePosts}
                trendingTopics={trendingTopics}
                whoToFollow={whoToFollow}
                relatedCircles={relatedCircles}
                onSelectTag={(tag) => addToast(`Selected ${tag}`)}
                onNotify={addToast}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          slides={post.slides}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => prev === null || prev === post.slides.length - 1 ? 0 : prev + 1)}
          onPrev={() => setLightboxIndex((prev) => prev === null || prev === 0 ? post.slides.length - 1 : prev - 1)}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(res) => addToast(`Selected: "${res}"`)}
      />

    </div>
  );
}

export default App;
