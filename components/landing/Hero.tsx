'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-(--color-primary) rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-(--color-accent) rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--color-surface) border border-(--color-border) mb-8">
            <span className="w-2 h-2 rounded-full bg-(--color-accent) animate-pulse" />
            <span className="text-sm text-(--color-text-secondary)">
              Transform screenshots into interactive demos
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-(--color-text-primary) mb-6 glow-text"
          >
            Create Interactive
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-(--color-primary) to-(--color-accent)">
              Product Demos
            </span>
            <br />
            Without Recording
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-(--color-text-secondary) mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Transform static screenshots into engaging, clickable walkthroughs.
            Add hotspots, tooltips, and guided flows—no video editing required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-(--color-text-muted) text-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-(--color-accent)" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-(--color-accent)" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-(--color-accent)" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free forever plan</span>
            </div>
          </motion.div>

          {/* Floating demo preview mockup */}
          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary) to-(--color-accent) opacity-20 blur-3xl rounded-2xl" />
              
              {/* Mockup placeholder */}
              <div className="relative bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-(--color-surface-elevated) to-(--color-surface) flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-(--color-primary) opacity-20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-(--color-text-muted)">Interactive Demo Preview</p>
                  </div>
                </div>
                
                {/* Simulated hotspot indicators */}
                <div className="absolute top-1/4 left-1/3 w-12 h-12 border-2 border-(--color-primary) rounded-full animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border-2 border-(--color-accent) rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg className="w-6 h-6 text-(--color-text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
