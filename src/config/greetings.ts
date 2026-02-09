/**
 * Welcome screen introduction message
 */

export const INTRO_NAME = import.meta.env.VITE_INTRO_NAME || "Hi, I'm Praj!";

export const WORK_TITLES = [
    import.meta.env.VITE_WORK_TITLE_1 || "Full-time husband, otherwise an AI Research Engineer.",
    import.meta.env.VITE_WORK_TITLE_2 || "Full-time husband, also an AI Research Engineer."
] as const;

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/prajwal-khairnar/",
    github: import.meta.env.VITE_GITHUB_URL || "https://github.com/prajwalkhairnar",
    email: import.meta.env.VITE_EMAIL || "prajwal.pkhairnar@gmail.com"
} as const;

/**
 * Get the introduction message with a random work title
 */
export function getIntroduction() {
    const randomIndex = Math.floor(Math.random() * WORK_TITLES.length);
    return {
        name: INTRO_NAME,
        title: WORK_TITLES[randomIndex]
    };
}
