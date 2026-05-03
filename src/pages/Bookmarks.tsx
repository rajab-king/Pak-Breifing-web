import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsArticle } from '../lib/newsService';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent } from '../components/ui/card';
import { BookmarkMinus } from 'lucide-react';
import { toast } from 'sonner';

export function Bookmarks() {
  const { user, loading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      if (!user) return;
      try {
        const q = query(collection(db, 'bookmarks'), where('uid', '==', user.uid));
        const snap = await getDocs(q);
        const articleIds = snap.docs.map(d => d.data().articleId as string);
        
        if (articleIds.length > 0) {
           const articlesQ = query(collection(db, 'cachedNews'), where('id', 'in', articleIds));
           const articlesSnap = await getDocs(articlesQ);
           setBookmarks(articlesSnap.docs.map(d => d.data() as NewsArticle));
        } else {
           setBookmarks([]);
        }
      } catch (error) {
        console.error("Error loading bookmarks", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (!authLoading) {
      loadBookmarks();
    }
  }, [user, authLoading]);

  const removeBookmark = async (articleId: string) => {
     if (!user) return;
     try {
       // Find the bookmark doc ID
       const q = query(collection(db, 'bookmarks'), where('uid', '==', user.uid), where('articleId', '==', articleId));
       const snap = await getDocs(q);
       if (!snap.empty) {
          const docId = snap.docs[0].id;
          await deleteDoc(doc(db, 'bookmarks', docId));
          setBookmarks(prev => prev.filter(b => b.id !== articleId));
          toast.success("Bookmark removed");
       }
     } catch(e) {
        toast.error("Failed to remove bookmark");
     }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold font-serif border-b pb-4">Your Saved Articles</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map(article => (
              <Card key={article.id} className="overflow-hidden flex flex-col group">
                 <a href={`/news/${article.id}`} className="block relative aspect-[16/9] overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </a>
                 <CardContent className="p-4 flex flex-col flex-1">
                    <a href={`/news/${article.id}`} className="flex-1">
                      <h3 className="font-bold font-serif mb-2 line-clamp-2 hover:text-primary">{article.title}</h3>
                    </a>
                    <div className="flex justify-between items-center mt-4">
                       <span className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</span>
                       <Button variant="ghost" size="sm" onClick={() => removeBookmark(article.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <BookmarkMinus className="h-4 w-4 mr-2" /> Remove
                       </Button>
                    </div>
                 </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground border rounded-lg border-dashed">
            You haven't saved any articles yet.
        </div>
      )}
    </div>
  );
}
