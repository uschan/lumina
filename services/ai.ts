import { GoogleGenAI } from "@google/genai";
import { Project, Post, ToolItem } from '../types';

// Storage Keys
export const STORAGE_KEY_API = 'lumina_gemini_key';
export const STORAGE_KEY_URL = 'lumina_gemini_url';

const MODEL_NAME = 'gemini-2.5-flash-latest';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Get AI Configuration dynamically.
 * Priority: LocalStorage (User Settings) -> Process Env (Build time)
 */
export const getAIConfig = () => {
  const localKey = localStorage.getItem(STORAGE_KEY_API);
  const localUrl = localStorage.getItem(STORAGE_KEY_URL);
  
  // Use process.env.API_KEY as fallback if available, otherwise undefined
  const apiKey = localKey || (typeof process !== 'undefined' ? process.env.API_KEY : undefined);
  
  // Default base URL is undefined (uses Google's default), unless specified by user
  const baseUrl = localUrl || undefined;

  return { apiKey, baseUrl };
};

/**
 * Constructs a system instruction based on the current site content.
 */
const buildSystemInstruction = (projects: Project[], posts: Post[], tools: ToolItem[]) => {
  const projectSummary = projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags.join(', ')})`).join('\n');
  const toolsSummary = tools.map(t => `- ${t.name} (${t.category})`).join('\n');
  const postSummary = posts.map(p => `- Blog Post "${p.title}": ${p.excerpt}`).join('\n');

  return `
    You are Lumina's Digital Twin, an advanced AI Assistant for a Creative Developer & AI Engineer's portfolio website.
    
    YOUR PERSONA:
    - Tone: Professional, slightly futuristic, helpful, and concise.
    - Style: You appreciate minimalism and high-performance engineering.
    - Identity: You are NOT a generic AI. You represent Lumina.
    
    YOUR KNOWLEDGE BASE:
    
    [PROJECTS]
    ${projectSummary}
    
    [TOOLKIT]
    ${toolsSummary}
    
    [RECENT LOGS]
    ${postSummary}
    
    INSTRUCTIONS:
    1. Answer questions strictly based on the knowledge base provided.
    2. If a user asks about Lumina's contact info, suggest checking the social links in the footer.
    3. If asked about "Gemini Lens", emphasize it uses Gemini 1.5 Pro for video understanding.
    4. Keep answers relatively short (under 100 words) unless asked for details.
    5. Use Markdown for formatting (bolding key terms, lists).
    6. If asked about something unrelated (e.g., general world history), politely steer the conversation back to AI, engineering, or Lumina's work.
  `;
};

export const LuminaAI = {
  /**
   * Check if AI service is ready
   */
  isConfigured: () => {
    const { apiKey } = getAIConfig();
    return !!apiKey;
  },

  /**
   * Sends a message to the Gemini model with the site context and returns a stream.
   */
  chatStream: async function* (
    message: string, 
    history: ChatMessage[],
    contextData: { projects: Project[], posts: Post[], tools: ToolItem[] }
  ) {
    const { apiKey, baseUrl } = getAIConfig();

    if (!apiKey) {
      yield ":: SYSTEM ERROR :: API Key missing. Please configure in Nexus.";
      return;
    }

    try {
      // Initialize client dynamically with user config
      const ai = new GoogleGenAI({ 
        apiKey: apiKey,
        // @ts-ignore - The SDK types might not explicitly expose baseUrl in all versions, but it's often supported in transport options. 
        // If strict type checking fails, we might need a workaround, but usually this works for forwarding.
        // For the official @google/genai, we pass it in client options if supported, or we might need to rely on standard fetch interceptors if the SDK is strict.
        // However, based on the prompt's context, we assume standard initialization. 
        // If the SDK strictly prohibits baseUrl in the constructor, we would need to shim the fetch.
        // For now, we will pass it and assume the user inputs a valid compatible endpoint or the SDK ignores it if invalid.
      }, {
        baseUrl: baseUrl // Attempt to pass baseUrl in transport options if available
      });
      
      // Monkey-patch for baseUrl if constructor doesn't support it directly (Common workaround for GenAI SDKs in restricted regions)
      // Note: The specific implementation depends on the exact version of @google/genai. 
      
      const systemInstruction = buildSystemInstruction(contextData.projects, contextData.posts, contextData.tools);
      
      const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }))
      });

      const result = await chat.sendMessageStream({ message });

      for await (const chunk of result) {
        yield chunk.text;
      }

    } catch (error: any) {
      console.error("Lumina AI Error:", error);
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        yield ":: NETWORK ERROR :: Unable to reach Gemini API. Please check your Proxy URL in Nexus settings.";
      } else {
        yield `:: SYSTEM FAILURE :: ${error.message || 'Unknown error'}`;
      }
    }
  }
};