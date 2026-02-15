import Link from "next/link";
import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-edge">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-text-primary flex items-center justify-center">
              <Zap className="size-3.5 text-text-inverted" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Stepwise</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-sm font-medium text-text-inverted bg-text-primary hover:bg-text-primary/90 rounded-md transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
