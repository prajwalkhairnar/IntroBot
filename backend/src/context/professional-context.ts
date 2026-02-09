/**
 * Professional Context for IntroBot
 * This file contains the professional information used to personalize the chatbot responses
 */

import fs from 'fs';
import path from 'path';

/**
 * Professional Context for IntroBot
 * This file contains the professional information used to personalize the chatbot responses
 */

export function getProfessionalContext(): string {
  try {
    const contextPath = path.resolve(__dirname, 'professional_context.md');
    if (fs.existsSync(contextPath)) {
      return fs.readFileSync(contextPath, 'utf-8');
    }
    console.warn(`Professional context file not found at ${contextPath}`);
    return '';
  } catch (error) {
    console.error('Error reading professional context file:', error);
    return '';
  }
}
