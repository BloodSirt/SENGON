export interface PostSlide {
  id: string;
  imageUrl: string;
  altText: string;
  slideLabel: string;
  captionTitle: string;
  badgeText: string;
  badgeIcon: string;
  tagline?: string;
  tags?: string[];
  metrics?: { label: string; value: string; change?: string }[];
}

export interface Creator {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  roleLine: string;
  location: string;
  bio: string;
  followers: string;
  following: string;
  views: string;
  isFollowing?: boolean;
  mutuals: {
    text: string;
    avatars: string[];
  };
}

export interface Post {
  id: string;
  categoryBreadcrumb: string;
  creator: Creator;
  categoryTag: string;
  timeAgo: string;
  title: string;
  summary: string;
  hashtags: string[];
  slides: PostSlide[];
  stats: {
    likes: number;
    comments: number;
    reposts: number;
    bookmarks: number;
    views: string;
  };
  reactedAvatars: string[];
}

export interface CommentReply {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
    verifiedLabel?: string;
  };
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
    verifiedLabel?: string;
  };
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  replies: CommentReply[];
  isStaffPick?: boolean;
  timestamp: number;
}

export interface CreatorPostItem {
  id: string;
  title: string;
  thumbnail: string;
  timeAgo: string;
  likes: string;
  comments: string;
}

export interface TrendingTopic {
  id: string;
  category: string;
  topic: string;
  postsCount: string;
  isHot?: boolean;
}

export interface FollowSuggestion {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  verified: boolean;
  isFollowing?: boolean;
}
