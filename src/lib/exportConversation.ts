import { Message } from '@/types/chat';

export type ExportFormat = 'txt' | 'json' | 'md';

interface ExportOptions {
    format: ExportFormat;
    conversationTitle?: string;
    includeTimestamps?: boolean;
}

/**
 * Exports a conversation to a downloadable file
 */
export function exportConversation(
    messages: Message[],
    options: ExportOptions = { format: 'txt', includeTimestamps: true }
): void {
    const { format, conversationTitle = 'Conversation', includeTimestamps = true } = options;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
        case 'json':
            content = JSON.stringify(messages, null, 2);
            filename = `${sanitizeFilename(conversationTitle)}.json`;
            mimeType = 'application/json';
            break;

        case 'md':
            content = formatAsMarkdown(messages, conversationTitle, includeTimestamps);
            filename = `${sanitizeFilename(conversationTitle)}.md`;
            mimeType = 'text/markdown';
            break;

        case 'txt':
        default:
            content = formatAsText(messages, conversationTitle, includeTimestamps);
            filename = `${sanitizeFilename(conversationTitle)}.txt`;
            mimeType = 'text/plain';
            break;
    }

    downloadFile(content, filename, mimeType);
}

/**
 * Formats messages as plain text
 */
function formatAsText(messages: Message[], title: string, includeTimestamps: boolean): string {
    const lines: string[] = [];

    lines.push(`=== ${title} ===`);
    lines.push(`Exported: ${new Date().toLocaleString()}`);
    lines.push(`Total Messages: ${messages.length}`);
    lines.push('');
    lines.push('='.repeat(50));
    lines.push('');

    messages.forEach((msg, index) => {
        const role = msg.role === 'user' ? 'You' : 'Praj';
        const timestamp = includeTimestamps ? ` [${new Date(msg.createdAt).toLocaleString()}]` : '';

        lines.push(`${role}${timestamp}:`);
        lines.push(msg.content);

        if (index < messages.length - 1) {
            lines.push('');
            lines.push('-'.repeat(50));
            lines.push('');
        }
    });

    return lines.join('\n');
}

/**
 * Formats messages as Markdown
 */
function formatAsMarkdown(messages: Message[], title: string, includeTimestamps: boolean): string {
    const lines: string[] = [];

    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`**Exported:** ${new Date().toLocaleString()}`);
    lines.push(`**Total Messages:** ${messages.length}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    messages.forEach((msg) => {
        const role = msg.role === 'user' ? '👤 **You**' : '🤖 **Praj**';
        const timestamp = includeTimestamps ? ` *${new Date(msg.createdAt).toLocaleString()}*` : '';

        lines.push(`### ${role}${timestamp}`);
        lines.push('');
        lines.push(msg.content);
        lines.push('');
    });

    return lines.join('\n');
}

/**
 * Sanitizes a filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-z0-9_\-]/gi, '_')
        .replace(/_+/g, '_')
        .substring(0, 100);
}

/**
 * Triggers a file download in the browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
