import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, MoreHorizontal, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Conversation } from '@/types/chat';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FeedbackDialog } from '@/components/feedback/FeedbackDialog';


interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  userId?: string;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  userId,
}: ConversationSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conv) => {
    const dateLabel = formatDate(conv.updatedAt);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        {/* Title and Toggle - aligned with chat header */}
        <div className="flex items-center justify-between gap-3 px-4 h-16">
          <button
            onClick={onNewChat}
            className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden hover:opacity-80 transition-opacity cursor-pointer"
          >
            IntroBot
          </button>
          <SidebarTrigger className="ml-auto hover:bg-muted hover:text-sidebar-foreground" />
        </div>

        {/* New Chat Button */}
        <div className="px-2 pb-2 pt-2">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onNewChat}
                    variant="ghost"
                    size="icon"
                    className="w-full h-10 hover:bg-muted hover:text-sidebar-foreground"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>New Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={onNewChat}
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-muted hover:text-sidebar-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>New Chat</span>
            </Button>
          )}
        </div>

        {/* Feedback Button */}
        <div className="px-2 pb-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setFeedbackOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="w-full h-10 hover:bg-muted hover:text-sidebar-foreground"
                  >
                    <Star className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Feedback</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={() => setFeedbackOpen(true)}
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-muted hover:text-sidebar-foreground"
              size="sm"
            >
              <Star className="h-4 w-4 shrink-0" />
              <span>Feedback</span>
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(groupedConversations).map(([dateLabel, convs]) => (
          <SidebarGroup key={dateLabel}>
            <SidebarGroupLabel>{dateLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {convs.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectConversation(conversation.id)}
                      isActive={activeConversationId === conversation.id}
                      tooltip={conversation.title}
                      className="group-data-[collapsible=icon]:hidden hover:bg-muted hover:text-sidebar-foreground"
                    >
                      <span className="truncate text-sm font-medium">
                        {conversation.title}
                      </span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover className="group-data-[collapsible=icon]:hidden">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="hover:bg-muted focus:bg-muted hover:text-sidebar-foreground focus:text-sidebar-foreground cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {conversations.length === 0 && !isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-3 py-8 text-center text-sidebar-foreground/60">
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        {/* Admin/Settings Button */}
        <div className="px-2 py-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate('/settings')}
                    variant="ghost"
                    size="icon"
                    className="w-full h-10 hover:bg-muted hover:text-sidebar-foreground"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-muted hover:text-sidebar-foreground"
              size="sm"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </Button>
          )}
        </div>
      </SidebarFooter>

      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        userId={userId}
      />

    </Sidebar>
  );
}
