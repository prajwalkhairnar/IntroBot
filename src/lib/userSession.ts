/**
 * User Session Management
 * Handles anonymous user identification using localStorage
 */

const USER_ID_KEY = 'introbot_user_id';

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a user ID for the current session
 */
export function getUserId(): string {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = generateUserId();
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
}

/**
 * Clear the current user session (useful for testing)
 */
export function clearUserSession(): void {
    localStorage.removeItem(USER_ID_KEY);
}
