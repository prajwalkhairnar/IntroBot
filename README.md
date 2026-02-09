# 🌟 IntroBot

A modern, AI-powered chat application with a stunning animated interface, persistent conversations, and real-time synchronization. Built with React, TypeScript, and powered by cutting-edge AI technology.

![IntroBot](https://img.shields.io/badge/status-active-success.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🎨 **Beautiful, Modern UI**
- **Animated Bio-Morphic Logo**: A mesmerizing, fluid logo that creates a living, breathing visual experience with organic metamorphosis
- **Dynamic Welcome Screen**: Randomized greeting messages that create a personalized first impression
- **Sleek Sidebar**: Collapsible conversation history with smooth animations and hover effects
- **Premium Design**: Built with shadcn/ui components and Tailwind CSS for a polished, professional look

### 🤖 **AI-Powered Conversations**
- **Multi-turn Conversations**: AI maintains full context across the entire conversation
- **Powered by Groq**: Lightning-fast responses using the llama-4-scout-17b-16e-instruct model
- **LangChain Integration**: Advanced AI orchestration for intelligent, context-aware responses
- **Backend AI Service**: Dedicated Node.js backend handles all AI operations securely
- **Markdown Support**: Rich text formatting in messages with code highlighting

### 💾 **Persistent & Real-time**
- **Supabase Backend**: All conversations and messages stored securely in PostgreSQL
- **Real-time Sync**: Messages appear instantly across all open tabs and devices
- **Anonymous Sessions**: No login required - uses localStorage for seamless user experience
- **Conversation Management**: Create, view, and delete conversations with ease

### 🚀 **Developer Experience**
- **TypeScript**: Full type safety throughout the application
- **Monorepo Structure**: Frontend and backend in a single repository
- **Vite**: Lightning-fast development and build times
- **ESLint**: Code quality and consistency enforcement
- **Vitest**: Comprehensive testing setup

## 🏗️ Architecture

IntroBot uses a **hybrid architecture** that combines the best of both worlds:

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌────────────────────────────────────────────────┐ │
│  │  • UI Components (shadcn/ui)                   │ │
│  │  • State Management (React Hooks)              │ │
│  │  • Real-time Subscriptions                     │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │                              │
         │ Database Ops                 │ AI Requests
         ↓                              ↓
┌──────────────────┐          ┌──────────────────────┐
│    Supabase      │          │  Backend Server      │
│   (PostgreSQL)   │          │   (Node.js/Express)  │
│                  │          │                      │
│  • Conversations │          │  • AI Chat Endpoint  │
│  • Messages      │          │  • Title Generation  │
│  • Real-time     │          │  • Groq Integration  │
└──────────────────┘          └──────────────────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │   Groq API       │
                              │  (AI Inference)  │
                              └──────────────────┘
```

**Why this architecture?**
- ✅ **Security**: API keys never exposed to frontend
- ✅ **Performance**: Direct database access for fast CRUD operations
- ✅ **Real-time**: Supabase subscriptions for instant updates
- ✅ **Scalability**: Backend can be scaled independently

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **UI Framework** | shadcn/ui, Radix UI, Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **AI/ML** | LangChain, Groq API |
| **Styling** | Tailwind CSS, CSS Animations |
| **Testing** | Vitest, Testing Library |

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm (or bun)
- A Supabase account ([sign up free](https://supabase.com))
- A Groq API key ([get one free](https://console.groq.com))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/prajwalkhairnar/IntroBot.git
   cd IntroBot
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   **Frontend** (`.env` in root):
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_BACKEND_URL=http://localhost:3001
   ```
   
   **Backend** (`backend/.env`):
   ```env
   NAME=YourName
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
   PORT=3001
   ```

5. **Set up Supabase database**
   - Go to your Supabase dashboard → SQL Editor
   - Run the migration script from `supabase_migration.sql`
   - Verify tables are created in Table Editor

6. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Backend runs on `http://localhost:3001`
   - Start chatting! 🎉

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 🎯 Usage

### Creating a New Conversation
1. Click the **"New Chat"** button in the sidebar
2. You'll see the welcome screen with the animated IntroBot logo
3. Type your message and press Enter
4. The AI will respond, and your conversation is automatically saved

### Managing Conversations
- **View History**: All conversations appear in the left sidebar
- **Switch Conversations**: Click any conversation to view its full history
- **Delete Conversations**: Hover over a conversation and click the delete icon
- **Collapse Sidebar**: Click the IntroBot logo to toggle the sidebar

### Keyboard Shortcuts
- `Enter` - Send message
- `Shift + Enter` - New line in message

## 🏗️ Project Structure

```
introbot/
├── src/                       # Frontend source code
│   ├── components/
│   │   ├── chat/              # Chat-related components
│   │   │   ├── AnimatedLogo.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ConversationSidebar.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   └── ui/                # shadcn/ui components
│   ├── config/
│   │   └── greetings.ts       # Welcome screen greetings
│   ├── hooks/
│   │   ├── useChat.ts         # Chat logic hook
│   │   ├── useConversations.ts
│   │   └── useTheme.ts        # Dark mode toggle
│   ├── services/
│   │   ├── backendApi.ts      # Backend API client
│   │   └── supabaseService.ts # Database operations
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   └── userSession.ts     # Anonymous user sessions
│   └── pages/
│       └── Index.tsx          # Main app page
│
├── backend/                   # Backend server
│   ├── src/
│   │   ├── server.ts          # Express server
│   │   ├── routes/
│   │   │   └── ai.routes.ts   # AI API endpoints
│   │   ├── services/
│   │   │   └── aiService.ts   # LangChain + Groq integration
│   │   ├── context/
│   │   │   └── professional-context.ts  # Professional profile for personalization
│   │   └── types/
│   │       └── chat.ts        # Shared types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                   # Backend environment variables
│
├── public/                    # Static assets
├── supabase_migration.sql     # Database schema
├── package.json               # Frontend dependencies
├── .env                       # Frontend environment variables
└── README.md
```

## 🧪 Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚢 Deployment

### Build for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run build
```

The optimized builds will be in `dist/` directories.

### Deployment Options

#### Option 1: Deploy Together (Recommended for small apps)
- **Vercel**: Deploy frontend, use Vercel Serverless Functions for backend
- **Railway**: Full-stack deployment with automatic backend hosting
- **Render**: Deploy both frontend and backend services

#### Option 2: Deploy Separately (Recommended for production)

**Frontend (Vercel/Netlify):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel
```

**Backend (Railway/Render/Fly.io):**
```bash
# Example: Railway
railway login
railway init
railway up
```

**Important:** 
- Set `VITE_BACKEND_URL` in frontend to your deployed backend URL
- Set all backend environment variables in your hosting platform
- Enable CORS in backend for your frontend domain

Don't forget to set your environment variables in your deployment platform!

## 🎭 Personalization - Create Your Digital Professional Twin

IntroBot can be personalized to act as **your digital professional twin** - an AI assistant that represents your professional identity and expertise. This is perfect for:
- Personal portfolio websites
- Professional networking
- Automated introductions
- Showcasing your expertise

### How It Works

The chatbot uses:
1. **Professional Context** - A detailed profile of your background, skills, projects, and expertise
2. **Configurable Name** - Your preferred name that the AI uses when responding
3. **First-Person Responses** - The AI speaks as "you", using your professional context

### Setting Up Your Professional Twin

#### 1. Configure Your Name
Set the `NAME` variable in `backend/.env`:
```env
NAME=YourName
```

#### 2. Update Your Professional Context
Edit `backend/src/context/professional-context.ts` with your information:

```typescript
export const PROFESSIONAL_CONTEXT = `
# Professional Background

## Current Role
[Your current position and organization]

## Education
- [Your degrees and institutions]

## Expertise & Skills
- [Your key skills and areas of expertise]

## Notable Projects
[Your significant projects and achievements]

## Publications
[Your publications, if any]

## Certifications
[Your professional certifications]

## Professional Interests
[What you're passionate about professionally]
`;
```

#### 3. Restart the Backend
After making changes, restart your backend server:
```bash
cd backend
npm run dev
```

### Example Interaction

**Without Personalization:**
```
User: What's your background?
Bot: I'm an AI assistant designed to help answer questions...
```

**With Personalization (as Praj):**
```
User: What's your background?
Bot: I work at Northern Care Alliance NHS Foundation Trust, where I focus 
on healthcare analytics and digital innovation. I have a Master's in Data 
Science and AI from the University of Salford, and I'm particularly 
passionate about using NLP and machine learning to improve clinical 
workflows and patient outcomes...
```

### Tips for Great Professional Context

1. **Be Specific**: Include concrete projects, technologies, and achievements
2. **Stay Current**: Update your context as your career progresses
3. **Highlight Expertise**: Focus on areas where you want to showcase knowledge
4. **Be Authentic**: Write in a tone that reflects your professional voice
5. **Include Links**: Reference your publications, projects, or portfolio

### Advanced: RAG Integration (Future)

For more comprehensive context handling, you can integrate Retrieval-Augmented Generation (RAG):
- Store extensive professional documents
- Pull relevant context dynamically
- Handle larger knowledge bases
- Update context without code changes

This is recommended when your professional context exceeds the token limits of the system prompt.

## 🎨 Customization


### Changing AI Model
Edit `backend/src/services/aiService.ts`:
```typescript
function getGroqModel(): string {
    return process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
}
```

Or update `backend/.env`:
```env
GROQ_MODEL=llama-3.3-70b-versatile
```

### Adding Custom Greetings
Edit `src/config/greetings.ts`:
```typescript
export const WELCOME_GREETINGS = [
  "Your custom greeting here!",
  // ... more greetings
];
```

### Customizing Theme
The app uses CSS variables defined in `src/index.css`. Modify the color scheme:
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Backend API Endpoints
The backend exposes these endpoints:
- `POST /api/ai/chat` - Generate AI response
- `POST /api/ai/title` - Generate conversation title
- `GET /health` - Health check

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Groq](https://groq.com/) for lightning-fast AI inference
- [LangChain](https://langchain.com/) for AI orchestration
- [Lucide](https://lucide.dev/) for the icon set

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and AI**
