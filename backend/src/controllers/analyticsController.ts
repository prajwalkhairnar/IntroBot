import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // Parallelize independent queries
        const [
            { count: conversationsCount },
            { count: messagesCount },
            { data: feedbackData },
            { data: allConversations },
            { count: userMsgCount },
            { count: assistantMsgCount },
            { data: registrations },
            { data: allMessages }
        ] = await Promise.all([
            supabase.from('conversations').select('*', { count: 'exact', head: true }),
            supabase.from('messages').select('*', { count: 'exact', head: true }),
            supabase.from('feedback').select('rating, user_id, comments, created_at').order('created_at', { ascending: false }),
            supabase.from('conversations').select('id, user_id, message_count, created_at'),
            supabase.from('messages').select('*', { count: 'exact', head: true }).eq('role', 'user'),
            supabase.from('messages').select('*', { count: 'exact', head: true }).eq('role', 'assistant'),
            supabase.from('interest_registrations').select('email, created_at, source').order('created_at', { ascending: false }).limit(50),
            supabase.from('messages').select('conversation_id, created_at')
        ]);

        // Process Feedback
        const totalFeedback = feedbackData?.length || 0;
        const averageRating = totalFeedback > 0
            ? feedbackData!.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback
            : 0;

        const uniqueFeedbackUserIds = new Set(feedbackData?.map(f => f.user_id).filter(Boolean) || []);
        const totalUniqueUsers = new Set(allConversations?.map(c => c.user_id) || []).size;

        const feedbackResponseRate = totalUniqueUsers > 0
            ? (uniqueFeedbackUserIds.size / totalUniqueUsers) * 100
            : 0;

        const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
            rating,
            count: feedbackData?.filter(f => f.rating === rating).length || 0,
        }));

        const recentFeedback = feedbackData?.filter(f => f.comments).slice(0, 10) || [];

        // Process Conversations
        const avgMessagesPerConv = allConversations && allConversations.length > 0
            ? allConversations.reduce((acc, curr) => acc + (curr.message_count || 0), 0) / allConversations.length
            : 0;

        const userConversationCounts = new Map<string, number>();
        allConversations?.forEach(conv => {
            const count = userConversationCounts.get(conv.user_id) || 0;
            userConversationCounts.set(conv.user_id, count + 1);
        });
        const returningUsers = Array.from(userConversationCounts.values()).filter(count => count > 1).length;
        const returningUsersPercent = totalUniqueUsers > 0 ? (returningUsers / totalUniqueUsers) * 100 : 0;

        // Week over Week
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeekCount = allConversations?.filter(c => new Date(c.created_at) >= oneWeekAgo).length || 0;
        const lastWeekCount = allConversations?.filter(c => {
            const d = new Date(c.created_at);
            return d >= twoWeeksAgo && d < oneWeekAgo;
        }).length || 0;

        const weekOverWeekGrowth = lastWeekCount > 0
            ? ((thisWeekCount - lastWeekCount) / lastWeekCount * 100)
            : 0;

        // Peak Hours
        const hourCounts = new Array(24).fill(0);
        allConversations?.forEach(conv => {
            const hour = new Date(conv.created_at).getHours();
            hourCounts[hour]++;
        });
        const peakHours = hourCounts.map((count, hour) => ({
            hour: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
            count
        }));

        // Daily Stats (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dayMap = new Map<string, { date: string; sessions: number; uniqueUsers: Set<string> }>();
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dayMap.set(dateKey, { date: dateKey, sessions: 0, uniqueUsers: new Set() });
        }

        allConversations?.forEach(conv => {
            const d = new Date(conv.created_at);
            if (d >= thirtyDaysAgo) {
                const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (dayMap.has(dateKey)) {
                    const entry = dayMap.get(dateKey)!;
                    entry.sessions++;
                    entry.uniqueUsers.add(conv.user_id);
                }
            }
        });

        const dailyStats = Array.from(dayMap.values()).map(entry => ({
            date: entry.date,
            sessions: entry.sessions,
            activeUsers: entry.uniqueUsers.size
        }));

        // Session Duration - In-memory calculation
        const convMessages = new Map<string, Date[]>();
        allMessages?.forEach(m => {
            if (!convMessages.has(m.conversation_id)) convMessages.set(m.conversation_id, []);
            convMessages.get(m.conversation_id)?.push(new Date(m.created_at));
        });

        let totalDurationMs = 0;
        let diffCount = 0;

        convMessages.forEach(dates => {
            if (dates.length > 1) {
                dates.sort((a, b) => a.getTime() - b.getTime());
                const duration = dates[dates.length - 1].getTime() - dates[0].getTime();
                if (duration > 0) {
                    totalDurationMs += duration;
                    diffCount++;
                }
            }
        });

        const avgDurationMs = diffCount > 0 ? totalDurationMs / diffCount : 0;
        const avgDurationMinutes = Math.floor(avgDurationMs / 60000);
        const avgDurationSeconds = Math.floor((avgDurationMs % 60000) / 1000);
        const avgSessionDuration = avgDurationMinutes > 0 ? `${avgDurationMinutes}m ${avgDurationSeconds}s` : `${avgDurationSeconds}s`;

        // User Message Ratio
        const userMessageRatio = (assistantMsgCount && assistantMsgCount > 0)
            ? Number(((userMsgCount || 0) / assistantMsgCount).toFixed(2))
            : 0;

        res.json({
            stats: {
                totalConversations: conversationsCount || 0,
                totalMessages: messagesCount || 0,
                averageRating: Number(averageRating.toFixed(1)),
                totalFeedback,
                totalUniqueUsers,
                avgMessagesPerConv: Number(avgMessagesPerConv.toFixed(1)),
                returningUsersPercent: Number(returningUsersPercent.toFixed(1)),
                feedbackResponseRate: Number(feedbackResponseRate.toFixed(1)),
                weekOverWeekGrowth: Number(weekOverWeekGrowth.toFixed(1)),
                avgSessionDuration,
                userMessageRatio,
                totalInterestRegistrations: registrations?.length || 0
            },
            dailyStats,
            ratingDistribution,
            peakHours,
            recentFeedback,
            interestRegistrations: registrations || []
        });

    } catch (error: any) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: error.message });
    }
};
