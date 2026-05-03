import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

export function AdminSettings() {
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function load() {
       try {
           const docRef = doc(db, 'settings', 'global');
           const snap = await getDoc(docRef);
           if (snap.exists()) {
              setHeadline(snap.data().breakingHeadline || '');
           }
       } catch (e) {
         console.error(e);
       } finally {
         setInitialLoading(false);
       }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, {
         breakingHeadline: headline,
         updatedAt: Date.now(),
         pinnedArticles: [],
         featuredArticleId: ""
      }, { merge: true });
      toast.success("Settings saved");
    } catch(e) {
      console.error(e);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-serif border-b pb-4">Global Settings</h1>
      
      <div className="border p-6 rounded-lg bg-card">
         <form onSubmit={handleSave} className="space-y-4">
            <div>
               <label className="text-sm font-medium mb-1 block">Breaking News Headline</label>
               <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Text to show in scrolling ticker..." />
               <p className="text-xs text-muted-foreground mt-1">Leave empty to hide ticker.</p>
            </div>
            <Button type="submit" disabled={loading}>
               {loading ? 'Saving...' : 'Save Settings'}
            </Button>
         </form>
      </div>
    </div>
  );
}
