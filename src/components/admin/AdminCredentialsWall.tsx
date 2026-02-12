import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Copy, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface Credential {
    id: string;
    service: string;
    username: string;
    password: string;
    created_at: string;
}

export function AdminCredentialsWall() {
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const data = await api.admin.getCredentials();
            setCredentials(data || []);
        } catch (error) {
            console.error('Error fetching credentials:', error);
            // Don't show error toast on mount if it's just empty or uninitialized
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success('Copied to clipboard');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header removed to allow parent to control title */}

            <div className="grid grid-cols-1 gap-4">
                {credentials.map((cred) => (
                    <div key={cred.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{cred.service}</h3>
                            <span className="text-xs text-muted-foreground">
                                {new Date(cred.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-col space-y-1">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Username</span>
                                <div className="flex items-center justify-between bg-muted/50 p-2 rounded border border-border/50">
                                    <code className="text-sm font-mono">{cred.username}</code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-muted"
                                        onClick={() => copyToClipboard(cred.username, `user-${cred.id}`)}
                                        title="Copy Username"
                                    >
                                        {copiedId === `user-${cred.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Password</span>
                                <div className="flex items-center justify-between bg-muted/50 p-2 rounded border border-border/50">
                                    <code className="text-sm font-mono blur-sm hover:blur-none transition-all duration-300 select-all">
                                        {cred.password}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-muted"
                                        onClick={() => copyToClipboard(cred.password, `pass-${cred.id}`)}
                                        title="Copy Password"
                                    >
                                        {copiedId === `pass-${cred.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {credentials.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No credentials found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        The wall is empty. Run the migration to seed data.
                    </p>
                </div>
            )}
        </div>
    );
}
