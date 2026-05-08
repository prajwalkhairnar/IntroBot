# 🌟 IntroBot

Your digital professional twin — an AI-powered chatbot that introduces you, answers questions about your background, and holds professional introductory conversations on your behalf.

Deploy it on your portfolio or personal site so anyone can learn about you in a natural, conversational way: your roles, skills, projects, and experience — without you being in the room.

Built with React, TypeScript, and powered by Groq + LangChain.

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

IntroBot uses a **centralized backend architecture** to ensure security and scalability:

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌────────────────────────────────────────────────┐ │
│  │  • UI Components (shadcn/ui)                   │ │
│  │  • State Management (React Hooks)              │ │
│  │  • Optimistic UI Updates                       │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                        │
                        │ REST API Requests
                        ↓
┌─────────────────────────────────────────────────────┐
│                  Backend Server                      │
│                (Node.js/Express)                     │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │   Database Controller │  │    AI Controller     │ │
│  └──────────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────┘
            │                           │
   Database │                           │ AI Inference
   Ops      │                           │
            ↓                           ↓
   ┌──────────────────┐        ┌──────────────────┐
   │    Supabase      │        │     Groq API     │
   │   (PostgreSQL)   │        │                  │
   └──────────────────┘        └──────────────────┘
```

**Why this architecture?**
- ✅ **Security**: All database and AI interactions are proxied through the backend
- ✅ **Consistency**: Centralized logic for data validation and formatting
- ✅ **Scalability**: Backend handles connection pooling and rate limiting
- ✅ **Simplicity**: Frontend only communicates with one API endpoint

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
   
   Edit `.env` and configure:
   ```env
   # Supabase Configuration (Required)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_BACKEND_URL=http://localhost:3001
   
   # Personal Information (Optional - customize to make it yours!)
   VITE_INTRO_NAME=Hi, I'm YourName!
   VITE_WORK_TITLE_1=Your primary work title here
   VITE_WORK_TITLE_2=Your alternative work title here
   
   # Social Links (Optional)
   VITE_LINKEDIN_URL=https://www.linkedin.com/in/your-profile/
   VITE_GITHUB_URL=https://github.com/yourusername
   VITE_EMAIL=your.email@example.com
   
   # Export/Download Configuration (Optional)
   VITE_CV_FILENAME=Your_Name_CV.pdf
   VITE_ASSISTANT_NAME=YourName
   ```
   
   **Backend** (`backend/.env`):
   ```env
   # Personal Identity (Required)
   NAME=YourName
   
   # Groq API Configuration (Required)
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
   
   # Server Configuration
   PORT=3001
   
   # LLM Model Parameters (Optional - tune AI behavior)
   GROQ_TEMPERATURE=0.7              # 0.0-2.0, higher = more creative
   GROQ_MAX_TOKENS=2048              # Maximum response length
   GROQ_NAMING_TEMPERATURE=0.3       # Temperature for title generation
   GROQ_NAMING_MAX_TOKENS=50         # Max tokens for conversation titles
   ```
   
   > 📖 **For detailed configuration guide**, see [docs/ENV_CONFIGURATION.md](./docs/ENV_CONFIGURATION.md)

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

For detailed setup instructions, see [docs/SETUP.md](./docs/SETUP.md).

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

> **Important for forks**: `backend/src/context/professional_context.md` contains the author's own professional background. Replace it entirely with your own information before deploying.

Edit `backend/src/context/professional_context.md` with your information. This file uses an XML-like structure for easy editing:

```xml
<professional_background>
  <current_roles>
    <role>
      <title>Principal Software Engineer</title>
      <company>Tech Corp</company>
      <duration>2023 - Present</duration>
      <description>Leading key initiatives in AI...</description>
    </role>
  </current_roles>

  <previous_roles>
    <!-- Add your history here -->
  </previous_roles>

  <education>
    <!-- Add your education here -->
  </education>

  <technical_expertise>
    <!-- Add your skills here -->
  </technical_expertise>
</professional_background>
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

## ⚙️ Configuration \u0026 Customization

IntroBot is **highly configurable** through environment variables. You can customize everything from AI behavior to personal branding without touching the code.

### 🎛️ Configuration System

All configuration is managed through environment variables in two files:
- **Root `.env`**: Frontend settings (personal info, social links, UI text)
- **`backend/.env`**: Backend settings (AI parameters, API keys, server config)

**📖 Complete Configuration Guide**: See [docs/ENV_CONFIGURATION.md](./docs/ENV_CONFIGURATION.md) for detailed documentation of all variables.

### 🤖 AI Behavior Configuration

Control how the AI responds by adjusting these parameters in `backend/.env`:

#### Temperature (Creativity Level)
```env
GROQ_TEMPERATURE=0.7  # Default: balanced
```
- **0.0-0.3**: Focused, deterministic, consistent responses
- **0.4-0.7**: Balanced creativity and reliability (recommended)
- **0.8-2.0**: More creative, varied, unpredictable responses

#### Response Length
```env
GROQ_MAX_TOKENS=2048  # Default: ~1500 words
```
Adjust based on your needs:
- **512-1024**: Short, concise responses
- **2048**: Standard length (recommended)
- **4096+**: Longer, detailed responses

#### Model Selection
```env
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```
Available models:
- `meta-llama/llama-4-scout-17b-16e-instruct` (default, fast)
- `llama-3.3-70b-versatile` (more capable, slower)
- `mixtral-8x7b-32768` (large context window)

### 🎨 Personal Branding

Customize the chatbot's appearance and personality through frontend environment variables:

#### Welcome Screen
```env
VITE_INTRO_NAME=Hi, I'm Alex!
VITE_WORK_TITLE_1=Full-stack Developer & AI Enthusiast
VITE_WORK_TITLE_2=Building the future, one line at a time
```

#### Social Links
```env
VITE_LINKEDIN_URL=https://www.linkedin.com/in/yourprofile/
VITE_GITHUB_URL=https://github.com/yourusername
VITE_EMAIL=your.email@example.com
```

#### Export Settings
```env
VITE_CV_FILENAME=Your_Name_CV.pdf
VITE_ASSISTANT_NAME=Alex
```

### 🎭 Professional Context

For the AI to represent **your professional identity**, update the professional context file:

**File**: `backend/src/context/professional_context.md`

This file contains your:
- Current roles and responsibilities
- Education and certifications
- Technical expertise and skills
- Notable projects and achievements
- Publications and presentations
- Professional philosophy

The AI uses this context to respond as "you" in first person, drawing from your actual experience and expertise.

**Example**: When someone asks "What's your background?", the AI responds based on YOUR professional context, not generic information.

### 🔧 Advanced Customization

#### Changing AI Model
Edit `backend/.env`:
```env
GROQ_MODEL=llama-3.3-70b-versatile
```

#### Custom Greetings
Edit `src/config/greetings.ts`:
```typescript
export const WORK_TITLES = [
  "Your custom title here",
  "Another title option"
];
```

#### Theme Customization
Modify CSS variables in `src/index.css`:
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
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

## 📚 Documentation

- **[docs/SETUP.md](./docs/SETUP.md)** - Detailed setup instructions
- **[docs/ENV_CONFIGURATION.md](./docs/ENV_CONFIGURATION.md)** - Complete environment variables guide
- **[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Supabase project setup and RLS policy guide

---

**Built with ❤️ using React, TypeScript, and AI**
