import { api } from '@/lib/api';

export interface InterestRegistration {
    email: string;
    source?: string;
}

export async function registerInterest(data: InterestRegistration): Promise<{ success: boolean; error?: string }> {
    try {
        await api.interest.register(data.email, data.source);
        console.log('Interest registered successfully for:', data.email);
        return { success: true };
    } catch (err: any) {
        // Backend returns error message in exception
        const errorMessage = err.message || '';
        if (errorMessage.includes('already been registered')) {
            return {
                success: false,
                error: 'This email has already been registered.',
            };
        }

        console.error('Error registering interest:', err);
        return {
            success: false,
            error: errorMessage || 'Failed to register interest. Please try again.',
        };
    }
}
