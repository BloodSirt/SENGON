import React from 'react';
import type { Creator, CreatorPostItem, TrendingTopic, FollowSuggestion } from '../types';
import { CreatorDossierCard } from './CreatorDossierCard';
import { TrendingTopics } from './TrendingTopics';
import { WhoToFollow } from './WhoToFollow';
import { RelatedCircles } from './RelatedCircles';

interface RightSidebarProps {
  creator: Creator;
  morePosts: CreatorPostItem[];
  trendingTopics: TrendingTopic[];
  whoToFollow: FollowSuggestion[];
  relatedCircles: string[];
  onSelectTag: (tag: string) => void;
  onNotify: (msg: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  creator,
  morePosts,
  trendingTopics,
  whoToFollow,
  relatedCircles,
  onSelectTag,
  onNotify,
}) => {
  return (
    <aside className="w-full space-y-6">
      {/* 1. Creator Dossier Panel */}
      <CreatorDossierCard
        creator={creator}
        morePosts={morePosts}
        onNotify={onNotify}
      />

      {/* 2. Trending Topics */}
      <TrendingTopics
        topics={trendingTopics}
        onSelectTopic={onSelectTag}
      />

      {/* 3. Who To Follow */}
      <WhoToFollow
        suggestions={whoToFollow}
        onNotify={onNotify}
      />

      {/* 4. Related Circles */}
      <RelatedCircles
        circles={relatedCircles}
        onSelectCircle={onSelectTag}
      />

      {/* 5. Footer Links */}
      <div className="px-3 pt-2 text-[11px] text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Cookie Settings</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Security</a>
        </div>
        <p className="font-mono text-[10px] text-gray-600">
          © 2026 AntiGravity / Sengon Labs Inc. All rights reserved.
        </p>
      </div>
    </aside>
  );
};
