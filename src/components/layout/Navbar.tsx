import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserCircle, Menu, X, Globe, Bookmark } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { getBreakingNewsHeadline } from '../../lib/newsService';
import { motion, AnimatePresence } from 'motion/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ModeToggle } from '../mode-toggle';

const CATEGORIES = ['Pakistan', 'World', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Health'];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [breakingNews, setBreakingNews] = useState<string | null>(null);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getBreakingNewsHeadline().then(setBreakingNews);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) navigate(`/search?q=${query}`);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-t-4 border-t-primary ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' : 'bg-background border-b'}`}>
        {/* Breaking News Ticker */}
        {breakingNews && (
          <div className="bg-slate-900 text-white py-1.5 px-4 overflow-hidden relative flex items-center">
            <span className="bg-primary text-[10px] font-black uppercase tracking-tighter px-3 py-1 mr-4 z-10 shrink-0">Breaking News</span>
            <div className="flex-1 overflow-hidden relative">
              <motion.div 
                className="whitespace-nowrap text-sm italic font-serif text-slate-300"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              >
                {breakingNews} &nbsp;&nbsp;&nbsp;&nbsp; {breakingNews} &nbsp;&nbsp;&nbsp;&nbsp; {breakingNews}
              </motion.div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-serif font-black text-xl md:text-3xl tracking-tighter uppercase">
                  <span className="text-primary mr-1.5">Pakistan</span>
                  Briefing
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-2">
              {CATEGORIES.slice(0, 5).map((category) => (
                <Link key={category} to={`/category/${category.toLowerCase()}`} className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  {category}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary")}>
                  More
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {CATEGORIES.slice(5).map((category) => (
                    <DropdownMenuItem key={category} className="text-[11px] font-bold uppercase tracking-widest p-0">
                      <Link to={`/category/${category.toLowerCase()}`} className="w-full h-full px-1.5 py-1 block">{category}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative flex items-center bg-muted/50 rounded-full px-3 py-0.5">
                <div className="w-2.5 h-2.5 bg-muted-foreground/50 rounded-full mr-2"></div>
                <input
                  name="q"
                  type="search"
                  placeholder="Search news..."
                  className="bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none w-32 focus:w-48 transition-all py-1.5"
                />
              </form>
              
              <div className="flex items-center">
                 <ModeToggle />
              </div>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs hover:bg-slate-800")}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <span className="uppercase">{user.email?.charAt(0) || "U"}</span>
                      )}
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-none border-border">
                    <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest p-0"><Link to="/profile" className="w-full h-full px-1.5 py-1 block">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest p-0"><Link to="/bookmarks" className="w-full h-full px-1.5 py-1 block">Bookmarks</Link></DropdownMenuItem>
                    {isAdmin && <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest text-primary p-0"><Link to="/admin" className="w-full h-full px-1.5 py-1 block">Admin Dashboard</Link></DropdownMenuItem>}
                    <DropdownMenuItem onClick={logout} className="text-[11px] font-bold uppercase tracking-widest text-destructive focus:bg-destructive/10 cursor-pointer">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="rounded-none font-bold uppercase tracking-widest text-[10px]">Sign In</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[100px] left-0 right-0 bg-background border-b shadow-lg z-40 p-4 pb-6"
          >
            <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                name="q"
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
            <nav className="flex flex-col space-y-3">
              {CATEGORIES.map((category) => (
                <Link 
                  key={category} 
                  to={`/category/${category.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-1"
                >
                  {category}
                </Link>
              ))}
              <div className="my-2 border-t pt-4"></div>
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium py-1 text-foreground"><UserCircle className="h-4 w-4"/> Profile</Link>
                  <Link to="/bookmarks" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium py-1 text-foreground"><Bookmark className="h-4 w-4"/> Bookmarks</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium py-1 text-primary">Admin Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-base font-medium py-1 text-destructive">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium py-1 text-primary">Sign In</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
