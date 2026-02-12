import { useEffect, useRef, useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { StaticLogo } from './StaticLogo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const isMessageRecent = (message: Message) => {
  try {
    const created = new Date(message.createdAt).getTime();
    const now = Date.now();
    // Consider message recent if created within last 20 seconds
    // allowing for some clock drift or slight delays
    return (now - created) < 20000;
  } catch (e) {
    return false;
  }
};

function MessageBubble({ message, isLast, onUpdate }: { message: Message; isLast: boolean; onUpdate?: () => void }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  // Track if we have already animated to prevent re-animation on re-renders
  const hasAnimatedRef = useRef(false);

  // Determine if we should animate this message
  // It must be:
  // 1. Not a user message (Assistant only)
  // 2. The last message in the list
  // 3. Recently created (to avoid animating history on refresh)
  // 4. Not previously animated
  const shouldAnimate = !isUser && isLast && isMessageRecent(message) && !hasAnimatedRef.current;

  const [displayedContent, setDisplayedContent] = useState(shouldAnimate ? '' : message.content);
  const [isTyping, setIsTyping] = useState(shouldAnimate);

  useEffect(() => {
    // If we shouldn't animate, just show content immediately
    if (!shouldAnimate) {
      if (!isTyping) {
        setDisplayedContent(message.content);
      }
      return;
    }

    hasAnimatedRef.current = true;
    setIsTyping(true);
    setDisplayedContent('');

    // Split content while preserving spaces and structure
    // We split by whitespace but keep the delimiters
    const words = message.content.split(/(\s+)/);
    let index = 0;
    let currentText = '';

    const intervalId = setInterval(() => {
      if (index < words.length) {
        currentText += words[index];
        setDisplayedContent(currentText);
        index++;
        onUpdate?.();
      } else {
        setIsTyping(false);
        clearInterval(intervalId);
      }
    }, 20); // 20ms per word chunk for smooth but fast streaming

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run effect once on mount per message instance

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-4 px-4 py-6 max-w-4xl mx-auto",
        isUser ? "bg-transparent justify-end" : "bg-muted/30"
      )}
    >
      {/* Avatar - Left for Assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-transparent">
          <StaticLogo size={32} />
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "flex-1 min-w-0 space-y-2",
        isUser ? "max-w-2xl" : ""
      )}>
        <div className="flex items-center gap-2">
          {!isUser && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {import.meta.env.VITE_ASSISTANT_NAME || 'Assistant'}
            </p>
          )}

          <div className="flex-1" />

          {isUser && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
              You
            </p>
          )}

          {!isUser && !isTyping && (
            <button
              onClick={handleCopy}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground",
              )}
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {isUser ? (
          // User messages - simple text rendering
          <div className="prose prose-sm dark:prose-invert max-w-none text-right">
            {message.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-2 last:mb-0 text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          // Agent messages - markdown rendering
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for code blocks
                code: ({ node, inline, className, children, ...props }: any) => {
                  return inline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={cn("block bg-muted p-4 rounded-lg overflow-x-auto", className)} {...props}>
                      {children}
                    </code>
                  );
                },
                // Custom styling for links
                a: ({ node, children, ...props }: any) => (
                  <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                ),
              }}
            >
              {displayedContent || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Avatar - Right for User */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4 px-4 py-6 max-w-4xl mx-auto bg-muted/30">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-transparent">
        <StaticLogo size={32} />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {import.meta.env.VITE_ASSISTANT_NAME || 'Assistant'}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export function MessageList({ messages, loading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return null;
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="divide-y divide-border/50">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
            onUpdate={index === messages.length - 1 ? scrollToBottom : undefined}
          />
        ))}
        {loading && <TypingIndicator />}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
