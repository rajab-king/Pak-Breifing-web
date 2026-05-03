import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Share2, Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { NewsArticle } from '../../lib/newsService';
import { Card, CardContent } from '../ui/card';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  if (featured) {
    return (
      <div className="relative h-[420px] bg-slate-200 overflow-hidden group mb-6">
        <Link to={`/news/${article.id}`} className="block w-full h-full relative">
          <img 
            src={article.imageUrl || fallbackImage} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <div className="absolute bottom-0 p-8 z-20 w-full">
            <span className="bg-primary text-white text-[10px] font-bold uppercase px-2 py-1 mb-3 inline-block">
              {article.category}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight font-bold mb-4">
              {article.title}
            </h2>
            <div className="flex items-center text-slate-300 text-xs gap-4">
              <span className="font-medium text-white">{article.source}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(article.publishedAt))}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 group">
      <Link to={`/news/${article.id}`} className="block relative w-full md:w-32 md:h-32 bg-muted flex-shrink-0 overflow-hidden">
        <img 
          src={article.imageUrl || fallbackImage} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-col justify-center">
        <span className="text-primary text-[9px] font-black uppercase tracking-wider mb-1">
          {article.category}
        </span>
        <Link to={`/news/${article.id}`} className="flex-1">
          <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
             <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </p>
        </Link>
      </div>
    </div>
  );
}
