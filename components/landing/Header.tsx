'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-(--color-background)/80 backdrop-blur-lg border-b border-(--color-border)"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-(--color-primary) to-(--color-accent) flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <span className="text-xl font-bold text-(--color-text-primary)">Stepwise</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
              Pricing
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
