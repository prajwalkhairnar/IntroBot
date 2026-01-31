/**
 * Welcome screen greeting messages
 * Add or modify greetings here to customize the welcome experience
 */

const NIGHT_START_HOUR = 23; // 11 PM
const NIGHT_END_HOUR = 6;   // 6 AM

export const WELCOME_GREETINGS = [
    "Well. Go on then.",
    "I assume you have a point.",
    "Alright. Impress me.",
    "This better be interesting.",
    "Let’s skip the pleasantries.",
    "Let’s hear it, then.",
    "You may begin.",
    "Don’t keep me in suspense.",
    "Right. What is it?",
    "I’m listening. Allegedly.",
    "Make it worth the typing.",
    "Go on. Don’t be shy.",
    "Go ahead. I’m waiting.",
    "Shall we?",
    "Out with it, then.",
    "Do get on with it.",
    "I trust there’s a reason.",
    "Go ahead. Surprise me.",
    "Let’s hear the big idea.",
    "This should be good.",
    "Please, enlighten me.",
    "Whenever you’re ready.",
    "Try not to waste my time.",
    "This better lead somewhere.",
    "I assume this made sense to you.",
    "Here we go again.",
    "Let’s get this over with.",
    "Start typing before you forget.",
    "This won’t end well, will it?"
] as const;

export const NIGHT_GREETINGS = [
    "Don't you sleep?",
    "Up late, I see.",
    "Burning the midnight oil, are we?",
    "Shouldn’t you be in bed?",
    "Night owl, huh?",
    "Seriously? At this hour?",
    "I admire your commitment. Or lack of sleep.",
    "I see someone’s avoiding sleep.",
    "Still awake… daring, aren’t we?",
    "You should probably be dreaming.",
    "Late-night thoughts? Go on then.",
    "Nighttime is for the brave. Or foolish.",
    "Ah, the infamous witching hour."
] as const;



/**
 * Get a random greeting from the list
 */
export function getRandomGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR) {
        // Night greetings
        const randomIndex = Math.floor(Math.random() * NIGHT_GREETINGS.length);
        return NIGHT_GREETINGS[randomIndex];
    } else {
        // Day greetings
        const randomIndex = Math.floor(Math.random() * WELCOME_GREETINGS.length);
        return WELCOME_GREETINGS[randomIndex];
    }
}
