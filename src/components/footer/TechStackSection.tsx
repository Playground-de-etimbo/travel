import { ExternalLink } from 'lucide-react';

interface Technology {
  name: string;
  description: string;
  url: string;
  icon: string; // Emoji
  category: 'core' | 'ui' | 'api';
}

const technologies: Technology[] = [
  // Core Stack
  { name: 'React', description: 'UI framework', url: 'https://react.dev', icon: '⚛️', category: 'core' },
  { name: 'TypeScript', description: 'Type-safe JavaScript', url: 'https://www.typescriptlang.org', icon: '📘', category: 'core' },
  { name: 'Vite', description: 'Build tool', url: 'https://vitejs.dev', icon: '⚡', category: 'core' },
  { name: 'Tailwind CSS v4', description: 'Utility-first styling', url: 'https://tailwindcss.com', icon: '🎨', category: 'core' },

  // UI Libraries
  { name: 'shadcn/ui', description: 'Component library', url: 'https://ui.shadcn.com', icon: '🎯', category: 'ui' },
  { name: 'react-simple-maps', description: 'Interactive maps', url: 'https://www.react-simple-maps.io', icon: '🗺️', category: 'ui' },

  // External APIs
  { name: 'Unsplash API', description: 'Country images', url: 'https://unsplash.com/developers', icon: '📸', category: 'api' },
  { name: 'OpenAI API', description: 'AI recommendations', url: 'https://platform.openai.com/docs', icon: '🤖', category: 'api' },
  { name: 'ipwhois.app', description: 'Geolocation', url: 'https://ipwhois.app', icon: '🌍', category: 'api' },
];

export function TechStackSection() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <span className="eyebrow-builtwith text-sm font-semibold uppercase tracking-wider block mb-3">
          Open Source & Proud
        </span>
        <h3 className="text-4xl font-extrabold mb-3 tracking-tight leading-tight text-foreground">
          Built With ❤️
        </h3>
        <p className="text-base text-muted-foreground max-w-xl">
          Crafted with the finest open-source tools and a passion for travel technology
        </p>
      </div>

      {/* Tech Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {technologies.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 rounded-lg border-2 border-border bg-card text-card-foreground hover:border-accent/50 hover:shadow-md transition-all duration-200"
          >
            {/* Content */}
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">
                {tech.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-semibold text-base truncate">
                    {tech.name}
                  </h4>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-accent transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Unsplash attribution */}
      <p className="mt-4 text-xs text-muted-foreground/80 leading-relaxed">
        Country images are provided via the Unsplash API under the{' '}
        <a
          href="https://unsplash.com/license"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Unsplash License
        </a>
        . Copyright remains with each photographer, and image usage credits Unsplash and the
        original photographer.
      </p>
    </div>
  );
}
