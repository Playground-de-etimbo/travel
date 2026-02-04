import { Sparkles, Linkedin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PortfolioFooter = () => {
  return (
    <footer className="bg-muted border-t-2 border-border py-8">
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">I am Timothy. I made a thing.</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This is a little app I built with a passion for travel whilst taking a mid career break.
            </p>
            <a
              href="https://www.linkedin.com/in/ticonnell/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button
                variant="default"
                size="lg"
                className="w-full hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Connect on LinkedIn
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 Timothy Connell. All rights reserved.
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">I am Timothy. I made a thing.</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This is a little app I built with a passion for travel whilst taking a mid career break.
            </p>
            <a
              href="https://www.linkedin.com/in/ticonnell/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="default"
                size="lg"
                className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Connect on LinkedIn
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>

          {/* Copyright - Bottom Left */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground">
              © 2026 Timothy Connell. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
