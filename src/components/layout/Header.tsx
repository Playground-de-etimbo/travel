import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Travel Planner
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm hover:text-primary transition-colors">
              Directory
            </Link>
            <Link to="/been-to" className="text-sm hover:text-primary transition-colors">
              Been To
            </Link>
            <Link to="/want-to-go" className="text-sm hover:text-primary transition-colors">
              Want To Go
            </Link>
            <Link to="/stats" className="text-sm hover:text-primary transition-colors">
              Stats
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
