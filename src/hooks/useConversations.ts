import { useState, useCallback, useEffect } from 'react';
import { Conversation } from '@/types/chat';
import * as supabaseService from '@/services/supabaseService';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (title?: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const conversationTitle = title || 'New Conversation';
      const id = await supabaseService.createConversation(conversationTitle);

      // Add to local state
      const newConversation: Conversation = {
        id,
        title: conversationTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        messageCount: 0,
      };

      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(id);
      return id;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await supabaseService.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation');
    } finally {
      setLoading(false);
    }
  }, [activeConversationId]);

  const updateConversationTitle = useCallback(async (id: string, title: string) => {
    try {
      await supabaseService.updateConversation(id, { title });
      setConversations(prev =>
        prev.map(c => c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c)
      );
    } catch (err) {
      console.error('Failed to update conversation title:', err);
      setError('Failed to update conversation title');
    }
  }, []);

  const updateConversationPreview = useCallback(async (id: string, preview: string, messageCount: number) => {
    try {
      await supabaseService.updateConversation(id, {
        lastMessagePreview: preview,
        messageCount
      });
      setConversations(prev =>
        prev.map(c => c.id === id ? {
          ...c,
          lastMessagePreview: preview,
          messageCount,
          updatedAt: new Date().toISOString()
        } : c)
      );
    } catch (err) {
      console.error('Failed to update conversation preview:', err);
    }
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  return {
    conversations,
    activeConversationId,
    activeConversation,
    loading,
    error,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    updateConversationPreview,
  };
}

