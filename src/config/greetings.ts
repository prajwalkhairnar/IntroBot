/**
 * Welcome screen introduction message
 */

export const INTRO_NAME = "Hi, I'm Praj!";

export const WORK_TITLES = [
    "Full-time husband, otherwise an AI Research Engineer.",
    "Full-time husband, also an AI Research Engineer."
] as const;

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/prajwal-khairnar/",
    github: "https://github.com/prajwalkhairnar",
    email: "prajwal.pkhairnar@gmail.com"
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
