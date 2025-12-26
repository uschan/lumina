
import React from 'react';
import Giscus from '@giscus/react';
import { GISCUS_CONFIG } from '../constants';

interface CommentsProps {
  theme?: 'light' | 'dark';
}

const Comments: React.FC<CommentsProps> = () => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="w-full mt-12 pt-12 border-t border-border/50">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>💬</span>
        <span>Discussions</span>
      </h3>
      
      <div className="min-h-[200px]">
        <Giscus
          id="comments"
          repo={GISCUS_CONFIG.repo as any}
          repoId={GISCUS_CONFIG.repoId}
          category={GISCUS_CONFIG.category}
          categoryId={GISCUS_CONFIG.categoryId}
          mapping="pathname"
          strict="0"
          term="Welcome to Lumina!"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={isDark ? 'transparent_dark' : 'light'}
          lang="zh-CN"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Powered by GitHub Discussions.
      </p>
    </div>
  );
};

export default Comments;
