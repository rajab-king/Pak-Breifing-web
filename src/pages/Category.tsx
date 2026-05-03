import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLatestNews, NewsArticle } from '../lib/newsService';
import { NewsCard } from '../components/news/NewsCard';
import { Skeleton } from '../components/ui/skeleton';

export function Category() {
  const { name } = useParams();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryName = name ? name.charAt(0).toUpperCase() + name.slice(1) : 'News';

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getLatestNews(categoryName, 20);
      setNews(data);
      setLoading(false);
    }
    load();
    window.scrollTo(0,0);
  }, [categoryName]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-200 py-16 px-6 border-y border-border text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black font-serif uppercase tracking-widest">{categoryName}</h1>
        <p className="text-muted-foreground mt-4 font-bold uppercase tracking-widest text-xs">The latest {categoryName.toLowerCase()} news, updates, and analysis.</p>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-40 w-full rounded-none" />)}
         </div>
      ) : news.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {news.map(article => <NewsCard key={article.id} article={article} />)}
         </div>
      ) : (
         <div className="text-center py-20 text-muted-foreground border rounded-none border-dashed">
            No news found for this category.
         </div>
      )}
    </div>
  );
}
