import React, { useState, useEffect, useCallback } from 'react';
import { usePost, useComments, addComment } from './hooks/useSupabase';
import { initialPost, creatorMorePosts, trendingTopics, whoToFollow, relatedCircles } from './data/mockData';
import { Header } from './components/Header';
import { LeftNav } from './components/LeftNav';
import { RightSidebar } from './components/RightSidebar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { PostCard } from './components/PostCard';
import { CommentsForum } from './components/CommentsForum';
import { LightboxModal } from './components/LightboxModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { WhatsAppChatDrawer } from './components/WhatsAppChatDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { CreatePostModal } from './components/CreatePostModal';
import type { Post, Comment } from './types';

function mapDbPostToUiPost(dbPost: any): Post {
  return {
    id: dbPost.short_id,
    categoryBreadcrumb: dbPost.category_breadcrumb,
    creator: {
      name: dbPost.profiles?.name || 'Marcus Chen',
      handle: dbPost.profiles?.handle || '@marcus_dev',
      avatar: dbPost.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: dbPost.profiles?.verified ?? true,
      roleLine: dbPost.profiles?.role_line || 'Principal Architect',
      location: dbPost.profiles?.location || 'San Francisco, CA',
      bio: dbPost.profiles?.bio || '',
      followers: dbPost.profiles?.followers_count ? (dbPost.profiles.followers_count / 1000).toFixed(1) + 'K' : '34.8K',
      following: String(dbPost.profiles?.following_count || '412'),
      views: dbPost.profiles?.total_views ? (dbPost.profiles.total_views / 1000000).toFixed(1) + 'M' : '1.2M',
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
    categoryTag: dbPost.category_tag || 'Engineering',
    timeAgo: '3h ago',
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
      likes: dbPost.likes_count || 2418,
      comments: dbPost.comments_count || 382,
      reposts: dbPost.reposts_count || 195,
      bookmarks: dbPost.bookmarks_count || 847,
      views: '48.6K',
    },
    reactedAvatars: dbPost.reacted_avatars || ['JD', 'EK', '+18'],
  };
}

function mapDbCommentsToUiComments(dbComments: any[]): Comment[] {
  return dbComments.map((c: any) => ({
    id: c.id,
    author: {
      name: c.profiles?.name || 'Engineer',
      handle: c.profiles?.handle || '@engineer',
      avatar: c.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      verified: c.profiles?.verified,
      verifiedLabel: c.profiles?.verified_label || undefined,
    },
    timeAgo: '1h ago',
    content: c.content,
    likes: c.likes_count || 0,
    isLiked: false,
    isStaffPick: c.is_staff_pick,
    timestamp: new Date(c.created_at).getTime(),
    replies: (c.replies || []).map((r: any) => ({
      id: r.id,
      author: {
        name: r.profiles?.name || 'Engineer',
        handle: r.profiles?.handle || '@engineer',
        avatar: r.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        verified: r.profiles?.verified,
        verifiedLabel: r.profiles?.verified_label || undefined,
      },
      timeAgo: '45m ago',
      content: r.content,
      likes: r.likes_count || 0,
      isLiked: false,
    })),
  }));
}

