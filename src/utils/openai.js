import OpenAI from 'openai';
import { OPENAI_KEY } from './constants';

let openai = null;

// Only initialize OpenAI if the API key is available
if (OPENAI_KEY && OPENAI_KEY !== 'your_openai_api_key_here') {
  try {
    openai = new OpenAI({
      apiKey: OPENAI_KEY,
      dangerouslyAllowBrowser: true 
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
  }
} else {
  console.warn('OpenAI API key is not configured. GPT search functionality will be disabled.');
}

export default openai;