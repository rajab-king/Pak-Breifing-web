import { useEffect, useState } from 'react';
import { getLatestNews, getTrendingNews, NewsArticle } from '../lib/newsService';
import { NewsCard } from '../components/news/NewsCard';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';

export function Home() {
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [trending, latest] = await Promise.all([
          getTrendingNews(5),
          getLatestNews('All', 15)
        ]);
        setTrendingNews(trending);
        setLatestNews(latest);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="w-full aspect-[21/9] rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-4"><Skeleton className="h-8 w-48" /></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[300px] rounded-xl" />)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif mb-4"><Skeleton className="h-8 w-48" /></h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredLocal = trendingNews[0] || latestNews[0];
  const rightColumnTrending = trendingNews.slice(1, 5);
  const leftColumnLatest = latestNews.filter(n => n.id !== featuredLocal?.id);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-12 gap-0 md:gap-8">
        {/* Main Content Area - Latest News */}
        <section className="col-span-12 lg:col-span-8 md:pr-6 md:border-r border-border">
          {featuredLocal && (
            <NewsCard article={featuredLocal} featured={true} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {leftColumnLatest.slice(0, 10).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          
          {leftColumnLatest.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border rounded-none border-dashed mt-6">
              No news available. Try fetching new content from the admin dashboard.
            </div>
          )}
        </section>

        {/* Sidebar - Trending */}
        <aside className="col-span-12 lg:col-span-4 bg-muted p-0 md:p-6 flex flex-col mt-8 lg:mt-0">
          <div className="mb-8">
            <h4 className="text-lg font-serif font-bold italic mb-4 border-b border-border pb-2">
              Trending This Week
            </h4>
            <div className="space-y-6">
              {rightColumnTrending.map((article, index) => (
                <div key={article.id} className="flex items-start space-x-4 group">
                  <span className="text-3xl font-serif text-muted font-black italic">
                    0{index + 1}
                  </span>
                  <div>
                    <a href={`/news/${article.id}`} className="text-sm font-bold leading-snug group-hover:text-primary transition-colors block">
                      {article.title}
                    </a>
                    <span className="text-[10px] text-muted-foreground uppercase mt-1 block">
                       {article.views || 0} Views
                    </span>
                  </div>
                </div>
              ))}
              
              {rightColumnTrending.length === 0 && (
                <div className="text-sm text-muted-foreground">Not enough data to show trends.</div>
              )}
            </div>
          </div>

          <div className="mt-auto bg-slate-900 text-white p-6">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Daily Newsletter</h5>
            <p className="text-sm font-serif italic mb-4">The most important stories, delivered every morning.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email address" className="bg-white/10 border-none text-xs p-2 flex-1 focus:ring-1 focus:ring-primary outline-none" />
              <button className="bg-primary px-3 py-2 text-[10px] font-bold uppercase hover:bg-primary/90 transition-colors">Join</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
