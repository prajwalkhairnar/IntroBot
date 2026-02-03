# Sidebar Visibility Hotfix

## Issue
Users reported that button text in the sidebar was still not visible, despite previous color adjustments. This is likely due to `sidebar-foreground` variable inheritance or specificity issues in the UI components.

## Solution
Switched all sidebar text elements to use the proven `text-foreground` color class instead of `text-sidebar-foreground`. This ensures that sidebar content uses the main application text color, which is guaranteed to be visible against the background (since sidebar background and main background are very similar in both light and dark modes).

## Changes Made

### 1. `src/components/chat/ConversationSidebar.tsx`
Updated the following elements to use `text-foreground` explicitly:
- **IntroBot Title**: `text-foreground`
- **Sidebar Toggle (Hamburger)**: `text-foreground`
- **New Chat Button**: `text-foreground`
- **Feedback Button**: `text-foreground`
- **Settings Button**: `text-foreground`
- **Conversation Items**: `text-foreground`

### 2. `src/components/ui/sidebar.tsx`
- Updated `SidebarGroupLabel` (Date headers) to use `text-foreground/70` instead of `text-sidebar-foreground/70`.

## Verification
- Text should now match the visibility of the rest of the application.
- Icons and labels should be clearly visible in both Light and Dark modes.
- Hover states remain visually distinct (`hover:bg-muted`).
