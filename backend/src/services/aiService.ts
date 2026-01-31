import { ChatGroq } from '@langchain/groq';
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { Message } from '../types/chat';

// Get from process.env at runtime, not at module load time
function getGroqApiKey(): string {
    return process.env.GROQ_API_KEY || '';
}

function getGroqModel(): string {
    return process.env.GROQ_MODEL || 'meta-llama/llama-3.2-3b-preview';
}

const DEFAULT_SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable AI assistant. 
Your goal is to provide clear, accurate, and concise responses to user questions.
Be conversational and engaging while maintaining professionalism.
If you're unsure about something, acknowledge it honestly.`;

// Lazy initialization to avoid errors when API key is not set
let modelInstance: ChatGroq | null = null;
let namingModelInstance: ChatGroq | null = null;

function getModel(): ChatGroq {
    if (!modelInstance) {
        const apiKey = getGroqApiKey();
        if (!apiKey) {
            throw new Error('Groq API key is not configured');
        }
        modelInstance = new ChatGroq({
            apiKey: apiKey,
            model: getGroqModel(),
            temperature: 0.7,
            maxTokens: 2048,
        });
    }
    return modelInstance;
}

function getNamingModel(): ChatGroq {
    if (!namingModelInstance) {
        const apiKey = getGroqApiKey();
        if (!apiKey) {
            throw new Error('Groq API key is not configured');
        }
        namingModelInstance = new ChatGroq({
            apiKey: apiKey,
            model: getGroqModel(),
            temperature: 0.3,
            maxTokens: 50,
        });
    }
    return namingModelInstance;
}

function convertToLangChainMessages(messages: Message[], includeSystemPrompt = true): BaseMessage[] {
    const langChainMessages: BaseMessage[] = [];
    if (includeSystemPrompt) {
        langChainMessages.push(new SystemMessage(DEFAULT_SYSTEM_PROMPT));
    }
    messages.forEach((msg) => {
        if (msg.role === 'user') {
            langChainMessages.push(new HumanMessage(msg.content));
        } else {
            langChainMessages.push(new AIMessage(msg.content));
        }
    });
    return langChainMessages;
}

export async function generateAIResponse(conversationHistory: Message[]): Promise<string> {
    if (!getGroqApiKey()) {
        throw new Error('Groq API key is not configured');
    }
    try {
        const langChainMessages = convertToLangChainMessages(conversationHistory);
        const response = await getModel().invoke(langChainMessages);
        return response.content as string;
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw new Error('Failed to generate AI response. Please try again.');
    }
}

export async function generateConversationTitle(
    firstUserMessage: string,
    firstAIResponse: string
): Promise<string> {
    if (!getGroqApiKey()) {
        return 'New Conversation';
    }
    try {
        const prompt = `Based on this conversation, generate a short title (3-5 words maximum).
Only respond with the title, nothing else.

User: ${firstUserMessage}
Assistant: ${firstAIResponse}

Title:`;
        const response = await getNamingModel().invoke([new HumanMessage(prompt)]);
        let title = (response.content as string).trim();
        title = title.replace(/^["']|["']$/g, '');
        title = title.replace(/^Title:\s*/i, '');
        if (title.length > 50) {
            title = title.substring(0, 47) + '...';
        }
        return title || 'New Conversation';
    } catch (error) {
        console.error('Error generating conversation title:', error);
        return 'New Conversation';
    }
}

export async function* generateAIResponseStream(
    conversationHistory: Message[]
): AsyncGenerator<string, void, unknown> {
    if (!getGroqApiKey()) {
        throw new Error('Groq API key is not configured');
    }
    try {
        const langChainMessages = convertToLangChainMessages(conversationHistory);
        const stream = await getModel().stream(langChainMessages);
        for await (const chunk of stream) {
            yield chunk.content as string;
        }
    } catch (error) {
        console.error('Error streaming AI response:', error);
        throw new Error('Failed to stream AI response. Please try again.');
    }
}
