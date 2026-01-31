import { useCallback } from 'react';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useConversations } from '@/hooks/useConversations';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const {
    conversations,
    activeConversationId,
    activeConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    updateConversationPreview,
  } = useConversations();

  const handleNewChat = useCallback(() => {
    // Don't create a conversation yet - just show the welcome screen
    // The conversation will be created when the user sends their first message
    selectConversation(null);
  }, [selectConversation]);

  const handleFirstMessage = useCallback(async (content: string) => {
    const title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    const convId = await createConversation(title);
    return convId;
  }, [createConversation]);

  const handleMessageSent = useCallback((preview: string, messageCount: number) => {
    if (activeConversationId) {
      updateConversationPreview(activeConversationId, preview, messageCount);
    }
  }, [activeConversationId, updateConversationPreview]);

  const handleConversationNamed = useCallback((title: string) => {
    if (activeConversationId) {
      updateConversationTitle(activeConversationId, title);
    }
  }, [activeConversationId, updateConversationTitle]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
        />

        <SidebarInset>
          <ChatInterface
            conversationId={activeConversationId}
            conversationTitle={activeConversation?.title}
            onFirstMessage={handleFirstMessage}
            onMessageSent={handleMessageSent}
            onConversationNamed={handleConversationNamed}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
