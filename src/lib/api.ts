import { getUserId } from './userSession';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const userId = getUserId();
    const headers = {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
        ...options.headers, // Allow overriding
    } as HeadersInit;

    const response = await fetch(`${BACKEND_URL}/api${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `API Error: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    conversations: {
        list: () => request<any[]>('/conversations'),
        create: (title: string) => request<{ id: string }>('/conversations', {
            method: 'POST',
            body: JSON.stringify({ title }),
        }),
        update: (id: string, updates: any) => request(`/conversations/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        }),
        delete: (id: string) => request(`/conversations/${id}`, {
            method: 'DELETE',
        }),
    },
    messages: {
        list: (conversationId: string) => request<any[]>(`/messages/${conversationId}`),
        create: (conversationId: string, role: string, content: string) => request<any>('/messages', {
            method: 'POST',
            body: JSON.stringify({ conversationId, role, content }),
        }),
    },
    interest: {
        register: (email: string, source?: string) => request('/interest', {
            method: 'POST',
            body: JSON.stringify({ email, source }),
        }),
    },
    feedback: {
        submit: (data: { rating: number; comments?: string; email?: string; userId?: string }) => request('/feedback', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },
    analytics: {
        getOverview: () => request<any>('/analytics/overview'),
    },
    admin: {
        login: (credentials: { username?: string; password?: string }) => request<{ success: boolean; service: string }>('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
        getCredentials: () => request<any[]>('/admin/credentials'),
    }
};
