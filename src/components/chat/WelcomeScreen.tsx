import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { Send, Paperclip, Moon, Sun, Download, Linkedin, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getIntroduction, SOCIAL_LINKS } from '@/config/greetings';
import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/components/ui/sonner';

interface WelcomeScreenProps {
  onExampleClick?: (message: string) => void;
  onSend: (message: string) => void;
  loading: boolean;
}

export function WelcomeScreen({ onExampleClick, onSend, loading }: WelcomeScreenProps) {
  const [message, setMessage] = useState('');
  const [intro] = useState(() => getIntroduction());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !loading) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownloadCV = () => {
    // Create a link to download the CV
    const link = document.createElement('a');
    link.href = '/cv.pdf'; // CV should be placed in the public folder
    link.download = 'Prajwal_Khairnar_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CV downloaded!', {
      description: 'Your CV has been downloaded successfully.',
    });
  };

  const handleLinkedInClick = () => {
    window.open(SOCIAL_LINKS.linkedin, '_blank');
  };

  const handleGitHubClick = () => {
    window.open(SOCIAL_LINKS.github, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${SOCIAL_LINKS.email}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Download CV and Theme toggle in top right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={handleDownloadCV}
          className="shrink-0 hover:bg-muted hover:text-foreground gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download CV</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="shrink-0 hover:bg-muted hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="max-w-2xl w-full space-y-6 text-center">
        {/* Animated Logo */}
        <div className="flex justify-center">
          <AnimatedLogo />
        </div>

        {/* Introduction */}
        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-foreground">
            {intro.name}
          </h2>
          <p className="text-lg text-muted-foreground">
            {intro.title}
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkedInClick}
              className="gap-2 hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGitHubClick}
              className="gap-2 hover:bg-[#333] hover:text-white hover:border-[#333] dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailClick}
              className="gap-2 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
          </div>
        </div>

        {/* Message Input - integrated into welcome screen without border-top */}
        <div className="pt-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-muted/50 rounded-2xl border border-border/50 p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me something.."
                disabled={loading}
                className={cn(
                  "flex-1 min-h-[120px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 text-base",
                  loading && "opacity-50 cursor-not-allowed"
                )}
                rows={1}
              />
              <div className="flex items-center gap-1 pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  disabled
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className={cn(
                    "h-9 w-9 rounded-xl transition-all",
                    message.trim()
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