function MainApp() {
  const { currentUser } = useAuth();
  const POST_SHORT_ID = '84912';

  const { post: dbPost } = usePost(POST_SHORT_ID);
  const { comments: dbComments, refetch: refetchComments } = useComments(dbPost?.id || '');

  // Feed / Posts state (supports adding new posts live)
  const [postsList, setPostsList] = useState<Post[]>([initialPost]);
  const [activePostId, setActivePostId] = useState<string>(initialPost.id);

  // Sync Supabase post when available
  useEffect(() => {
    if (dbPost) {
      const mapped = mapDbPostToUiPost(dbPost);
      setPostsList((prev) => [mapped, ...prev.filter((p) => p.id !== mapped.id)]);
    }
  }, [dbPost]);

  const activePost = postsList.find((p) => p.id === activePostId) || postsList[0] || initialPost;
  const comments: Comment[] = dbComments?.length ? mapDbCommentsToUiComments(dbComments) : [];

  // Navigation tabs: 'home' | 'explore' | 'messages' | 'admin' | 'bookmarks' | 'profile'
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(() => {
    // Automatically open the chat drawer if someone clicks an invite link containing ?room=
    const params = new URLSearchParams(window.location.search);
    return params.has('room');
  });
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Toast stack
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'info' }>>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for ⌘K / Ctrl+K
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

  // Post creation
  const handlePublishPost = (newPost: Post) => {
    setPostsList((prev) => [newPost, ...prev]);
    setActivePostId(newPost.id);
    setActiveNav('home');
  };

  const handleDeletePost = (id: string) => {
    setPostsList((prev) => prev.filter((p) => p.id !== id));
    addToast('Post removed from global stream by Admin.');
  };

  // Comments
  const handleAddComment = async (content: string) => {
    if (dbPost) {
      await addComment(dbPost.id, currentUser.id, content);
      refetchComments();
    }
    addToast('Response posted to discussion! 💬');
  };

  const handleAddReply = async (commentId: string, content: string) => {
    if (dbPost) {
      await addComment(dbPost.id, currentUser.id, content, commentId);
      refetchComments();
    }
    addToast('Reply posted successfully!');
  };

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Post link copied to clipboard! 📋');
    }
  }, [addToast]);

  const scrollToComments = () => {
    document.getElementById('discussion-forum')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-[#f0f2f8] selection:bg-[#004ac6] selection:text-white font-sans">
      
      {/* 1. Fixed Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        onOpenMessenger={() => setIsMessengerOpen(true)}
      />

      {/* 2. Main 3-Column Layout Container */}
      <div className="max-w-[1600px] mx-auto pt-16 px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-6 xl:gap-8">
          
          {/* Column 1: Left Navigation Sidebar */}
          <LeftNav
            activeNav={activeNav}
            onSelectNav={setActiveNav}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
            onOpenMessenger={() => setIsMessengerOpen(true)}
          />

          {/* Column 2: Dynamic Center Content */}
          <main className="flex-1 min-w-0 max-w-4xl py-5 lg:ml-64 xl:mr-[380px]">
            {activeNav === 'admin' ? (
              <AdminDashboard
                posts={postsList}
                onDeletePost={handleDeletePost}
                onNotify={addToast}
              />
            ) : (
              <>
                {/* Multi-Post Switcher if more than 1 post */}
                {postsList.length > 1 && (
                  <div className="mb-4 p-3 rounded-2xl bg-[#0f111c] border border-[#737686]/20 flex items-center gap-2 overflow-x-auto">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0 font-mono">
                      Stream:
                    </span>
                    {postsList.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActivePostId(p.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          p.id === activePost.id
                            ? 'bg-gradient-to-r from-[#004ac6] to-[#1d68ff] text-white shadow-md'
                            : 'bg-[#141726] text-gray-400 hover:text-white'
                        }`}
                      >
                        #{p.id} • {p.title.slice(0, 24)}...
                      </button>
                    ))}
                  </div>
                )}

                <BreadcrumbBar
                  category={activePost.categoryBreadcrumb}
                  postId={activePost.id}
                  onBackToFeed={() => addToast('Viewing current engineering stream')}
                  onShare={handleShare}
                />

                <PostCard
                  post={activePost}
                  commentsCount={comments.length || activePost.stats.comments}
                  onOpenLightbox={(idx) => setLightboxIndex(idx)}
                  onScrollToComments={scrollToComments}
                  onSelectHashtag={(tag) => addToast(`Filtering stream by ${tag}`)}
                  onShare={handleShare}
                  onNotify={addToast}
                />

                <CommentsForum
                  comments={comments}
                  totalCommentsCount={comments.length || activePost.stats.comments}
                  onAddComment={handleAddComment}
                  onAddReply={handleAddReply}
                  onNotify={addToast}
                />
              </>
            )}
          </main>

          {/* Column 3: Fixed / Sticky Right Sidebar */}
          <div className="hidden xl:block w-[360px] shrink-0 py-5">
            <div className="sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto pr-1">
              <RightSidebar
                creator={activePost.creator}
                morePosts={creatorMorePosts}
                trendingTopics={trendingTopics}
                whoToFollow={whoToFollow}
                relatedCircles={relatedCircles}
                onSelectTag={(tag) => addToast(`Selected circle ${tag}`)}
                onNotify={addToast}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Floating Toast Notification Stack */}
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

      {/* WhatsApp Style Chat Drawer */}
      <WhatsAppChatDrawer
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      />

      {/* Auth / Login Modal */}
      <AuthModal />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPublish={handlePublishPost}
        onNotify={addToast}
      />

      {/* Lightbox Fullscreen Slide Viewer */}
      {lightboxIndex !== null && (
        <LightboxModal
          slides={activePost.slides}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev === null || prev === activePost.slides.length - 1 ? 0 : prev + 1
            )
          }
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev === null || prev === 0 ? activePost.slides.length - 1 : prev - 1
            )
          }
        />
      )}

      {/* Search / Command Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(res) => addToast(`Selected: "${res}"`)}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
