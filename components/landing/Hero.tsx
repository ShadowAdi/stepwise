import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue-subtle border border-accent-blue/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            <span className="text-sm font-medium text-accent-blue">
              Transform screenshots into interactive demos
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 tracking-tight">
            Create Interactive Product Demos Without Recording
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform static screenshots into engaging, clickable walkthroughs.
            Add hotspots, tooltips, and guided flows—no video editing required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-8 py-3 text-base font-medium text-brand-foreground bg-brand hover:bg-accent-blue-hover rounded-lg transition-colors shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              href="#demo"
              className="px-8 py-3 text-base font-medium text-text-primary bg-surface hover:bg-surface-secondary border border-edge rounded-lg transition-colors"
            >
              Watch Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-text-secondary text-sm">
            {["No credit card required", "5-minute setup", "Free forever plan"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
