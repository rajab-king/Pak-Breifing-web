import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoc, doc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { incrementArticleViews, NewsArticle } from '../lib/newsService';
import { format } from 'date-fns';
import { Share2, Bookmark, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'cachedNews', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const articleData = docSnap.data() as NewsArticle;
          setArticle(articleData);
          
          incrementArticleViews(id);
          
          // Fetch related
          if (articleData.category) {
             const relatedQ = query(
                 collection(db, 'cachedNews'), 
                 where('category', '==', articleData.category), 
                 orderBy('publishedAt', 'desc'),
                 limit(5)
             );
             const relatedSnap = await getDocs(relatedQ);
             const filtered = relatedSnap.docs
                .map(d => d.data() as NewsArticle)
                .filter(a => a.id !== id)
                .slice(0, 4);
             setRelated(filtered);
          }
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
         setLoading(false);
      }
    }
    
    loadArticle();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.description,
          url: window.location.href,
        });
      } catch (e) {
        toast.success("Link copied to clipboard");
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-4">
           <Skeleton className="h-8 w-8 rounded-full" />
           <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="w-full aspect-[21/9] rounded-xl" />
        <div className="space-y-4">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold font-serif mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/">
          <Button><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
      </Link>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link to={`/category/${article.category.toLowerCase()}`} className="text-primary hover:underline uppercase tracking-wider">
            {article.category}
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground uppercase">{article.source}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif leading-[1.1] tracking-tight">
          {article.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed md:w-5/6">
          {article.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y">
          <div className="text-sm text-muted-foreground">
            Published on {format(new Date(article.publishedAt), 'MMMM d, yyyy • h:mm a')}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </div>
      
      <div className="relative aspect-[21/9] w-full mb-10 overflow-hidden bg-muted rounded-none shadow-sm">
         <img src={article.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"} alt={article.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto font-serif leading-relaxed text-foreground/90">
         <div dangerouslySetInnerHTML={{ __html: article.content ? article.content.replace(/\n'/g, '<br/><br/>') : 'No full content available.' }} />
         
         <div className="mt-10 pt-8 border-t flex flex-col items-center">
            <p className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Read the complete original story at {article.source}.</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
               <Button size="lg" className="rounded-none px-8 font-bold uppercase tracking-wider text-xs">
                  Read Full Article on {article.source} <ExternalLink className="ml-2 h-4 w-4" />
               </Button>
            </a>
         </div>
      </div>

      {/* Related News */}
      {related.length > 0 && (
        <div className="mt-20 pt-10 border-t">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-serif italic">More in {article.category}</h3>
            <Link to={`/category/${article.category.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(item => (
              <Link to={`/news/${item.id}`} key={item.id} className="group cursor-pointer flex flex-col">
                <div className="aspect-[4/3] mb-3 overflow-hidden rounded-none bg-muted border border-border">
                  <img src={item.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                   <h4 className="font-bold font-serif text-base leading-snug group-hover:text-primary transition-colors line-clamp-3 mb-2">{item.title}</h4>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground">{format(new Date(item.publishedAt), 'MMM d, yyyy')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
