import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/chat';
import * as supabaseService from '@/services/supabaseService';
import { generateAIResponse, generateConversationTitle } from '@/services/backendApi';

interface UseChatProps {
  conversationId: string | null;
  onConversationNamed?: (title: string, conversationId?: string) => void;
}

export function useChat(conversationId: string | null, onConversationNamed?: (title: string, conversationId?: string) => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    loadMessages();
  }, [conversationId]);



  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await supabaseService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string, targetConversationId?: string): Promise<{ userMessage: Message; assistantMessage: Message } | null> => {
      const convId = targetConversationId || conversationId;
      if (!convId) return null;

      setLoading(true);
      setError(null);

      try {
        // Create and save user message
        const userMessage = await supabaseService.createMessage(
          convId,
          'user',
          content
        );

        // Add user message to local state immediately
        setMessages((prev) => [...prev, userMessage]);

        // Get conversation history including the new user message
        const conversationHistory = [...messages, userMessage];

        // Generate AI response with full conversation context
        const aiContent = await generateAIResponse(conversationHistory);

        // Create and save assistant message
        const assistantMessage = await supabaseService.createMessage(
          convId,
          'assistant',
          aiContent
        );

        // Add assistant message to local state
        setMessages((prev) => [...prev, assistantMessage]);

        // Auto-generate conversation title at specific checkpoints: 1st, 3rd, 9th, 18th, 27th...
        const userMessageCount = conversationHistory.filter(m => m.role === 'user').length;
        const shouldUpdateTitle = userMessageCount === 1 || userMessageCount === 3 || (userMessageCount > 3 && userMessageCount % 9 === 0);

        if (shouldUpdateTitle && onConversationNamed) {
          // Use the last 5 messages including the new assistant message for context
          const currentHistory = [...conversationHistory, assistantMessage];
          const recentMessages = currentHistory.slice(-5);

          generateConversationTitle(recentMessages)
            .then(title => {
              onConversationNamed(title, convId);
            })
            .catch(err => {
              console.error('Failed to generate conversation title:', err);
            });
        }

        setLoading(false);
        return { userMessage, assistantMessage };
      } catch (err) {
        console.error('Failed to send message:', err);
        setError('Failed to send message. Please try again.');
        setLoading(false);
        return null;
      }
    },
    [conversationId, messages, onConversationNamed]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
