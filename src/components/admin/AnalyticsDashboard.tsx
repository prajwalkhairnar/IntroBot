import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Loader2, MessageSquare, Users, Star, Activity, TrendingUp } from 'lucide-react';

interface AnalyticsDashboardProps {
    refreshTrigger?: number;
    onRefreshComplete?: () => void;
}

export function AnalyticsDashboard({ refreshTrigger = 0, onRefreshComplete }: AnalyticsDashboardProps) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalConversations: 0,
        totalMessages: 0,
        averageRating: 0,
        totalFeedback: 0,
        totalUniqueUsers: 0,
        avgMessagesPerConv: 0,
        returningUsersPercent: 0,
        feedbackResponseRate: 0,
        weekOverWeekGrowth: 0,
    });
    const [dailyStats, setDailyStats] = useState<any[]>([]);
    const [ratingDistribution, setRatingDistribution] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
    }, [refreshTrigger]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch basic counts
            const { count: conversationsCount } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true });

            const { count: messagesCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true });

            const { data: feedbackData } = await supabase
                .from('feedback')
                .select('rating, user_id');

            const totalFeedback = feedbackData?.length || 0;
            const averageRating =
                totalFeedback > 0
                    ? feedbackData!.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedback
                    : 0;

            // Count unique users who left feedback
            const uniqueFeedbackUserIds = new Set(feedbackData?.map(f => f.user_id).filter(Boolean) || []);
            const uniqueFeedbackUsers = uniqueFeedbackUserIds.size;

            // Calculate rating distribution
            const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
                rating,
                count: feedbackData?.filter(f => f.rating === rating).length || 0,
            }));
            setRatingDistribution(ratingCounts);

            // Fetch all conversations for detailed metrics
            const { data: allConversations } = await supabase
                .from('conversations')
                .select('user_id, message_count, created_at');

            // Total unique users (all time)
            const uniqueUserIds = new Set(allConversations?.map(c => c.user_id) || []);
            const totalUniqueUsers = uniqueUserIds.size;

            // Average messages per conversation
            const avgMessagesPerConv = allConversations && allConversations.length > 0
                ? allConversations.reduce((acc, curr) => acc + (curr.message_count || 0), 0) / allConversations.length
                : 0;

            // Returning users (users with more than 1 conversation)
            const userConversationCounts = new Map<string, number>();
            allConversations?.forEach(conv => {
                const count = userConversationCounts.get(conv.user_id) || 0;
                userConversationCounts.set(conv.user_id, count + 1);
            });
            const returningUsers = Array.from(userConversationCounts.values()).filter(count => count > 1).length;
            const returningUsersPercent = totalUniqueUsers > 0
                ? (returningUsers / totalUniqueUsers) * 100
                : 0;

            // Feedback response rate (per unique user)
            const feedbackResponseRate = totalUniqueUsers > 0
                ? (uniqueFeedbackUsers / totalUniqueUsers) * 100
                : 0;

            // Week-over-week growth
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

            const { count: thisWeekCount } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', oneWeekAgo.toISOString());

            const { count: lastWeekCount } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', twoWeeksAgo.toISOString())
                .lt('created_at', oneWeekAgo.toISOString());

            const weekOverWeekGrowth = lastWeekCount && lastWeekCount > 0
                ? ((thisWeekCount || 0) - lastWeekCount) / lastWeekCount * 100
                : 0;

            setStats({
                totalConversations: conversationsCount || 0,
                totalMessages: messagesCount || 0,
                averageRating: Number(averageRating.toFixed(1)),
                totalFeedback,
                totalUniqueUsers,
                avgMessagesPerConv: Number(avgMessagesPerConv.toFixed(1)),
                returningUsersPercent: Number(returningUsersPercent.toFixed(1)),
                feedbackResponseRate: Number(feedbackResponseRate.toFixed(1)),
                weekOverWeekGrowth: Number(weekOverWeekGrowth.toFixed(1)),
            });

            // Fetch daily activity (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: recentConversations } = await supabase
                .from('conversations')
                .select('created_at, user_id')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: true });

            // Initialize map with all 30 days
            const dayMap = new Map<string, { date: string; sessions: number; uniqueUsers: Set<string> }>();

            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateKey = d.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                dayMap.set(dateKey, { date: dateKey, sessions: 0, uniqueUsers: new Set() });
            }

            if (recentConversations) {
                recentConversations.forEach((conv) => {
                    const date = new Date(conv.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    });

                    // Only update if the date falls within our 30-day window (should always be true due to query)
                    if (dayMap.has(date)) {
                        const entry = dayMap.get(date)!;
                        entry.sessions += 1;
                        entry.uniqueUsers.add(conv.user_id);
                    }
                });
            }

            const chartData = Array.from(dayMap.values()).map((entry) => ({
                date: entry.date,
                sessions: entry.sessions,
                activeUsers: entry.uniqueUsers.size,
            }));

            setDailyStats(chartData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
            if (onRefreshComplete) onRefreshComplete();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Key Metrics Grid - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalConversations}</div>
                        <p className="text-xs text-muted-foreground">All time interaction count</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMessages}</div>
                        <p className="text-xs text-muted-foreground">Across all conversations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Feedback</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageRating}/5.0</div>
                        <p className="text-xs text-muted-foreground">Based on {stats.totalFeedback} reviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Unique Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUniqueUsers}</div>
                        <p className="text-xs text-muted-foreground">All time visitors</p>
                    </CardContent>
                </Card>
            </div>

            {/* Key Metrics Grid - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Msgs/Conv</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgMessagesPerConv}</div>
                        <p className="text-xs text-muted-foreground">Engagement depth</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Returning Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.returningUsersPercent}%</div>
                        <p className="text-xs text-muted-foreground">Multiple conversations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Feedback Rate</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.feedbackResponseRate}%</div>
                        <p className="text-xs text-muted-foreground">Users who left reviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Week Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.weekOverWeekGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {stats.weekOverWeekGrowth >= 0 ? '+' : ''}{stats.weekOverWeekGrowth}%
                        </div>
                        <p className="text-xs text-muted-foreground">Week-over-week change</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Sessions</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart key={refreshTrigger} data={dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderRadius: '8px',
                                        border: '1px solid hsl(var(--border))',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sessions"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--primary))', fill: 'hsl(var(--background))' }}
                                    activeDot={{ r: 6 }}
                                    animationDuration={2000}
                                    animationEasing="ease-in-out"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Rating Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ratingDistribution}
                                    dataKey="count"
                                    nameKey="rating"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ rating, count }) => count > 0 ? `${rating}★: ${count}` : ''}
                                    animationDuration={1500}
                                >
                                    {ratingDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={[
                                                'hsl(0, 70%, 50%)',    // 1 star - red
                                                'hsl(30, 70%, 50%)',   // 2 stars - orange
                                                'hsl(50, 70%, 50%)',   // 3 stars - yellow
                                                'hsl(80, 60%, 50%)',   // 4 stars - lime
                                                'hsl(120, 60%, 45%)',  // 5 stars - green
                                            ][index]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderRadius: '8px',
                                        border: '1px solid hsl(var(--border))',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Unique Users</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart key={refreshTrigger} data={dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderRadius: '8px',
                                        border: '1px solid hsl(var(--border))',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                                <Bar
                                    dataKey="activeUsers"
                                    fill="hsl(var(--primary))"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                    animationDuration={2000}
                                    animationEasing="ease-in-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Engagement Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Avg Messages per Conversation</span>
                                <span className="text-2xl font-bold text-primary">{stats.avgMessagesPerConv}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((stats.avgMessagesPerConv / 20) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Returning Users</span>
                                <span className="text-2xl font-bold text-primary">{stats.returningUsersPercent}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${stats.returningUsersPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Feedback Response Rate</span>
                                <span className="text-2xl font-bold text-primary">{stats.feedbackResponseRate}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${stats.feedbackResponseRate}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
