import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Settings, FileText, Activity } from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminPosts } from './AdminPosts';
import { AdminSettings } from './AdminSettings';

export function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 border-r pr-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold font-serif mb-4">Admin Panel</h2>
          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </Link>
            <Link to="/admin/posts" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium">
              <FileText className="h-4 w-4" /> Custom Posts
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium">
              <Settings className="h-4 w-4" /> Site Settings
            </Link>
            <a href="/api/news?q=Pakistan" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium">
              <Activity className="h-4 w-4" /> Test Fetch API
            </a>
          </nav>
        </div>
      </aside>
      
      <main className="md:col-span-3">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/posts" element={<AdminPosts />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
}
