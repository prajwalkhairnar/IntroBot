import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { api } from '@/lib/api';
import { toast } from 'sonner';

import { Lock, ArrowLeft, Loader2, Shield, RefreshCcw, Moon, Sun } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useTheme } from '@/hooks/useTheme';

export default function Settings() {
    const navigate = useNavigate();
    const { isAuthenticated, serviceName, login } = useAdmin();

    const { theme, toggleTheme } = useTheme();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshStartTimeRef = useRef<number>(0);
    const MIN_SPIN_DURATION = 1000; // 1 second for a full rotation

    const handleRefreshComplete = () => {
        const elapsed = Date.now() - refreshStartTimeRef.current;
        const remaining = Math.max(0, MIN_SPIN_DURATION - elapsed);

        setTimeout(() => {
            setIsRefreshing(false);
            toast.success('Analytics refreshed');
        }, remaining);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await api.admin.login({ username: email, password });

            login(data.service);
            toast.success('Welcome to Mission Control');
        } catch (err: any) {
            console.error('Auth error:', err);
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8">
            <div className={`mx-auto transition-all duration-300 ${isAuthenticated ? 'max-w-7xl' : 'max-w-md'}`}>
                {/* Header */}
                {/* Header */}
                {/* Header */}
                <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors px-0 hover:px-2 text-xs sm:text-sm"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline">Back to Chat</span>
                            <span className="xs:hidden">Back</span>
                        </Button>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {isAuthenticated && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsRefreshing(true);
                                        refreshStartTimeRef.current = Date.now();
                                        setRefreshTrigger(prev => prev + 1);
                                    }}
                                    className="shrink-0 hover:bg-muted hover:text-foreground h-9 w-9 sm:h-10 sm:w-10"
                                    title="Refresh Analytics"
                                    disabled={isRefreshing}
                                >
                                    <RefreshCcw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => toggleTheme(e)}
                                className="shrink-0 hover:bg-muted hover:text-foreground h-9 w-9 sm:h-10 sm:w-10"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="flex flex-col items-start animate-fade-in">
                            <div className="flex items-center gap-2 text-primary">
                                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                                <h1 className="text-lg sm:text-xl font-bold">Mission Control</h1>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Logged in as {serviceName}</p>
                        </div>
                    )}
                </div>

                {/* Content */}
                {!isAuthenticated ? (
                    <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm animate-fade-in">
                        <div className="mb-4 sm:mb-6 text-center">
                            <div className="inline-flex p-2.5 sm:p-3 bg-muted rounded-full mb-3 sm:mb-4">
                                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-semibold">Mission Control Access</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Enter your credentials to view analytics.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError(null);
                                    }}
                                    disabled={loading}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    className={`text-sm sm:text-base ${error ? 'border-destructive' : ''}`}
                                    disabled={loading}
                                />
                                {error && (
                                    <p className="text-xs sm:text-sm text-destructive font-medium">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" variant="secondary" className="w-full text-sm sm:text-base" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Launch Mission Control'
                                )}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        <AnalyticsDashboard
                            refreshTrigger={refreshTrigger}
                            onRefreshComplete={isRefreshing ? handleRefreshComplete : undefined}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
