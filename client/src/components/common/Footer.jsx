import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
          <ScrollReveal animation="fade-right" duration={1200} delay={100}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white font-display text-base">
                  PF
                </span>
                <p className="text-lg font-semibold text-white">Portfolio</p>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                Designed to showcase high-impact work with a clean, futuristic touch.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-left" duration={1200} delay={200}>
            <div className="flex flex-wrap gap-3">
              <Link to="/?section=projects" className="text-sm hover:text-white transition-colors">Projects</Link>
              <Link to="/?section=skills" className="text-sm hover:text-white transition-colors">Skills</Link>
              <Link to="/?section=contact" className="text-sm hover:text-white transition-colors">Contact</Link>
            </div>
          </ScrollReveal>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 text-sm text-gray-400">
          <ScrollReveal animation="fade-right" duration={1200} delay={300}>
            <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" duration={1200} delay={350}>
            <p>Built with React, Tailwind CSS, and a whole lot of care.</p>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
