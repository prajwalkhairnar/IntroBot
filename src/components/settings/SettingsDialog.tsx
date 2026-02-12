import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { AdminCredentialsWall } from '@/components/admin/AdminCredentialsWall';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
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
            // Check against admin_credentials table
            // In a real production app, this is insecure as it exposes credentials to the client
            // But per request for this wall feature:
            await api.admin.login({ username: email, password });

            setIsAuthenticated(true);
            toast.success('Access granted');
        } catch (err: any) {
            console.error('Auth error:', err);
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset state when closing
            setTimeout(() => {
                setIsAuthenticated(false);
                setEmail('');
                setPassword('');
                setError(null);
            }, 300);
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto z-[100]">
                <DialogHeader>
                    <DialogTitle>
                        {isAuthenticated ? 'Admin Settings' : 'Admin Access'}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    {!isAuthenticated ? (
                        <form onSubmit={handleLogin} className="space-y-4 py-4">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="p-3 bg-muted rounded-full">
                                    <Lock className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Please enter your admin credentials to view the wall.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
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
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    className={error ? 'border-destructive' : ''}
                                    disabled={loading}
                                />
                                {error && (
                                    <p className="text-sm text-destructive">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
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
                    ) : (
                        <AdminCredentialsWall />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
