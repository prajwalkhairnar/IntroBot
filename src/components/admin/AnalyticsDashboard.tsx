import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
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
import { Loader2, MessageSquare, Users, Star, Activity, TrendingUp, Clock, Mail } from 'lucide-react';

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
        avgSessionDuration: '',
        userMessageRatio: 0,
        totalInterestRegistrations: 0,
    });
    const [dailyStats, setDailyStats] = useState<any[]>([]);
    const [ratingDistribution, setRatingDistribution] = useState<any[]>([]);
    const [peakHours, setPeakHours] = useState<any[]>([]);
    const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
    const [interestRegistrations, setInterestRegistrations] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
    }, [refreshTrigger]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await api.analytics.getOverview();

            setStats(data.stats);
            setDailyStats(data.dailyStats);
            setRatingDistribution(data.ratingDistribution);
            setPeakHours(data.peakHours);
            setRecentFeedback(data.recentFeedback);
            setInterestRegistrations(data.interestRegistrations);
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

            {/* Key Metrics Grid - Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interest Registrations</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalInterestRegistrations}</div>
                        <p className="text-xs text-muted-foreground">Users wanting their own bot</p>
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

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Avg Session Duration
                                </span>
                                <span className="text-2xl font-bold text-primary">{stats.avgSessionDuration}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Time between first and last message
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Peak Activity Hours - Full Width */}
            <Card>
                <CardHeader>
                    <CardTitle>Peak Activity Hours</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peakHours}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="hour"
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
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
                                dataKey="count"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={30}
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Feedback Comments */}
            {recentFeedback.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Feedback Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {recentFeedback.map((feedback, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < feedback.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-muted-foreground'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold">{feedback.rating}/5</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">{feedback.comments}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Interest Registrations */}
            {interestRegistrations.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Interest Registrations
                            </CardTitle>
                            <span className="text-sm text-muted-foreground">
                                {interestRegistrations.length} {interestRegistrations.length === 1 ? 'registration' : 'registrations'}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {interestRegistrations.map((registration, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Mail className="h-4 w-4 text-primary" />
                                                <a
                                                    href={`mailto:${registration.email}`}
                                                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                                >
                                                    {registration.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>
                                                    {new Date(registration.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                                {registration.source && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="capitalize">{registration.source.replace('_', ' ')}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
