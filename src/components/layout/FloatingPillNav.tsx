import { useState, useEffect, useCallback, useRef } from 'react';
import { Map, Compass, Stamp, Info } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'map-hero', label: 'Map', icon: Map },
  { id: 'recommendations', label: 'Picks', icon: Compass },
  { id: 'passport', label: 'Postcard', icon: Stamp },
  { id: 'about', label: 'About', icon: Info },
];

export const FloatingPillNav = () => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [activeSection, setActiveSection] = useState('map-hero');
  const activeSectionRef = useRef('map-hero');

  const handleScroll = useCallback(() => {
    // Show as soon as the user starts scrolling down.
    const shouldShow = window.scrollY > 8;

    if (shouldShow && !visible) {
      setExiting(false);
      setVisible(true);
    } else if (!shouldShow && visible) {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        setExiting(false);
      }, 200);
    }

    // Determine active section
    let current = 'map-hero';
    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          current = item.id;
        }
      }
    }

    if (current !== activeSectionRef.current) {
      activeSectionRef.current = current;
      setActiveSection(current);
    }
  }, [visible]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible && !exiting) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center gap-1 px-2 py-1.5 bg-background/90 backdrop-blur-md border border-border rounded-full shadow-lg ${
          exiting ? 'pill-slide-down' : 'pill-slide-up'
        }`}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
