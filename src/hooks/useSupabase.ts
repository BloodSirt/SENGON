import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── Types returned from Supabase queries ─────────────────────

export interface DbProfile {
  id: string;
  name: string;
  handle: string;
  avatar_url: string;
  verified: boolean;
  verified_label: string | null;
  role_line: string | null;
  location: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  total_views: number;
}

export interface DbSlide {
  id: string;
  post_id: string;
  position: number;
  image_url: string;
  alt_text: string;
  slide_label: string;
  caption_title: string;
  badge_text: string;
  badge_icon: string;
  tagline: string;
  tags: string[];
  metrics: { label: string; value: string; change?: string }[];
}

export interface DbPost {
  id: string;
  short_id: string;
  author_id: string;
  category_breadcrumb: string;
  category_tag: string;
  title: string;
  summary: string;
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  bookmarks_count: number;
  views_count: number;
  reacted_avatars: string[];
  created_at: string;
  profiles: DbProfile;
  slides: DbSlide[];
}

export interface DbComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  likes_count: number;
  is_staff_pick: boolean;
  created_at: string;
  profiles: DbProfile;
  replies?: DbComment[];
}

// ─── usePost hook ─────────────────────────────────────────────

export function usePost(shortId: string) {
  const [post, setPost] = useState<DbPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (*),
          slides (*)
        `)
        .eq('short_id', shortId)
        .order('position', { referencedTable: 'slides', ascending: true })
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPost(data as unknown as DbPost);
      }
      setLoading(false);
    };

    fetchPost();
  }, [shortId]);

  return { post, loading, error };
}

// ─── useComments hook (with Realtime) ────────────────────────

export function useComments(postId: string) {
  const [comments, setComments] = useState<DbComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildTree = (flat: DbComment[]): DbComment[] => {
    const roots: DbComment[] = [];
    const map: Record<string, DbComment> = {};

    // Clone and initialise replies array
    flat.forEach((c) => {
      map[c.id] = { ...c, replies: [] };
    });

    flat.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies!.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('post_id', postId)
      .not('content', 'ilike', '{"_sengon_chat":%')
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setComments(buildTree((data as unknown as DbComment[]) || []));
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();

    // Realtime: listen for new comments on this post
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          // Re-fetch to get profile join and proper tree
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
}

// ─── addComment ───────────────────────────────────────────────

export async function addComment(
  postId: string,
  authorId: string,
  content: string,
  parentId?: string
) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      content,
      parent_id: parentId || null,
    })
    .select('*, profiles(*)')
    .single();

  return { data, error };
}

// ─── togglePostLike ───────────────────────────────────────────

export async function togglePostLike(
  postId: string,
  userId: string,
  isLiked: boolean
) {
  if (isLiked) {
    // Remove like
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('type', 'like');
    return { error };
  } else {
    // Add like
    const { error } = await supabase
      .from('post_reactions')
      .insert({ post_id: postId, user_id: userId, type: 'like' });
    return { error };
  }
}

