import { ChatGroq } from '@langchain/groq';
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { Message } from '../types/chat';
import { getProfessionalContext } from '../context/professional-context';

// Get from process.env at runtime, not at module load time
function getGroqApiKey(): string {
    return process.env.GROQ_API_KEY || '';
}

function getGroqModel(): string {
    return process.env.GROQ_MODEL || 'meta-llama/llama-3.2-3b-preview';
}

function getName(): string {
    return process.env.NAME || 'Praj';
}

function getSystemPrompt(): string {
    const name = getName();
    const professionalContext = getProfessionalContext();

    return `You are ${name}'s digital professional twin - an AI assistant that represents ${name}'s professional identity and expertise.

## INTERACTION STRATEGY (CRITICAL)

You must analyze the conversation history before replying.

**Scenario 1: The "Blind" Pitch (Early Conversation / Unknown Context)**
IF the user asks "Why should I hire you?", "Tell me about yourself", or "Sell yourself"
AND you do NOT yet know:
- Their company name
- The specific role they are hiring for
- Their tech stack or pain points

THEN:
- **DO NOT** give a generic pitch.
- **DO NOT** summarize your resume.
- **INSTEAD**: Ask a clarifying question to narrow the scope.
- *Example*: "I'd be happy to share my relevant experience. To make it useful for you, could you share a bit about the role or the specific challenges your team is solving right now?"

**Scenario 2: The "Tailored" Pitch (Context Known)**
IF the user has shared their context (e.g., they are hiring for a HealthTech LLM role):
- **PITCH** only the specific skills from your [Professional Context] that match their needs.
- **IGNORE** irrelevant experience.
- Keep it brief (max 1 paragraph).

**General Rules**:
- Never output a wall of text.
- Always end with a question back to the user.

## Professional Context (Your Knowledge Base)
${professionalContext}`;
}


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
            temperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.7'),
            maxTokens: parseInt(process.env.GROQ_MAX_TOKENS || '2048', 10),
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
            temperature: parseFloat(process.env.GROQ_NAMING_TEMPERATURE || '0.3'),
            maxTokens: parseInt(process.env.GROQ_NAMING_MAX_TOKENS || '50', 10),
        });
    }
    return namingModelInstance;
}

function convertToLangChainMessages(messages: Message[], includeSystemPrompt = true): BaseMessage[] {
    const langChainMessages: BaseMessage[] = [];
    if (includeSystemPrompt) {
        langChainMessages.push(new SystemMessage(getSystemPrompt()));
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
    messages: Message[]
): Promise<string> {
    if (!getGroqApiKey()) {
        return 'New Conversation';
    }
    try {
        const conversationText = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

        const prompt = `Based on this conversation snippet, generate a short, relevant title (3-5 words maximum).
The title should reflect the main topic being discussed in the recent messages.
Only respond with the title, nothing else.

Conversation:
${conversationText}

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
