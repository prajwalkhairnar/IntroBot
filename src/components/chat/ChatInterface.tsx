import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { WelcomeScreen } from './WelcomeScreen';
import { useChat } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Download, FileDown, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportConversation } from '@/lib/exportConversation';
import { toast } from '@/components/ui/sonner';
import { SidebarTrigger } from '@/components/ui/sidebar';


interface ChatInterfaceProps {
  conversationId: string | null;
  conversationTitle?: string;
  onMessageSent?: (preview: string, messageCount: number) => void;
  onFirstMessage?: (content: string) => Promise<string>;
  onConversationNamed?: (title: string) => void;
}

export function ChatInterface({
  conversationId,
  conversationTitle,
  onMessageSent,
  onFirstMessage,
  onConversationNamed,
}: ChatInterfaceProps) {
  const { messages, loading, sendMessage } = useChat(conversationId, onConversationNamed);
  const { theme, toggleTheme } = useTheme();

  // Transition state management
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();

  // Update welcome screen visibility based on messages
  useEffect(() => {
    if (messages.length > 0) {
      // Start transition when first message arrives
      if (showWelcome && !isTransitioning) {
        setIsTransitioning(true);
        // Wait for fade-out animation to complete before hiding welcome screen
        setTimeout(() => {
          setShowWelcome(false);
          setIsTransitioning(false);
        }, 500); // Match this with CSS transition duration
      }
    } else {
      // Reset to welcome screen when no messages
      setShowWelcome(true);
      setIsTransitioning(false);
    }
  }, [messages.length, showWelcome, isTransitioning]);

  const handleSend = useCallback(async (content: string) => {
    let activeConvId = conversationId;

    // If no conversation, create one first
    if (!activeConvId && onFirstMessage) {
      activeConvId = await onFirstMessage(content);
    }

    if (!activeConvId) return;

    const result = await sendMessage(content, activeConvId);

    if (result && onMessageSent) {
      const preview = content.substring(0, 50) + (content.length > 50 ? '...' : '');
      onMessageSent(preview, messages.length + 2);
    }
  }, [conversationId, onFirstMessage, sendMessage, onMessageSent, messages.length]);

  const handleExampleClick = useCallback((message: string) => {
    handleSend(message);
  }, [handleSend]);

  const handleExport = useCallback(() => {
    if (messages.length > 0) {
      exportConversation(messages, {
        format: 'txt',
        conversationTitle: conversationTitle || 'Conversation',
        includeTimestamps: true,
      });
      toast.success('Conversation exported!', {
        description: 'Your conversation has been downloaded as a text file.',
      });
    } else {
      toast.error('No messages to export', {
        description: 'Start a conversation first to export it.',
      });
    }
  }, [messages, conversationTitle]);

  const handleDownloadCV = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/cv.pdf'; // CV should be placed in the public folder
    link.download = 'Prajwal_Khairnar_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CV downloaded!', {
      description: 'Your CV has been downloaded successfully.',
    });
  }, []);


  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - only show when there are messages */}
      {!showWelcome && (
        <header className="flex items-center gap-1.5 sm:gap-3 p-2 sm:p-4 bg-background/80 backdrop-blur-sm h-14 sm:h-16 animate-fade-in">
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate text-foreground text-sm sm:text-base">
              {conversationTitle || 'New Conversation'}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="shrink-0 hover:bg-muted hover:text-foreground h-9 gap-2"
            title="Export conversation"
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadCV}
            className="shrink-0 hover:bg-muted hover:text-foreground h-9 gap-2"
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
        </header>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {showWelcome ? (
          <div
            className={`flex-1 flex flex-col transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
          >
            <WelcomeScreen
              onExampleClick={handleExampleClick}
              onSend={handleSend}
              loading={loading}
            />
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col min-h-0 animate-fade-in-up"
          >
            <MessageList messages={messages} loading={loading} />
          </div>
        )}
      </div>

      {/* Input - only show when NOT on welcome screen */}
      {!showWelcome && (
        <div className="animate-fade-in">
          <MessageInput
            onSend={handleSend}
            disabled={loading}
            placeholder="Reply..."
          />
        </div>
      )}

    </div>
  );
}
