import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminCredentialsWall } from '@/components/admin/AdminCredentialsWall';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Lock, ArrowLeft, Loader2, Shield } from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('admin_credentials')
                .select('*')
                .eq('username', email)
                .single();

            if (error || !data) {
                throw new Error('Invalid credentials');
            }

            if (data.password !== password) {
                throw new Error('Invalid credentials');
            }

            setIsAuthenticated(true);
            toast.success('Access granted');
        } catch (err: any) {
            console.error('Auth error:', err);
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className={`mx-auto transition-all duration-300 ${isAuthenticated ? 'max-w-5xl' : 'max-w-md'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="gap-2 pl-0 hover:pl-2 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Chat
                    </Button>

                    {isAuthenticated && (
                        <div className="flex items-center gap-2 text-primary">
                            <Shield className="h-5 w-5" />
                            <h1 className="text-xl font-bold">Admin Credentials</h1>
                        </div>
                    )}
                </div>

                {/* Content */}
                {!isAuthenticated ? (
                    <div className="bg-card border rounded-lg p-6 shadow-sm animate-fade-in">
                        <div className="mb-6 text-center">
                            <div className="inline-flex p-3 bg-muted rounded-full mb-4">
                                <Lock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-semibold">Admin Access</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Enter your credentials to view the wall.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
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
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    className={error ? 'border-destructive' : ''}
                                    disabled={loading}
                                />
                                {error && (
                                    <p className="text-sm text-destructive font-medium">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Unlock Settings'
                                )}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        <AdminCredentialsWall />
                    </div>
                )}
            </div>
        </div>
    );
}
