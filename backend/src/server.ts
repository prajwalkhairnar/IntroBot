import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables FIRST, before any other imports
// Load environment variables. Priority: backend/.env
dotenv.config({ path: join(__dirname, '../.env') });

// Debug: Log environment variables
console.log('Environment check:', {
    hasGroqKey: !!process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL,
    port: process.env.PORT
});

// Now import other modules that depend on environment variables
import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes';
import conversationRoutes from './routes/conversation.routes';
import messageRoutes from './routes/message.routes';
import interestRoutes from './routes/interest.routes';
import feedbackRoutes from './routes/feedback.routes';
import analyticsRoutes from './routes/analytics.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/interest', interestRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
