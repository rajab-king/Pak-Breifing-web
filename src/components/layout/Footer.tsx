import { Link } from 'react-router-dom';
import { Globe, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <span className="font-serif font-black text-xl tracking-tighter uppercase"><span className="text-primary mr-1">Pakistan</span> Briefing</span>
            </Link>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4 leading-relaxed font-bold">
              Your trusted source for global and Pakistan trending news, delivering fast, accurate, and unbiased journalism.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif font-bold italic mb-4 border-b border-border pb-2 text-primary">Sections</h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link to="/category/pakistan" className="hover:text-primary transition-colors">Pakistan</Link></li>
              <li><Link to="/category/world" className="hover:text-primary transition-colors">World</Link></li>
              <li><Link to="/category/politics" className="hover:text-primary transition-colors">Politics</Link></li>
              <li><Link to="/category/business" className="hover:text-primary transition-colors">Business</Link></li>
              <li><Link to="/category/technology" className="hover:text-primary transition-colors">Technology</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif font-bold italic mb-4 border-b border-border pb-2 text-primary">Company</h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold italic mb-4 border-b border-border pb-2 text-primary">Subscribe</h3>
            <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-4">Get the latest news highlights directly in your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required
                className="px-3 py-2 bg-background border rounded-none text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full"
              />
              <button type="submit" className="bg-primary text-primary-foreground font-bold uppercase py-2 rounded-none hover:bg-primary/90 transition-colors text-[10px] tracking-widest">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pakistan Briefing Media Group. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary">Terms</Link>
            <Link to="#" className="hover:text-primary">Cookies</Link>
            <span className="flex items-center gap-2 border-l border-border pl-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Network Status: Normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
