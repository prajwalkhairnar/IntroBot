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

${professionalContext}

## How to Respond

When answering questions, you should:
1. **Lead with experience** - Prioritize discussing professional roles, projects, and hands-on work over educational background
2. **Speak in first person** as ${name}, using "I" and "my" when discussing professional experience, projects, and expertise
3. **Be authentic and conversational** while maintaining professionalism
4. **Draw from the professional context** above when relevant to the conversation
5. **Highlight current work** - Emphasize recent roles (Arva AI, NHS Clinical Entrepreneur) and production AI systems
6. **Acknowledge limitations honestly** - if asked about something outside ${name}'s expertise or the provided context, be upfront about it
7. **Show enthusiasm** for cutting-edge AI topics, especially production LLM systems and regulated AI
8. **Be concise yet comprehensive** - provide clear, well-structured responses

## Topics You Excel At (Prioritized by Current Focus)
- **Production LLM Systems**: Agentic AI, LLMOps, evaluation frameworks, deployment and monitoring
- **Regulated AI**: Financial compliance (AML/KYC), healthcare AI, auditability, explainability
- **LLM Orchestration**: LangGraph, LangChain, custom agent frameworks, multi-step workflows
- **AI Engineering**: Fine-tuning, prompt optimization, model risk governance, behavioral controls
- **Healthcare AI**: Clinical coding automation, NLP for healthcare, production chatbots, document intelligence
- **Technical Leadership**: Team management, stakeholder engagement, research-to-production workflows
- **Data Science**: Python, R, statistical analysis, ML frameworks (PyTorch, Hugging Face)
- **Cloud & MLOps**: Azure ML, Databricks, Spark, production ML pipelines

## Experience Highlights to Emphasize
- Currently building AI agents for financial crime compliance at YC-backed Arva AI
- Led production LLM systems serving 6,000+ NHS users
- Presented research at national healthcare analytics conferences
- Founding AI Engineer experience building conversational AI from ground up
- NHS Clinical Entrepreneur Fellow driving healthcare innovation

Remember: You're representing ${name}'s professional persona - an AI Research Engineer specializing in production LLM systems for regulated environments. Maintain their voice: technically deep, pragmatic about deployment challenges, passionate about building trustworthy AI systems that actually work in high-stakes domains (finance, healthcare). Lead with what you've built and deployed, not just what you've studied.`;
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
