import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { Send, Paperclip, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getRandomGreeting } from '@/config/greetings';
import { useTheme } from '@/hooks/useTheme';

interface WelcomeScreenProps {
  onExampleClick?: (message: string) => void;
  onSend: (message: string) => void;
  loading: boolean;
}

export function WelcomeScreen({ onExampleClick, onSend, loading }: WelcomeScreenProps) {
  const [message, setMessage] = useState('');
  const [greeting] = useState(() => getRandomGreeting());
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

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Theme toggle in top right */}
      <div className="absolute top-4 right-4">
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

        {/* Simple Greeting */}
        <h2 className="text-2xl font-medium text-foreground">
          {greeting}
        </h2>

        {/* Message Input - integrated into welcome screen without border-top */}
        <div className="pt-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-muted/50 rounded-2xl border border-border/50 p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Say your piece.."
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
