import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

export function AdminPosts() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newPostRef = doc(collection(db, 'customPosts'));
      await setDoc(newPostRef, {
         title,
         slug,
         content,
         authorUid: user.uid,
         createdAt: Date.now(),
         updatedAt: Date.now(),
         views: 0,
         tags: [],
         published: true,
         coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"
      });
      toast.success("Post created successfully");
      setTitle('');
      setContent('');
    } catch(e) {
      toast.error("Failed to create post. Ensure you have admin access.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-serif border-b pb-4">Manage Custom Posts</h1>
      
      <div className="border p-6 rounded-lg bg-card">
         <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
         <form onSubmit={handleCreate} className="space-y-4">
            <div>
               <label className="text-sm font-medium mb-1 block">Title</label>
               <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." />
            </div>
            <div>
               <label className="text-sm font-medium mb-1 block">Content</label>
               <textarea 
                  required
                  rows={8}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Post content (HTML allowed)..."
               />
            </div>
            <Button type="submit" disabled={loading}>
               {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
         </form>
      </div>
    </div>
  );
}
