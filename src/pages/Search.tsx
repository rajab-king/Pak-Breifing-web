import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsArticle } from '../lib/newsService';
import { NewsCard } from '../components/news/NewsCard';
import { Skeleton } from '../components/ui/skeleton';

export function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function doSearch() {
      if (!q) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      // In a real app we'd use Algolia or Typesense. For this, we'll fetch recent and filter in-memory since Firestore doesn't support full-text search.
      try {
        const qRef = query(collection(db, 'cachedNews'), orderBy('publishedAt', 'desc'), limit(100));
        const snap = await getDocs(qRef);
        const allNews = snap.docs.map(d => d.data() as NewsArticle);
        
        const term = q.toLowerCase();
        const filtered = allNews.filter(n => 
          n.title.toLowerCase().includes(term) || 
          n.description.toLowerCase().includes(term) ||
          (n.category && n.category.toLowerCase().includes(term))
        );
        setResults(filtered);
      } catch (error) {
         console.error("Search error", error);
      } finally {
         setLoading(false);
      }
    }
    doSearch();
  }, [q]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-serif border-b pb-4">
        Search Results for "{q}"
      </h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
         </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(article => <NewsCard key={article.id} article={article} />)}
         </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground border rounded-lg border-dashed">
            No results found for your query. Try different keywords.
         </div>
      )}
    </div>
  );
}
