import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, FileJson, TrendingUp } from 'lucide-react';

export function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, articles: 0, custom: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersSnap, articlesSnap, customSnap] = await Promise.all([
           getCountFromServer(collection(db, 'users')),
           getCountFromServer(collection(db, 'cachedNews')),
           getCountFromServer(collection(db, 'customPosts'))
        ]);
        setStats({
          users: usersSnap.data().count,
          articles: articlesSnap.data().count,
          custom: customSnap.data().count
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-serif border-b pb-4">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{loading ? '...' : stats.users}</div>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium">Cached Articles</CardTitle>
             <FileJson className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{loading ? '...' : stats.articles}</div>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium">Custom Posts</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{loading ? '...' : stats.custom}</div>
           </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-xl border">
        <h3 className="font-bold mb-2">Automated Fetcher</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The backend runs a cron job on the Express server every hour. You can test the News API integration manually from the sidebar link.
        </p>
      </div>
    </div>
  );
}
