import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
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

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6 max-w-4xl mx-auto",
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
        <p className={cn(
          "text-xs font-medium text-muted-foreground uppercase tracking-wide",
          isUser ? "text-right" : ""
        )}>
          {isUser ? 'You' : 'Assistant'}
        </p>

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
              {message.content}
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
          Assistant
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return null;
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="divide-y divide-border/50">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {loading && <TypingIndicator />}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
