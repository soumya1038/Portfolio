import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';

function Navbar({ showAchievements = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navOffset = 96;
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const scrollWithOffset = (element) => {
    const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      scrollWithOffset(element);
      setIsMenuOpen(false);
      return;
    }

    if (location.pathname !== '/' && location.pathname !== '/portfolio') {
      navigate(`/?section=${sectionId}`);
      setIsMenuOpen(false);
      return;
    }

    navigate(`/?section=${sectionId}`);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="max-w-6xl mx-auto glass rounded-2xl">
          <div className="flex justify-between items-center h-16 px-4 sm:px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white font-display text-base shadow-soft">
                PF
              </span>
              <span className="tracking-tight">Portfolio</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('skills')}
                className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors"
              >
                Skills
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors"
              >
                Projects
              </button>
              {showAchievements && (
                <button
                  onClick={() => scrollToSection('achievements')}
                  className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors"
                >
                  Achievements
                </button>
              )}
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors"
              >
                Contact
              </button>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors"
                aria-label="Toggle dark mode"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
                <span className="hidden lg:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:text-primary-700"
                aria-label="Toggle dark mode"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-700"
                aria-label="Toggle navigation"
              >
                {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/60 px-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection('skills')}
                  className="text-gray-600 hover:text-primary-700 transition-colors text-left"
                >
                  Skills
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="text-gray-600 hover:text-primary-700 transition-colors text-left"
                >
                  Projects
                </button>
                {showAchievements && (
                  <button
                    onClick={() => scrollToSection('achievements')}
                    className="text-gray-600 hover:text-primary-700 transition-colors text-left"
                  >
                    Achievements
                  </button>
                )}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-600 hover:text-primary-700 transition-colors text-left"
                >
                  Contact
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors text-left"
                >
                  {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
