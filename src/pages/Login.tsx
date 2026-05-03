import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export function Login() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  return (
    <div className="max-w-md mx-auto py-20">
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-serif">Welcome to Pakistan Briefing</CardTitle>
          <CardDescription>Sign in to save your favorite news, manage your profile, and receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={signInWithGoogle} size="lg" className="w-full font-medium" disabled={loading}>
             <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
