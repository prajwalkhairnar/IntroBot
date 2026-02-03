import { supabase } from '@/lib/supabase';

export interface InterestRegistration {
    email: string;
    source?: string;
}

export async function registerInterest(data: InterestRegistration): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('interest_registrations')
            .insert([
                {
                    email: data.email.toLowerCase().trim(),
                    source: data.source || 'welcome_screen',
                },
            ]);

        if (error) {
            // Check if it's a duplicate email error
            if (error.code === '23505') {
                return {
                    success: false,
                    error: 'This email has already been registered.',
                };
            }

            console.error('Error registering interest:', error);
            return {
                success: false,
                error: 'Failed to register interest. Please try again.',
            };
        }

        console.log('Interest registered successfully for:', data.email);
        return { success: true };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}
