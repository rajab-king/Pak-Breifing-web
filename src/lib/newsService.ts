import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  onSnapshot
} from 'firebase/firestore';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  source: string;
  url: string;
  category: string;
  publishedAt: number;
  createdAt: number;
  region: string;
  views: number;
  shares: number;
  trendingScore: number;
}

export async function getTrendingNews(limitCount = 5): Promise<NewsArticle[]> {
  try {
    const q = query(collection(db, 'cachedNews'), orderBy('trendingScore', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as NewsArticle);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'cachedNews');
    return [];
  }
}

export async function getLatestNews(category?: string, limitCount = 20): Promise<NewsArticle[]> {
  try {
    let q = query(collection(db, 'cachedNews'), orderBy('publishedAt', 'desc'), limit(limitCount));
    if (category && category !== 'All') {
      q = query(collection(db, 'cachedNews'), where('category', '==', category), orderBy('publishedAt', 'desc'), limit(limitCount));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as NewsArticle);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'cachedNews');
    return [];
  }
}

export async function getBreakingNewsHeadline(): Promise<string> {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().breakingHeadline) {
      return docSnap.data().breakingHeadline;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'settings');
  }
  return "Welcome to Pakistan Briefing. Stay tuned for the latest updates.";
}

export async function incrementArticleViews(articleId: string) {
  try {
    const articleRef = doc(db, 'cachedNews', articleId);
    await updateDoc(articleRef, {
      views: increment(1),
      trendingScore: increment(1)
    });
  } catch (error) {
    // Only admins or people modifying isolated views can update, handles gracefully if permission denied
    console.warn("View not tracked (requires admin config or relaxed rules for views).", error);
  }
}
