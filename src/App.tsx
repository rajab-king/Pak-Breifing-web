import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Home } from './pages/Home';
import { Article } from './pages/Article';
import { Category } from './pages/Category';
import { Search } from './pages/Search';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Bookmarks } from './pages/Bookmarks';
import { About, Contact, Privacy } from './pages/StaticPages';
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news/:id" element={<Article />} />
                <Route path="/category/:name" element={<Category />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
