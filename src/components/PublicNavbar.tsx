import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Menu, X, Compass } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { setTab, setShowOnboardingModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      // Dynamic active section detection based on viewport scroll position
      const sections = ['how-it-works', 'signature-features', 'featured-opportunities', 'why-grantly'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 250) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'signature-features', label: 'Features' },
    { id: 'featured-opportunities', label: 'Opportunities' },
    { id: 'why-grantly', label: 'Why GRANTLY' },
  ];

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300 animate-in fade-in slide-in-from-top-3">
      {/* Floating Pill Container with soft blue border and subtle shadow */}
      <div
        className={`w-full rounded-full border px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl border-blue-200/90 shadow-[0_12px_36px_rgb(65,105,225,0.09)]'
            : 'bg-white/90 backdrop-blur-xl border-blue-100 shadow-[0_6px_24px_rgb(65,105,225,0.05)]'
        }`}
      >
        {/* Brand Zone: Iridescent Logo Mark & Wordmark */}
        <button
          onClick={() => {
            setActiveSection('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1] rounded-full p-1 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          aria-label="GRANTLY Homepage"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#4169E1] via-[#5B54E0] to-[#7664D8] flex items-center justify-center shadow-md shadow-[#4169E1]/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <span className="font-black text-white text-base sm:text-lg tracking-wider font-['Space_Grotesk'] leading-none">
              G
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-['Space_Grotesk'] text-[#172554]">
              GRANTLY
            </span>
            <span className="hidden xl:inline-block text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-[#EAF1FF] text-[#4169E1] border border-blue-200/60">
              Scholarship OS
            </span>
          </div>
        </button>

        {/* Center Pill Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-0.5 lg:gap-1.5 p-1 rounded-full bg-[#F4F7FF] border border-blue-100 shrink-0"
          aria-label="Public Marketing Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-2.5 lg:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#EAF1FF] text-[#4169E1] font-bold shadow-2xs'
                    : 'text-[#506184] hover:text-[#4169E1] hover:bg-[#EAF1FF]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Catalog Pill Link */}
          <button
            onClick={() => setTab('discover')}
            className="px-2.5 lg:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap text-[#4169E1] hover:text-[#172554] hover:bg-[#EAF1FF] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#4169E1]" />
            <span>Catalog</span>
          </button>
        </nav>

        {/* Right CTA Actions: Pill Buttons with Soft Blue Shadows & Tactile Feedback */}
        <div className="hidden sm:flex items-center gap-1.5 lg:gap-2.5 shrink-0">
          {/* Secondary CTA: Sign In */}
          <button
            onClick={() => setTab('dashboard')}
            className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs font-semibold text-[#172554] hover:text-[#4169E1] hover:bg-[#EAF1FF] border border-blue-200/70 hover:border-[#4169E1]/40 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            Sign In
          </button>

          {/* Primary CTA: Find My Scholarships */}
          <button
            onClick={() => setTab('dashboard')}
            className="px-3.5 lg:px-5 py-1.5 lg:py-2 rounded-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] hover:brightness-105 text-white text-xs font-bold shadow-md shadow-[#4169E1]/25 hover:shadow-lg hover:shadow-[#4169E1]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out flex items-center gap-1.5 group shrink-0"
          >
            <span className="hidden lg:inline">Find My Scholarships</span>
            <span className="lg:hidden">Find Grants</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex sm:hidden items-center gap-2 shrink-0">
          <button
            onClick={() => setTab('dashboard')}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            Explore
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#172554] hover:text-[#4169E1] hover:bg-[#EAF1FF] transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1]"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu: Floating Rounded Card */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-3xl bg-white/98 backdrop-blur-2xl border border-blue-100 shadow-[0_20px_50px_rgb(65,105,225,0.12)] p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left px-4 py-2.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-[#EAF1FF] text-[#4169E1] font-bold'
                    : 'text-[#506184] hover:text-[#4169E1] hover:bg-[#EAF1FF]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTab('discover');
              }}
              className="text-left px-4 py-2.5 text-xs font-semibold rounded-full text-[#4169E1] hover:bg-[#EAF1FF] flex items-center gap-2 transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-[#4169E1]" />
              <span>Scholarship Catalog (12)</span>
            </button>
          </div>

          <div className="pt-3 border-t border-blue-50 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTab('dashboard');
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#4169E1] to-[#7664D8] text-white text-xs font-bold text-center shadow-md shadow-[#4169E1]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Find My Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowOnboardingModal(true);
              }}
              className="w-full py-2.5 rounded-full bg-[#F4F7FF] hover:bg-[#EAF1FF] text-[#172554] hover:text-[#4169E1] text-xs font-semibold text-center border border-blue-200/70 transition-all active:scale-[0.98]"
            >
              Profile Onboarding Wizard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
