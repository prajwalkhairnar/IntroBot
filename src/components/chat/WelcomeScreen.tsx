import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { Send, Paperclip, Moon, Sun, Download, Linkedin, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getIntroduction, SOCIAL_LINKS } from '@/config/greetings';
import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/components/ui/sonner';
import { registerInterest } from '@/services/interestService';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface WelcomeScreenProps {
  onExampleClick?: (message: string) => void;
  onSend: (message: string) => void;
  loading: boolean;
}

export function WelcomeScreen({ onExampleClick, onSend, loading }: WelcomeScreenProps) {
  const [message, setMessage] = useState('');
  const [intro] = useState(() => getIntroduction());
  const [interestEmail, setInterestEmail] = useState('');
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
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

  const handleInterestSubmit = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!interestEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!emailRegex.test(interestEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmittingInterest(true);
    const result = await registerInterest({ email: interestEmail });
    setIsSubmittingInterest(false);

    if (result.success) {
      toast.success('Thank you for your interest!', {
        description: 'We\'ll reach out to you soon about your own IntroBot instance.',
      });
      setInterestEmail(''); // Clear the input
    } else {
      toast.error('Registration failed', {
        description: result.error || 'Please try again later.',
      });
    }
  };


  return (
    <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12 relative">
      {/* Download CV and Theme toggle in top right */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadCV}
          className="shrink-0 hover:bg-muted hover:text-foreground h-9 w-9 sm:h-auto sm:w-auto sm:gap-2"
          title="Download CV"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download CV</span>
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

      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 text-center">
        {/* Animated Logo */}
        <div className="flex justify-center">
          <AnimatedLogo />
        </div>

        {/* Introduction */}
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-xl sm:text-2xl font-medium text-foreground">
            {intro.name}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {intro.title}
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkedInClick}
              className="gap-1.5 sm:gap-2 hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-colors text-xs sm:text-sm h-8 sm:h-9"
            >
              <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGitHubClick}
              className="gap-1.5 sm:gap-2 hover:bg-[#333] hover:text-white hover:border-[#333] dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-colors text-xs sm:text-sm h-8 sm:h-9"
            >
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>GitHub</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailClick}
              className="gap-1.5 sm:gap-2 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] transition-colors text-xs sm:text-sm h-8 sm:h-9"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Email</span>
            </Button>
          </div>
        </div>

        {/* Message Input - integrated into welcome screen without border-top */}
        <div className="pt-2 sm:pt-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-1.5 sm:gap-2 bg-muted/50 rounded-2xl border border-border/50 p-1.5 sm:p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me something.."
                disabled={loading}
                className={cn(
                  "flex-1 min-h-[80px] sm:min-h-[120px] max-h-[160px] sm:max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base",
                  loading && "opacity-50 cursor-not-allowed"
                )}
                rows={1}
              />
              <div className="flex items-center gap-0.5 sm:gap-1 pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  disabled
                >
                  <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-xl transition-all",
                    message.trim()
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-1.5 sm:mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>

            {/* Register Interest CTA */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/30">
              <div className="relative mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-center font-semibold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-in fade-in duration-700">
                  Want your own IntroBot?
                </p>
                <div className="absolute inset-0 blur-xl bg-primary/10 -z-10 rounded-full" />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={interestEmail}
                  onChange={(e) => setInterestEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmittingInterest) {
                      handleInterestSubmit();
                    }
                  }}
                  placeholder="Enter your email"
                  disabled={isSubmittingInterest}
                  className={cn(
                    "flex-1 h-9 px-3 py-2 text-xs sm:text-sm rounded-lg",
                    "bg-background border border-border",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "placeholder:text-muted-foreground",
                    "transition-all",
                    isSubmittingInterest && "opacity-50 cursor-not-allowed"
                  )}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInterestSubmit}
                  disabled={isSubmittingInterest || !interestEmail.trim()}
                  className={cn(
                    "h-9 px-4 transition-all hover:bg-muted hover:text-foreground text-xs sm:text-sm whitespace-nowrap",
                    (!interestEmail.trim() || isSubmittingInterest) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmittingInterest ? 'Submitting...' : 'Register Interest'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
