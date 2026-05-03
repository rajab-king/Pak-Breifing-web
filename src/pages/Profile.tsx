import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { format } from 'date-fns';

export function Profile() {
  const { user, loading, logout, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold font-serif mb-6">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <img 
              src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
              alt="Profile" 
              className="w-24 h-24 rounded-full bg-muted"
            />
            <div>
              <h2 className="text-xl font-bold">{user.displayName || 'No Name'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              {isAdmin && <span className="inline-block mt-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded uppercase">Admin</span>}
            </div>
          </div>
          
          <div className="pt-6 border-t space-y-4">
             <div>
                <span className="text-sm font-medium text-muted-foreground">Account created</span>
                <p>{user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'PPpp') : 'Unknown'}</p>
             </div>
             <div>
                <span className="text-sm font-medium text-muted-foreground">Last sign-in</span>
                <p>{user.metadata.lastSignInTime ? format(new Date(user.metadata.lastSignInTime), 'PPpp') : 'Unknown'}</p>
             </div>
          </div>

          <div className="pt-6 border-t">
            <Button variant="destructive" onClick={logout}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
