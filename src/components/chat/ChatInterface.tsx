import { useCallback } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { WelcomeScreen } from './WelcomeScreen';
import { useChat } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Download, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportConversation } from '@/lib/exportConversation';

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
    }
  }, [messages, conversationTitle]);

  const handleDownloadCV = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/cv.pdf'; // CV should be placed in the public folder
    link.download = 'Prajwal_Khairnar_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const showWelcome = messages.length === 0 && !loading;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - only show when there are messages */}
      {!showWelcome && (
        <header className="flex items-center gap-3 p-4 bg-background/80 backdrop-blur-sm h-16">
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate text-foreground">
              {conversationTitle || 'New Conversation'}
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleExport}
            className="shrink-0 hover:bg-muted hover:text-foreground gap-2"
            title="Export conversation"
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleDownloadCV}
            className="shrink-0 hover:bg-muted hover:text-foreground gap-2"
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {showWelcome ? (
          <WelcomeScreen
            onExampleClick={handleExampleClick}
            onSend={handleSend}
            loading={loading}
          />
        ) : (
          <MessageList messages={messages} loading={loading} />
        )}
      </div>

      {/* Input - only show when NOT on welcome screen */}
      {!showWelcome && (
        <MessageInput
          onSend={handleSend}
          disabled={loading}
          placeholder="Reply..."
        />
      )}
    </div>
  );
}
